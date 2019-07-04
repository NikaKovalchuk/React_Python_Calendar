import React from "react";
import '../../css/calendar.css';
import PropTypes from "prop-types";
import NameOfDays from "./NameOfDays";
import CalendarHeader from "./CalendarHeader";
import Days from "./Days";

/**
 * Component for calendar picker.
 * Contains table with days.
 *
 * @param {object} selectedDate   Selected date.
 * @param {func} changeDate       onChange function.
 */
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

    onChangeDate = date => {
        this.setState({
            viewDate: date
        })
    };

    render() {
        return (
            <div className={'calendar'}>
                <CalendarHeader
                    viewDate={this.state.viewDate}
                    onChangeDate={this.onChangeDate}/>
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