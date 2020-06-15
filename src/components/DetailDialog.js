import React from 'react'
import { Divider, ListItem, Typography, Slide, Button, Dialog, ListItemText, List, IconButton, AppBar, Toolbar } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import axios from 'axios'

import { GoogleApiWrapper, Map, Marker } from 'google-maps-react'
import markerImg from './map_marker.svg'

//////////////////////////////////////////////////////////////////////
const url = "http://localhost:5432"
// const url = "http://http://192.168.0.2:5432"
const like_database_url = "https://mycoffee-276209.firebaseio.com"
//////////////////////////////////////////////////////////////////////


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class DetailDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            priceData: '',
            like: false,
            cafeNum: this.props.cafeData["manageNum"],
            position: this.props.cafeData["position"],
            currentId: ''
        }
    }
    
    getPrice = (number) => {
        return new Promise((resolve, reject) => {
            axios.get(url + "/price/" + String(number))
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject("에러!")
                })
        })
    }

    _post(like) {
        return new Promise((resolve, reject) => {
            fetch(`${like_database_url}/like.json`, {
                method: 'POST',
                body: JSON.stringify(like)
            }).then(res => {
                if (res.status !== 200) {
                    reject(new Error(res.statusText))
                }
                return res.json()
            }).then(data => {
                resolve(data)  
            })
        })
    }

    _delete() {
        // fetch(`${like_database_url}/like.json`).then(res => {
        //     if (res.status !== 200) {
        //         throw new Error(res.statusText)
        //     }
        //     return res.json()
        // }).then(like => {
        //     if (like !== null) {
        //         Object.keys(like).forEach(cid => {
        //             const num = like[cid].cafeNum
        //             const id = like[cid].id
        //             if (num === this.props.cafeData["manageNum"] && id === sessionStorage.getItem("email")) {
        //                 console.log("In setState", cid)
        //                 this.setState({
        //                     currentId: cid
        //                 })
        //             }
        //         })
        //     }
        // })
        
        console.log(this.state.currentId)

        return new Promise((resolve, reject) => {
            fetch(`${like_database_url}/like/${this.state.currentId}.json`, {
                method: 'DELETE'
            }).then(res => {
                if (res.status !== 200) {
                    reject(new Error(res.sta))
                }
                return res.json()
            }).then(() => {
                resolve("success")
            })
        })
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.cafeData["manageNum"] !== prevProps.cafeData["manageNum"]) {
            this.getPrice(this.props.cafeData["manageNum"])
                .then(res => {
                    if (res.data.length === 0) {
                        this.setState({
                            priceData:"가격정보없음"
                        })
                        return
                    }
                    let text = ''
                    res.data.forEach(item => {
                        text += String(item[1]) + " : "
                        let price = ''
                        Array(item[2]).forEach(i => {
                            price += String(i)
                        })
                        text += price + "//"
                    })
                    this.setState({
                        priceData: text,
                    })
                })
            // like 정보 json 으로 요청해서 있는지 확인하는 과정.
            fetch(`${like_database_url}/like.json`).then(res => {
                if (res.status !== 200) {
                    throw new Error(res.statusText)
                }
                return res.json()
            }).then(like => {
                this.setState({
                    like: false
                })
                if (like !== null) {
                    Object.keys(like).forEach(cid => {
                        const num = like[cid].cafeNum
                        const id = like[cid].id
                        if (num === this.props.cafeData["manageNum"] && id === sessionStorage.getItem("email")) {
                            this.setState({
                                like: true,
                                currentId: cid
                            })
                        }
                    })
                }
            })
        } 
    }

    likeClick = (event) => {
        const like_info = {
            cafeNum: this.props.cafeData["manageNum"],
            id: sessionStorage.getItem("email")
        }
        console.log(this.state.like)
        if (this.state.like === true) {
            this._delete()
                .then(res => {
                    // 성공시.
                    console.log(res)
                    this.setState({ 
                        like: false
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            // like 정보 입력.
            this._post(like_info)
                .then(res => {
                    console.log(res)
                    this.setState({
                        like: true,
                        currentId: res.name
                    })
                })
        }
    }
    
    render() {
        const containerStyle = {
            height: '300px',
            position: 'relative'

        }
        const data = this.props.cafeData
        const renderPrice = (data) => {
            return data.split("//").map(menu => {
                return <ListItem>
                            <ListItemText 
                                secondary={menu}
                            />
                        </ListItem>
            })
        }

        return (
            <Dialog fullScreen open={this.props.openState} onClose={this.props.closeDialog} TransitionComponent={Transition}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.props.closeDialog} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6">
                            {data["name"]}
                        </Typography>
                        {
                            this.state.like 
                            ?
                            <Button autoFocus style={{marginLeft: '60%'}} color="inherit" variant="outlined" onClick={this.likeClick}>
                                Dislike
                            </Button>
                            :
                            <Button autoFocus style={{marginLeft: '60%'}} color="inherit" variant="outlined" onClick={this.likeClick}>
                                Like
                            </Button>
                        }
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItem style={{height: 300}}>
                        {
                            data["position"] === undefined ? 
                            <div></div> :
                            <Map
                                style={containerStyle}
                                google={this.props.google} 
                                zoom={16}
                                center={data["position"]}
                                initialCenter={data["position"]}
                            >
                                <Marker
                                    title={"cafe"}
                                    position={data["position"]}
                                    icon={{
                                        url: markerImg,
                                        anchor: new window.google.maps.Point(32,32),
                                        scaledSize: new window.google.maps.Size(32,32)
                                    }}
                                />
                            </Map> 
                        }
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="주소" secondary={data["address"]}/>
                    </ListItem>
                    <Divider/>
                    <ListItem>
                        <ListItemText primary="전화번호" secondary={data["phoneNum"]}/>
                    </ListItem>
                    <Divider/>
                    <ListItem>
                        <ListItemText 
                            primary="가격정보"
                        >
                        </ListItemText>
                    </ListItem>
                    {renderPrice(this.state.priceData)}
                    <Divider/>
                </List>
            </Dialog>

        )
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyB6giwFozek3Opc5WmW14h2BnpSGv_VtEY"
})(DetailDialog);