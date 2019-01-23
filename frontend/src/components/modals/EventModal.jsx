import React from 'react';
import "../../css/form.css"
import {events} from "../../actions";
import {connect} from "react-redux";
import Modal from "./Modal"
import moment from "moment";


class EventModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: "",
            text: "",
            id: this.props.id,
            start_date: null,
            finish_date: null,
            cycle: 0,
            isOpen: false,
            CycleOptions: [{0: 'No'}, {1: 'Day'}, {2: 'Week'}, {3: 'Month'}, {4: 'Year'}] // заменить на enum
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let hour = new Date().getHours()
        if (nextProps.date != null) {
            let date = new Date(nextProps.date)
            date = new Date(date.setHours(hour))
            date = moment(date).format();
            let value = date.replace(/\+[0-9]*\:[0-9]*/, '')
            this.setState({
                start_date: value
            })

            date = new Date(date)
            date = new Date(date.setHours(hour + 1))
            date = moment(date).format();
            value = date.replace(/\+[0-9]*\:[0-9]*/, '')
            this.setState({
                finish_date: value
            })
        }
        if (nextProps.data != {}) {
            if (nextProps.data.start_date) {
                let date = moment(nextProps.data.start_date).format();
                let value = date.replace(/\+[0-9]*\:[0-9]*/, '')
                this.setState({
                    start_date: value
                })
            }
            if (nextProps.data.finish_date) {
                let date = moment(nextProps.data.finish_date).format();
                let value = date.replace(/\+[0-9]*\:[0-9]*/, '')
                this.setState({
                    finish_date: value
                })
            }
            this.setState({
                id: nextProps.data.id,
                title: nextProps.data.title,
                text: nextProps.data.text,
                cycle: nextProps.data.cycle,
            })
        }
    }

    select() {
        let options = []
        options = this.state.CycleOptions.map((o) => {
            o.key = Object.keys(o)[0]
            o.value = Object.values(o)[0]
            return (
                <option className="input"
                        key={o.key}
                        value={o.key}>
                    {o.value}</option>
            );
        });
        return <select className="input" value={this.state.cycle}
                       onChange={(e) => {
                           this.setState({cycle: e.target.value})
                       }}
        >{options}</select>
    }

    onOk = () => {
        let event = {
            id: this.state.id,
            title: this.state.title,
            text: this.state.text,
            start_date: this.state.start_date,
            finish_date: this.state.finish_date,
            cycle: this.state.cycle,
        }
        this.props.onOk(event)
    };

    delete = () => {
        this.props.deleteEvent(this.state.id)
        this.props.onCancel()
    };

    toggleModal = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        let buttons;
        if (this.state.id) {
            buttons = <div className={'button-group'}>
                <button className={"btn btn-secondary"} onClick={this.props.onCancel}> CANCEL</button>
                <button className={"btn btn-danger"} onClick={this.toggleModal}> DELETE</button>
                <button className={"btn btn-secondary"} onClick={this.onOk}> OK</button>
            </div>
        } else {
            buttons = <div className={'button-group'}>
                <button className={"btn btn-secondary"} onClick={this.props.onCancel}> CANCEL</button>
                <button className={"btn btn-secondary"} onClick={this.onOk}> OK</button>
            </div>
        }

        return (
            <div className="backdrop">
                <div className="event-modal-window">
                    <div className="header">
                        Event Form
                    </div>
                    <div className="event-modal-body">
                        <div className="form">
                            <form className="dynamic-form">
                                <div key={'gtitle'} className="group">
                                    <label className="label" key={'ltitle'} htmlFor={'title'}> Title </label>
                                    <input className="input" type={'text'} key={'title'} value={this.state.title}
                                           onChange={(e) => {
                                               this.setState({title: e.target.value})
                                           }}/>
                                </div>
                                <div key={'gtext'} className="group">
                                    <label className="label" key={'ltext'} htmlFor={'text'}> Text </label>
                                    <input className="input" type={'text'} key={'text'} value={this.state.text}
                                           onChange={(e) => {
                                               this.setState({text: e.target.value})
                                           }}/>
                                </div>
                                <div key={'gstart_date'} className="group">
                                    <label className="label" key={'lstart_date'} htmlFor={'start_date'}> Start
                                        Date </label>
                                    <input className="input" type={'datetime-local'} key={'start_date'}
                                           value={this.state.start_date}
                                           onChange={(e) => {
                                               this.setState({start_date: e.target.value})
                                           }}/>
                                </div>
                                <div key={'gfinish_date'} className="group">
                                    <label className="label" key={'lfinish_date'} htmlFor={'finish_date'}> Finish
                                        Date </label>
                                    <input className="input" type={'datetime-local'} key={'finish_date'}
                                           value={this.state.finish_date}
                                           onChange={(e) => {
                                               this.setState({finish_date: e.target.value})
                                           }}/>
                                </div>
                                <div key={'gcycle'} className="group">
                                    <label className="label" key={'lcycle'} htmlFor={'cycle'}> Repeat </label>
                                    {this.select()}
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="event-footer">
                        {buttons}
                    </div>
                    <Modal show={this.state.isOpen} onCancel={this.toggleModal} onOk={this.delete}
                           header={"Remove event \"" + this.state.title + "\""}>
                        Are you sure that you wanr to remove event "{this.state.title}"? <br></br>
                        This is a permanent changes.
                    </Modal>
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
        deleteEvent: (id) => {
            dispatch(events.deleteEvent(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventModal);