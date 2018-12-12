import React from "react"

const viewType = {
    day:0,
    week:1,
    month:2,
    year:3
}

export default class MenuView extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            view : viewType.day
        }
    }

    createList(){
        var list = []
        for (var i=0; i < 4; i++){
            list.push(<option key={i}>{viewType[i]} la{i}</option>)
        }
        return list
    }

    render(){
        return(
            <div className="toolbar-element">
                <select>
                    {this.createList()}
                </select>
            </div>
        )
    }
}