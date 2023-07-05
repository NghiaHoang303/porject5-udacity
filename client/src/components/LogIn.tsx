import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'
import './styles.css'
import backgroundImage from '../image/6245408.jpg'
interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div className='loginForm' >
        <h1 style ={{color: "white"}}>Please log in</h1>
        <div>
          <img src={backgroundImage} style={{height: "250px", width:"240px", borderRadius: "20%", paddingBottom:"20px"}}/>
        </div>
        <Button onClick={this.onLogin} size="huge" color="olive">
          Log in
        </Button>
      </div>
    )
  }
}
