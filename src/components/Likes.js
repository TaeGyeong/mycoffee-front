import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Button, Fab, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import axios from 'axios'

const url = "http://localhost:5432"
const like_database_url = "https://mycoffee-276209.firebaseio.com"

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
        }
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
            
            axios.post(`${url}/likecafe`, {
                header: {
                    'Content-Type':'application/json'
                },
                data: JSON.stringify({'list': list})
            }).then(res => {
                console.log(res)
            }).catch(err=> {
                console.log(err)
            })
        })
    }

    render() {
        return (
            <div>
                test
            </div>
        )
    }
}

export default withStyles(styles)(Likes) 