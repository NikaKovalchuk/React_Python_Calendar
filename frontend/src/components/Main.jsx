import React, {Component} from 'react';
import Schedule from "./schedule"
import "./css/main.css"
import SideBar from "./SideBar";

/**
 * Main component with all frontend stuff
 */
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