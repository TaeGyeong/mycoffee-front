import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import DetailDialog from './DetailDialog'

const url = "http://localhost:5432"

const getDistanceFromLatLonInKm = (array) => {
    let lat1 = array[0]
    let lng1 = array[1]
    let lat2 = array[2]
    let lng2 = array[3]
    
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }
    let r = 6371; //지구의 반지름(km)
    let dLat = deg2rad(lat2-lat1);
    let dLon = deg2rad(lng2-lng1);
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = r * c; // Distance in km
    return Math.round(d * 1000) / 1000;
}


class CafeList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLatLng: {
                lat: 0,
                lng: 0,
            },
            loading: true,
            data: [],
            detailData: {},
            detailOpen: false,
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
                        console.log(res)
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
        console.log(event)
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

    render() {
        const cafeListData = this.state.data
        const renderResult = (data) => {
            let clat = sessionStorage.getItem("lat")
            let clng = sessionStorage.getItem("lng")

            data.sort(function(a, b) {
                let aDist = getDistanceFromLatLonInKm([clat, clng, a[10], a[11]])
                let bDist = getDistanceFromLatLonInKm([clat, clng, b[10], b[11]])
                
                return aDist > bDist ? 1 : aDist < bDist ? -1 : 0
            })

            return data.map(item => {
                return  <div>
                            <ListItem>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <ListItemText primary={item[7]} secondary={item[6]} />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <ListItemText secondary={getDistanceFromLatLonInKm([clat, clng, item[10], item[11]]) + ' ' + 'km'} />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button 
                                            variant="outlined" 
                                            color="primary"
                                            onClick={() => {
                                                this.setState({
                                                    detailData: {
                                                        title: item[7],
                                                        manageNum:item[0],
                                                        phoneNum:item[3],
                                                        address:item[6],
                                                        name:item[7],
                                                        position:{ lat: item[10], lng: item[11] }
                                                    },
                                                    detailOpen: true
                                                })
                                            }}
                                        >
                                            상세보기
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <Divider/>
                        </div>
            })  
        }

        return(
            <div>
                {
                    this.state.loading ? 
                    <CircularProgress /> :
                    <div>
                        <List>
                            {renderResult(this.state.data)}
                        </List>
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

export default CafeList