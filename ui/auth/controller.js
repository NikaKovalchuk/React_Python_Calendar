var authType = {
    signIn:0,
    signUp:1
}

var titleType = {
    0: "Sign In",
    1: "Sign Up"
}

class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          type: this.props.type,
        };
    }
    render(){
        return (
            <p>{ titleType[this.state.type] }</p>
        )
    }
}

class Body extends React.Component{
    render(){
        return (
            <p>sdads</p>
        )
    }
}

class Footer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            type: this.props.type,
            signUp: "http://127.0.0.1:8000/accounts/signup/",
            signIn: "http://127.0.0.1:8000/accounts/login/"
        };
    }

    render(){
        return (
            <div>
            {this.state.type == authType.signIn? (
              <a href={this.state.signUp}>{titleType[authType.signUp]}</a>
            ) : (
              <a href={this.state.signIn}>{titleType[authType.signIn]}</a>
            )}
            </div>
        )
    }
}

class Page extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          type: authType.signIn,

        };
    }

    render(){
        return (
            <div>
                <Header type={this.state.type}/>
                <Body/>
                <Footer type={this.state.type}/>
            </div>
        )
    }
}

//***************************

ReactDOM.render(
    <Page/>,
    document.getElementById('root')
);
