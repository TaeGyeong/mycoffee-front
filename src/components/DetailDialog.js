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


const brand_list = 
    ["스타벅스", "이디야"
    // "투썸", "투썸플레이스", "엔젤리너스", "커피빈", "구스토", "달콤커피", "메가커피", 
    // "바나프레소", "빽다방", "셀렉토", "요거프레소", "주커피", "드롭탑", "띠아모", "카페베네", "봄봄", 
    // "커핀그루나루", "커피마마", "커피에 반하다", "탐앤탐스", "폴 바셋", "할리스", "파스쿠찌", "쥬씨"]
    ]
const menu_list = {
    "스타벅스" : 
        "가격은 톨사이즈 기준입니다//" +
        "블랙 글레이즈드 라떼 : 6100//" +
        "돌체 라떼 : 5600//" +
        "화이트 초콜렛 모카 : 5600//" +
        "카페모카 : 5100//" +
        "카페라떼 : 4600//" +
        "디카페인 카페 아메리카노 : 4400//" +
        "카페 아메리카노 : 4100//" +
        "오늘의 커피 : 3800//" +
        "콜드 폼 콜드브루 : 5800//" +
        "바닐라 크림 콜드브루 : 5500//" +
        "콜드브루 : 4500//" +
        "라임 패션 티 : 5600//" +
        "자몽 허니 블랙 티 : 5300//" +
        "차이 티 라떼 : 5100//" +
        "유스베리 티 : 4100//" +
        "캐모마일 블렌드 티 : 4100//" +
        "민트 블렌드 티 : 4100//" +
        "히비스커스 블렌드 : 4100//" +
        "시그니처 초콜릿 : 5300//" +
        "유기농 말차 크림 프라푸치노 : 6300//" +
        "유기농 말차 라떼 : 6100//" +
        "그린티 라떼 : 5900//" +
        "제주 유기 녹차 : 4900//" +
        "이천 햅쌀커피/크림 : 6300//" +
        "그린 티 크림 : 6300//" +
        "화이트 딸기 크림 : 6100//" +
        "초콜릿 크림 칩 : 5700//" +
        "모카/카라멜 : 5600//" +
        "자몽 셔벗 : 6300//" +
        "망고바나나 : 6300//" +
        "망고 패션 후르츠 : 5000//" +
        "핑크 자몽 : 6300//" +
        "쿨 라임 : 5900//" +
        "블랙 티 레모네이드/패션 망고 티 레모네이드 : 5400//" +
        "바닐랑플랫화이트 : 5400//" +
        "돌체 콜드 브루 : 5800//" +
        "카라멜 마키야또 : 5600//" +
        "딸기 요거트 블렌디드 : 6100//" +
        "자바 칩 프라푸치노 : 6100"
        ,
    "이디야" :
        "가격은 R사이즈 기준입니다//" +
        "카페 아메리카노 : 3200//" +
        "카페 라떼 : 3700//" +
        "카푸치노 : 3700//" +
        "연유 카페 라뗴 : 3800//" +
        "카페 모카 : 3900//" +
        "카라멜 마끼아또 : 3900//" +
        "바닐라 라떼 : 3900//" +
        "화이트 초콜릿 모카 : 3900//" +
        "민트 모카 : 4200//" +
        "콜드브루 아메리카노 : 3700//" +
        "흑당 콜드브루 : 3700//" +
        "니트로커피 : 3900//" +
        "콜드브루 라떼 : 4200//" +
        "연유 콜드브루 : 4300//" +
        "콜드브루 화이트 비엔나 : 4500//" +
        "에이드 (레몬/자몽/청포도/라임) : 3800//" +
        "쉐이크 (오리진/초코쿠키/딸기) : 4300~4800//" +
        "아포카토 (오리지널/콜드브루 바닐라 모카/스트로베리 쿠키) : 4500~4800"
        ,
    
}

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
            let flag = false
            brand_list.forEach(item => {
                let idx = String(this.props.cafeData["title"]).indexOf(String(item))
                if (idx > -1) {
                    flag = true
                    this.setState({
                        priceData: menu_list[item]
                    })
                }
            })
            if (!flag) {
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
            } else {

            }
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