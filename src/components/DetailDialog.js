import React from 'react'
import { Divider, ListItem, Typography, Slide, Button, Dialog, ListItemText, List, IconButton, AppBar, Toolbar } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import axios from 'axios'

//////////////////////////////////////////////////////////////////////
const url = "http://localhost:5432"
const databaseURL = "https://mycoffee-276209.firebaseio.com/"
//////////////////////////////////////////////////////////////////////


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class DetailDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            priceData: '',
            like: false,
            cafeNum: this.props.cafeData["manageNum"]
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
        } 
    }

    likeClick = (event) => {
        if (this.state.like === true) {
            this.setState({
                like: false
            })
        } else {
            this.setState({
                like: true
            })
        }
    }
    
    render() {
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
