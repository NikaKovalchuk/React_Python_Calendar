import React from "react"

export default class Account extends React.Component{
     render(){
        return(
            <div id="account-toolbar" className="toolbar-element">
                <button><a href={`/accounts/login/`}>LOGIN</a></button>
                <button><a href={`/accounts/logout/`}>LOGOUT</a></button>
            </div>
        )
    }
}