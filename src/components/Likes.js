import React from 'react'
import { List, ListItem, ListItemText, Divider, Grid, Button } from '@material-ui/core'
import axios from 'axios'
import DetailDialog from './DetailDialog'

const url = "http://localhost:5432"
// const url = "http://http://192.168.0.2:5432"
const like_database_url = "https://mycoffee-276209.firebaseio.com"


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

const styles = theme => ({
    fab: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
    },
})

class Likes extends React.Component {
    constructor() {
        super()
        this.state = {
            detailOpen: false,
            detailData: {},
            data: []
        }
    }

    closeCafeDialog = (event) => {
        this.setState({
            detailOpen: false
        })
    }
    
    componentDidMount() {
        fetch(`${like_database_url}/like.json`).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText)
            }
            return res.json()
        }).then(likes => {
            console.log(likes)
            let list = []
            Object.keys(likes).forEach(cid => {
                if (likes[cid].id === sessionStorage.getItem("email")) {
                    list.push(likes[cid].cafeNum)
                }   
            })
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
            axios.post(
                `${url}/likecafe`, 
                {data: list},
                config
            ).then(res => {
                this.setState({
                    data: res.data
                })
            }).catch(err=> {
                console.log(err)
            })
        })
    }

    render() {
        const clat = sessionStorage.getItem("lat")
        const clng = sessionStorage.getItem("lng")
        const renderResult = (data) => {
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
                            
                            <DetailDialog 
                                openState={this.state.detailOpen} 
                                cafeData={this.state.detailData}
                                closeDialog={this.closeCafeDialog}
                            />
                        </div>
            })  
        }
        return (
            <div>
                {renderResult(this.state.data)}
            </div>
        )
    }
}

export default Likes