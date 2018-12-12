import React from "react"

export default class Logo extends React.Component{
     render(){
        return(
            <div>
              <div className="toolbar-element">
                  <img className="logo" src={"/static/project_logo.png"}></img>
              </div>
              <div id="project-name" className="toolbar-element"><p>Calendar</p></div>
            </div>
        )
    }
}