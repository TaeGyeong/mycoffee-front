import React from 'react'
import Button from '@material-ui/core/Button'

import { GoogleLogin } from 'react-google-login'
import './Login.css'


class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    responseGoogle = (response) => {
        console.log(response)
    }

    render() {
        return (
            <div>
                <div class="vimeo-wrapper">
                    <iframe src="https://player.vimeo.com/video/414864528?background=1&autoplay=1&loop=1&autopause=0&muted=1"
                        frameborder="0" allowTransparency="true" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                </div>

                <div id="main-content">
                    <h1>M y    C o f f e e</h1>
                    <GoogleLogin
                        clientId="1061461036283-hcaopt9772c0sfbel4094csbbvghhe8s.apps.googleusercontent.com"
                        // render={renderProps => (
                        //     <Button variant="contained" color="primary" 
                        //         disabled={renderProps.disabled} 
                        //         onClick={renderProps.onClick}
                        //     >
                        //         Get started with google
                        //     </Button>
                        // )}
                        buttonText="Get started with google"
                        onFailure={this.props.failFunc}
                        onSuccess={this.props.successFunc}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
            </div>
        )
    }
}
export default Login