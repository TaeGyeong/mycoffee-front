import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'
import axios from 'axios';
import Divider from '@material-ui/core/Divider'
import CircularProgress from '@material-ui/core/CircularProgress'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import { Radio, RadioGroup, FormControlLabel } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import DetailDialog from './DetailDialog'

///////////////////////////////////
const url = "http://localhost:5432"
///////////////////////////////////

const si_do = [
    {value: "1", label: "서울특별시"},
    {value: "2", label: "경기도"},
    {value: "3", label: "경상북도"},
    {value: "4", label: "경상남도"},
    {value: "5", label: "전라북도"},
    {value: "6", label: "전라남도"},
    {value: "7", label: "강원도"},
    {value: "8", label: "충청북도"},
    {value: "9", label: "충청남도"},
    {value: "10", label: "제주특별자치도"},
]
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
    return Math.round(d);
}

export default class Search extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            currentSido : '서울특별시',
            cafename: '',
            searchResult: [],
            condition: 'a',
            detailOpen: false,
            detailData: {},
            loading: false
        }
    }
    
    closeCafeDialog = (event) => {
        this.setState({
            detailOpen: false
        })
    }
    
    searchSubmit = (e) => {
        this.setState({
            loading: true
        })
        return new Promise((resolve, reject) => {
            axios.get(url + '/search/' + String(this.state.cafename) + '/' + String(this.state.currentSido))
                .then(res => {
                    this.setState({
                        loading: false,
                        searchResult: res.data
                    })
                    resolve(res)
                })
                .catch(err => {
                    this.setState({
                        loading: false
                    })
                    reject(err)
                })
        })
    }

    conditionChange = (event) => {
        if (sessionStorage.getItem("lat") === undefined || sessionStorage.getItem("lat") === undefined) {
            return
        }
        this.setState({
            condition: event.target.value
        })
    }

    handleCafename = (event) => {
        this.setState({
            cafename: event.target.value
        })
    }
    handleChange = (event) => {
        this.setState({
            currentSido: event.target.value
        })
    }

    render() {
        const result = this.state.searchResult
        const clat = sessionStorage.getItem("lat")
        const clng = sessionStorage.getItem("lng")
        const renderResult = (data) => {
            if (this.state.condition === 'a') {
                data.sort(function(a, b) {
                    return a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0
                })
            } else {
                data.sort(function(a, b) {
                    let aDist = getDistanceFromLatLonInKm([clat, clng, a[0][10], a[0][11]])
                    let bDist = getDistanceFromLatLonInKm([clat, clng, b[0][10], b[0][11]])
                    
                    return aDist > bDist ? 1 : aDist < bDist ? -1 : 0
                })
            }
            
            return data.map(item => {
                return  <div>
                            <ListItem>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <ListItemText primary={item[0][7]} secondary={item[0][6]} />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <ListItemText secondary={getDistanceFromLatLonInKm([clat, clng, item[0][10], item[0][11]]) + ' ' + 'km'} />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button 
                                            variant="outlined" 
                                            color="primary"
                                            onClick={() => {
                                                this.setState({
                                                    detailData: {
                                                        title: item[0][7],
                                                        manageNum:item[0][0],
                                                        phoneNum:item[0][3],
                                                        address:item[0][6],
                                                        name:item[0][7],
                                                        position:{ lat: item[0][10], lng: item[0][11] }
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
        return (
            <div>
                {!this.state.loading ? 
                    <div>
                    <Grid container spacing={5}>
                        <Grid item xs={8}>
                        <TextField
                            required
                            id="filled-required"
                            label="카페명 / 지역명"
                            //defaultValue=""
                            style={{width: '90%'}}
                            variant="outlined"
                            onChange={this.handleCafename}
                        />  
                        </Grid>
                        <Grid item xs={2}>
                            <TextField 
                                select
                                required
                                label="지역선택"
                                variant="outlined"
                                value={this.state.currentSido}
                                onChange={this.handleChange}
                                style={{width:'100%', height:'100%'}}
                            >
                                {si_do.map((option) => (
                                    <MenuItem key={option.value} value={option.label}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton 
                                type="submit" 
                                aria-label="search"
                                onClick={this.searchSubmit}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={6}>
                            <Radio
                                checked={this.state.condition === 'a'}
                                value="a"
                                name="condition-radio"
                                inputProps={{ 'aria-label': 'A' }}
                                onClick={this.conditionChange}
                            /> 
                            정확도 우선
                        </Grid>
                        <Grid item xs={6}>
                            <Radio
                                checked={this.state.condition === 'b'}
                                value="b"
                                name="condition-radio"
                                inputProps={{ 'aria-label': 'B' }}
                                onClick={this.conditionChange}
                            />
                            짧은 거리 우선
                        </Grid>
                    </Grid>
                    <List>
                        {renderResult(result)}
                    </List>
                    <DetailDialog 
                            openState={this.state.detailOpen} 
                            cafeData={this.state.detailData}
                            closeDialog={this.closeCafeDialog}
                    /> 
                    </div>
                : 
                    <CircularProgress />
                }
            </div> 
        )
    }
}