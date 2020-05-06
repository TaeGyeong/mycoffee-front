import React from 'react'
import GoogleMapReact from 'google-map-react'
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react'

const AnyReactComponent = ({ text }) => <div>{text}</div>

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLatLng: {
                lat: 0,
                lng: 0,
            },
            zoom: 14,
        }
    }

    showCurrentLocation = () => {
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
                }
            )
        } else {
            console.log('GEOLOCATION IS NOT SUPPORTED IN THIS DEVICE')
        }
    }

    componentDidMount() {
        this.showCurrentLocation()
    }

    render() {
        const {lat, lng} = this.state.currentLatLng
        
        return (
            <div>
                <Map 
                    google={this.props.google} 
                    zoom={this.state.zoom}
                    center={{lat, lng}}
                    initialCenter={{lat, lng}}
                    onClick={this.onMapClicked}
                >
                    <Marker name={"1"} mapCenter={{lat, lng}}/>
                    <Marker name={"2"} mapCenter={{lat, lng}}/>
                    <Marker name={"3"} mapCenter={{lat, lng}}/>
                    <Marker name={"4"} mapCenter={{lat, lng}}/>
                    <InfoWindow>
                        <div>
                            <h1>test</h1>
                        </div>
                    </InfoWindow>
                </Map>
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyB6giwFozek3Opc5WmW14h2BnpSGv_VtEY"
})(Home);