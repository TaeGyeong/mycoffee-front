import React from 'react'
import {Link as RouterLink} from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { AppBar, Drawer, MenuItem, IconButton, Link } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import Login from './Login'

const styles = {
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: 'auto',
    },
    
}

class Appshell extends React.Component {
    constructor(props) {
        super(props)
        let loggedin = window.sessionStorage.getItem('isLoggedIn')
        this.state = {
            toggle: false,
            isLoggedIn: loggedin,
            id: '',
            name: '',
        }
    }

    handleDrawerToggle = () => this.setState({ toggle: !this.state.toggle })

    LoginFail = (err) => {
        console.error(err)
    }
    LoginSuccess = (res) => {
        console.log(res)
        this.setState({
            id: res.googleId,
            name: res.profileObj.name,
            isLoggedIn: true,
        })
        window.sessionStorage.setItem('id', res.googleId)
        window.sessionStorage.setItem('name', res.profileObj.name)
        window.sessionStorage.setItem('isLoggedIn', true)
    }

    render() {
        const { classes } = this.props
        if (!this.state.isLoggedIn) {
            return (
                <Login 
                    successFunc={this.LoginSuccess}
                    failFunc={this.LoginFail}
                />
            )
        } else {
            return (
                <div>
                    <div className={classes.root}>
                        <AppBar position="static">
                            <IconButton className={classes.menuButton} color="inherit" onClick={this.handleDrawerToggle}>
                                <MenuIcon />
                            </IconButton>
                        </AppBar>
                        <Drawer open={this.state.toggle}>
                            <MenuItem onClick={this.handleDrawerToggle}>
                                <Link component={RouterLink} to="/">
                                    Home
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={this.handleDrawerToggle}>
                                <Link component={RouterLink} to="/texts">
                                    텍스트관리
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={this.handleDrawerToggle}>
                                <Link component={RouterLink} to="/words">
                                    단어 관리
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={this.handleDrawerToggle}>
                                <Link component={RouterLink} to="/test">
                                    지방허가데이터테스트
                                </Link>
                            </MenuItem>
                        </Drawer>
                    </div>
                    <div id="content" style={{margin:'auto', marginTop:'20px'}}>
                        {React.cloneElement(this.props.children)}
                    </div>
                </div>
            )
        }
    }
}

export default withStyles(styles)(Appshell)
