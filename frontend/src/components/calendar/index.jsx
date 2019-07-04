import React from "react";
import '../../css/calendar.css';
import PropTypes from "prop-types";
import NameOfDays from "./NameOfDays";
import CalendarHeader from "./CalendarHeader";
import Days from "./Days";

class Calendar extends React.Component {
    state = {
        selectedDate: this.props.selectedDate,
        viewDate: this.props.selectedDate,
    };

    componentWillReceiveProps(props) {
        if (props.selectedDate) {
            if (props.selectedDate !== this.state.selectedDate) {
                this.setState({
                    selectedDate: props.selectedDate,
                    viewDate: props.selectedDate
                });
            }
        }
    };

    onDateClick = day => {
        this.setState({selectedDate: day});
        this.props.changeDate(day);
    };

    changeViewDate = date => {
        this.setState({
            viewDate: date
        })
    };

    render() {
        return (
            <div className={'calendar'}>
                <CalendarHeader
                    viewDate={this.state.viewDate}
                    changeViewDate={this.changeViewDate}/>
                <NameOfDays/>
                <Days
                    viewDate={this.state.viewDate}
                    selectedDate={this.state.selectedDate}
                    onDateClick={this.onDateClick}/>
            </div>
        );
    }
}


Calendar.propTypes = {
    selectedDate: PropTypes.object,
    changeDate: PropTypes.func
};

export default Calendar;