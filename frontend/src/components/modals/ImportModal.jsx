import React, {Component} from 'react';
import "../../css/form.css"
import {events} from "../../actions";
import {connect} from "react-redux";

class ImportModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            search: "",
            isOpen: false,
            calendars: {}
        };
    }


    componentDidMount(nextProps, nextContext) {
        this.props.loadCalendars().then(response => {
            this.setState({calendars: this.props.events});
        });
    }

    onOk = () => {
        let calendar = {
            id: this.state.id,
            name: this.state.name,
            access: this.state.access,
            color: this.state.color,
        }
        this.props.onOk(calendar)
    };

    delete = () => {
        this.props.deleteCalendar(this.state.id).then(response => {
            this.props.onCancel()
        })
    };

    search = () => {
        let result = []
        for (let index = 0; index < this.state.calendars.length; index++) {
            let calendar = this.state.calendars[index]

        console.log(calendar)
            if ((calendar.name.indexOf(this.state.search) + 1) || this.state.search == "") {
                result.push(<div className={"variant"}>{calendar.name} </div>)
            }
        }
        return <div>{result}</div>
    }


    render() {
        if (!this.props.show) {
            return null;
        }

        return (
            <div className="backdrop">
                <div className="modal-window event">
                    <div className="header">
                        <h1>Import calendar</h1>
                    </div>
                    <div className="modal-body">
                        <div className="form">
                            <form>
                                <div key={'gname'} className="group">
                                    <label className="label" key={'lsearch'}
                                           htmlFor={'search'}> Search line </label>
                                    <input className="input" type={'text'} key={'search'} value={this.state.search}
                                           onChange={(e) => {
                                               this.setState({search: e.target.value})
                                           }}/>
                                </div>

                                <div className={"variants"}>
                                    {this.search()}
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="footer">
                        <div className={'button-group'}>
                            <button className={"btn btn-secondary"} onClick={this.props.onCancel}> CANCEL</button>
                            <button className={"btn btn-secondary"} onClick={this.onOk}> OK</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        events: state.events,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadCalendars: () => {
            return dispatch(events.loadCalendars(true));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportModal);