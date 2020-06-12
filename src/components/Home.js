import React from 'react'
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import DetailDialog from './DetailDialog'

import markerImg from './map_marker.svg'

///////////////////////////////////
const url = "http://localhost:5432"
///////////////////////////////////

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            currentLatLng: {
                lat: 0,
                lng: 0,
            },
            zoom: 16,
            data: [],
            detailData: {},
            detailOpen: false,
            infoWin: false
        }
    }

    async showCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        this.setState(prevState => ({
                            currentLatLng: {
                                ...prevState.currentLatLng,
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            },
                        }))
                        sessionStorage.setItem("lat", position.coords.latitude)
                        sessionStorage.setItem("lng", position.coords.longitude)
                        resolve(position)
                    }
                )
            } else {
                reject("GEOLOCATION IS NOT SUPPORTED IN THIS DEVICE")
            }
        })
    }

    componentDidMount() {
        this.showCurrentLocation()
            .then(res => {
                axios.get(url + "/all_data/" + parseFloat(res.coords.latitude) + "/" + parseFloat(res.coords.longitude))
                    .then(res => {
                        this.setState({
                            data: res.data,
                            loading: false
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }

    openCafeDialog = (event) => {
        this.setState({
            detailData: event,
            detailOpen: true
        })
    }

    closeCafeDialog = (event) => {
        this.setState({
            detailOpen: false
        })
    }

    moveCenter = (coord) => {
        const { latLng } = coord
        const lat = latLng.lat()
        const lng = latLng.lng()

        this.setState(prevState => ({
            currentLatLng: {
                ...prevState.currentLatLng,
                lat: lat,
                lng: lng
            },
            loading: true
        }))
        axios.get(url + "/all_data/" + parseFloat(lat) + "/" + parseFloat(lng))
            .then(res => {
                this.setState({
                    data: res.data,
                    loading: false
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        const {lat, lng} = this.state.currentLatLng
        const cafeList = this.state.data
        const renderMarker = () => {
            return cafeList.map((cafe, i) => {
                return <Marker
                        title={cafe[7]}
                        manageNum={cafe[0]}
                        phoneNum={cafe[3]}
                        address={cafe[6]}
                        name={cafe[7]}
                        position={{ lat: cafe[10], lng: cafe[11] }}
                        onClick={this.openCafeDialog}
                        />
            })
        }
        const containerStyle = {
            position: 'relative',  
            width: '100%',
            height: '90%'

        }

        return (   
            <div>
                {
                    this.state.loading ? 
                    <CircularProgress/> :
                    <div>
                        <Map
                            style={containerStyle}
                            google={this.props.google} 
                            zoom={this.state.zoom}
                            center={{lat, lng}}
                            initialCenter={{lat, lng}}
                            onClick={this.onMapClicked}
                        >
                            {renderMarker()}
                            <Marker
                                title="내 위치"
                                name={"myposition"}
                                draggable={true}
                                onDragend={(t, map, coord) => this.moveCenter(coord)}
                                position={{ lat: lat, lng: lng }}
                                icon={{
                                    url: markerImg,
                                    anchor: new window.google.maps.Point(32,32),
                                    scaledSize: new window.google.maps.Size(32,32)
                                }}
                            />
                        </Map>
                        <DetailDialog 
                            openState={this.state.detailOpen} 
                            cafeData={this.state.detailData}
                            closeDialog={this.closeCafeDialog}
                        />
                    </div>
                }
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyB6giwFozek3Opc5WmW14h2BnpSGv_VtEY"
})(Home);