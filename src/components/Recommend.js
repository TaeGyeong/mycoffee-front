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
const like_database_url = "https://mycoffee-276209.firebaseio.com"
// const url = "http://http://192.168.0.2:5432"

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


class Recommend extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLatLng: {
                lat: 0,
                lng: 0,
            },
            loading: true,
            like_countCheck: true,
            likeList: [],
            data: [],
            detailData: {},
            detailOpen: false,
        }   
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

    componentDidMount() {
        // firebase 에서 좋아요 정보 가져오기.
        fetch(`${like_database_url}/like.json`).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText)
            }
            return res.json()
        }).then(like => {
            console.log(like)
            let likeList = []
            if (like !== null) {
                Object.keys(like).forEach(cid => {
                    const num = like[cid].cafeNum
                    const id = like[cid].id
                    
                    if (id === sessionStorage.getItem("email")) {
                        likeList.push(num)
                    }
                })
            }
            
            
            this.setState({likeList: likeList})
            console.log(this.state.likeList)
            if (this.state.likeList.length < 10) {
                this.setState({
                    loading: false,
                })
                alert(`찜한 가게가 10개 이상이여야 추천 가능합니다! 현재 ${this.state.likeList.length}개`)
                this.props.history.push('/')
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
            axios.post(
                `${url}/${sessionStorage.getItem("email")}/ratings`, 
                {data: this.state.likeList},
                config
            ).then(res => {
                console.log(res)
                this.setState({
                    data: res.data,
                    loading: false,
                    like_countCheck: false
                })
            }).catch(err=> {
                console.log(err)
            })
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
                    this.state.like_countCheck ?
                    <div>check</div> :
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

export default Recommend;