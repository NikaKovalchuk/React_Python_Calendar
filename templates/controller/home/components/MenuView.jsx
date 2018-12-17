import React from "react"

const viewType = {
    0:'day',
    1:'week',
    2:'month',
    3:'year',
}

export default class MenuView extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            view : viewType[0]
        }
    }

    createList(){
        var list = []
        for (var i=0; i < 4; i++){
            list.push(<option key={i}>{viewType[i]}</option>)
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