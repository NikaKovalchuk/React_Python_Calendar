import React, {Component} from 'react';
import Schedule from "./schedule"
import "../css/main.css"
import SideBar from "./SideBar";

class Main extends Component {
    render() {
        return (
            <div className={"main-content"}>
                <SideBar/>
                <Schedule/>
            </div>
        )
    }
}

export default Main;