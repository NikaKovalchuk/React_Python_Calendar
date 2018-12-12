import React from "react"

export default class Logo extends React.Component{
     render(){
        return(
            <div className="toolbar-element" id="logo-toolbar">
              <div id="project_name">Calendar</div>
              <div id="project_logo">
                  <img className="logo" src={"/static/project_logo.png"}></img>
              </div>
            </div>
        )
    }
}