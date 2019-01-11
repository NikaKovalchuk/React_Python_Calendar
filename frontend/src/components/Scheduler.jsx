import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";

const viewType = {day:1, week:2, month:3}
const viewNames = {1:"Day", 2:"Week", 3:"Month"}

class Scheduler extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view : viewType.month
        };

        this.changeView = this.changeView.bind(this);
    }

    componentDidMount() {
        this.props.loadUser().then(response => {
            this.setState({
                user: this.props.auth.user
            });
        });
    }

    changeView(newView){
        this.setState({
            view: newView
        })
    }

    renderButtons() {
       return (
            <div className={'shedule-buttons'}>
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => this.changeView(viewType.day)}>Day</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => this.changeView(viewType.week)}>Week</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => this.changeView(viewType.month)}>Month</button>
                </div>
            </div>
        )
    }

    renderDayTable(){
        return(
            <table>
                <thead>
                    <tr>
                        <td> Time </td>
                        <td> Events </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td> 0:00 AM</td>
                    </tr>
                    <tr>
                        <td> 1:00 AM</td>
                    </tr>
                    <tr>
                        <td> 2:00 AM</td>
                    </tr>
                    <tr>
                        <td> 3:00 AM</td>
                    </tr>
                    <tr>
                        <td> 4:00 AM</td>
                    </tr>
                    <tr>
                        <td> 5:00 AM</td>
                    </tr>
                    <tr>
                        <td> 6:00 AM</td>
                    </tr>
                    <tr>
                        <td> 7:00 AM</td>
                    </tr>
                    <tr>
                        <td> 8:00 AM</td>
                    </tr>
                    <tr>
                        <td> 9:00 AM</td>
                    </tr>
                    <tr>
                        <td> 10:00 AM</td>
                    </tr>
                    <tr>
                        <td> 11:00 AM</td>
                    </tr>

                    <tr>
                        <td> 12:00 PM</td>
                    </tr>
                    <tr>
                        <td> 1:00 PM</td>
                    </tr>
                    <tr>
                        <td> 2:00 PM</td>
                    </tr>
                    <tr>
                        <td> 3:00 PM</td>
                    </tr>
                    <tr>
                        <td> 4:00 PM</td>
                    </tr>
                    <tr>
                        <td> 5:00 PM</td>
                    </tr>
                    <tr>
                        <td> 6:00 PM</td>
                    </tr>
                    <tr>
                        <td> 7:00 PM</td>
                    </tr>
                    <tr>
                        <td> 8:00 PM</td>
                    </tr>
                    <tr>
                        <td> 9:00 PM</td>
                    </tr>
                    <tr>
                        <td> 10:00 PM</td>
                    </tr>
                    <tr>
                        <td> 11:00 PM</td>
                    </tr>
                </tbody>
            </table>
        )
    }

    renderWeekTable(){
        return(
            <div> <table>
                <thead>
                    <tr>
                        <td> Time </td>
                        <td> Events </td>
                        <td> Events </td>
                        <td> Events </td>
                        <td> Events </td>
                        <td> Events </td>
                        <td> Events </td>
                        <td> Events </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td> 0:00 AM</td>
                    </tr>
                    <tr>
                        <td> 1:00 AM</td>
                    </tr>
                    <tr>
                        <td> 2:00 AM</td>
                    </tr>
                    <tr>
                        <td> 3:00 AM</td>
                    </tr>
                    <tr>
                        <td> 4:00 AM</td>
                    </tr>
                    <tr>
                        <td> 5:00 AM</td>
                    </tr>
                    <tr>
                        <td> 6:00 AM</td>
                    </tr>
                    <tr>
                        <td> 7:00 AM</td>
                    </tr>
                    <tr>
                        <td> 8:00 AM</td>
                    </tr>
                    <tr>
                        <td> 9:00 AM</td>
                    </tr>
                    <tr>
                        <td> 10:00 AM</td>
                    </tr>
                    <tr>
                        <td> 11:00 AM</td>
                    </tr>

                    <tr>
                        <td> 12:00 PM</td>
                    </tr>
                    <tr>
                        <td> 1:00 PM</td>
                    </tr>
                    <tr>
                        <td> 2:00 PM</td>
                    </tr>
                    <tr>
                        <td> 3:00 PM</td>
                    </tr>
                    <tr>
                        <td> 4:00 PM</td>
                    </tr>
                    <tr>
                        <td> 5:00 PM</td>
                    </tr>
                    <tr>
                        <td> 6:00 PM</td>
                    </tr>
                    <tr>
                        <td> 7:00 PM</td>
                    </tr>
                    <tr>
                        <td> 8:00 PM</td>
                    </tr>
                    <tr>
                        <td> 9:00 PM</td>
                    </tr>
                    <tr>
                        <td> 10:00 PM</td>
                    </tr>
                    <tr>
                        <td> 11:00 PM</td>
                    </tr>
                </tbody>
            </table>
            </div>
        )
    }

    renderMonthTable(){
        return(
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }


    renderTable() {
       let table;
       if (this.state.view === viewType.day ){
           table = this.renderDayTable()
       }
       else if (this.state.view === viewType.week ){
           table = this.renderWeekTable()
       }
       else{
            table = this.renderMonthTable()
       }
       return (
            <div className={'shedule-table'}>
                {table}
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderButtons()}
                {this.renderTable()}
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        auth: state.auth,
        events: state.events,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => {
            return dispatch(auth.loadUser());
        },
        export: () => {
            return dispatch(events.exportEvents());
        },
        import: () => {
            return dispatch(events.importEvents());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);