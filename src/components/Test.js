import React from 'react'
import axios from 'axios'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

const getData = async () => {
    try {
        return await axios.post('http://www.localdata.kr/platform/rest/07_24_05_P/openDataApi?authKey=xQS7fuk9WPlqvHclJQe6ag1Qa3uyY29TQx=qMkmKnNo=&localCode=6110000&state=01&pageSize=100', {
            headers: {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            }
        })
    } catch (err) {
        console.log('error!!')
        console.error(err)
    }
}

class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            message: '',
        }
    }
    
    render() {
        return(
            <Card>
                <CardContent>
                    Test page
                </CardContent>
                <Button onClick={async () => {
                    let res = await getData()
                    this.setState({
                        message:res
                    })
                }}>
                    load data
                </Button>
                <CardContent>
                    
                </CardContent>
            </Card>
        )
    }
}

export default Home;