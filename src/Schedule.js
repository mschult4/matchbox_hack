import React, { Component } from 'react';
import './App.css';
import './Signups.css';

class Schedule extends Component {

    constructor(main_app) {
        super();
        this.getSignups();
        this.state = {
            day: "Monday",
            date: "5/7",
            date_format: "2018-05-07"
        };
        this.switchDay = this.switchDay.bind(this);
        this.isActive = this.isActive.bind(this);
        this.main = main_app;
    }

	getSignups() {
		var URL = "https://okp1u501a5.execute-api.us-east-2.amazonaws.com/test/signups";
		
		fetch(URL)
        .then(results => {
            return results.json();
        }).then(data => {

            this.setState({"signups": data});
            console.log("state", this.state.signups);
        })
	}

    renderTable(day) {
        var rows = [];
        for (var i=1; i<=15; i++) {
            var newRow = [];
            newRow.push(<td className="slot" key={i}>{i}</td>);
            //for (var day in {'2018-05-07':0, '2018-05-08':0, '2018-05-09':0, '2018-05-10':0, '2018-05-11':0}) {
                for (var ring=1; ring<=2; ring++) {
                    var found = false;
                    var full = false;
                    for (var item in this.state.signups) {
                        if (this.state.signups[item]["spar_slot"]===i && this.state.signups[item]["date"]===day && this.state.signups[item]["ring"]==ring) {
                            newRow.push(<td className="full" key={i+day+ring+found}>{this.state.signups[item]["mixed_first"]} {this.state.signups[item]["mixed_last"]}, {this.state.signups[item]["weight"]}, {this.state.signups[item]["experience"]}, {this.state.signups[item]["handedness"]}</td>);
                            if (found) {
                                full = true;
                            } else {
                                found = true;
                            }
                        }
                    }
                    if (!full) {
                        newRow.push(<td key={i+day+ring+"-1"} className="open_noclick">Open</td>);
                    }
                    if (!found) {
                        newRow.push(<td key={i+day+ring+"-2"} className="open_noclick">Open</td>);
                    }
                }
            //}
            rows.push(<tr key={i}>{newRow}</tr>);
        }
        return rows;
    }

    /* do I need this?
	update_state(evt) {
		var temp = {};
		temp[evt.target.name] = evt.target.value;
		this.setState(temp);
		console.log("state from test: ", evt.target.name);
	}
    */

    switchDay(day, date, date_format) {
        this.setState({"day": day});
        this.setState({"date": date});
        this.setState({"date_format": date_format});
    }

    isActive(day) {
        if (this.state.day === day) {
            return " active";
        } else {
            return "";
        }
    }

	render() {
        var rows = this.renderTable(this.state.date_format);
        console.log("rows", rows);
        return (
            <div className="signupscontainer">
                <h1>Spar Schedule - Week of 5/7/18</h1>
                <div className="tab">
                  <button className={"tablinks"+this.isActive("Monday")} onClick={() => this.switchDay("Monday", "5/7", "2018-05-07")}>Monday</button>
                  <button className={"tablinks"+this.isActive("Tuesday")} onClick={() => this.switchDay("Tuesday", "5/8", "2018-05-08")}>Tuesday</button>
                  <button className={"tablinks"+this.isActive("Wednesday")} onClick={() => this.switchDay("Wednesday", "5/9", "2018-05-09")}>Wednesday</button>
                  <button className={"tablinks"+this.isActive("Thursday")} onClick={() => this.switchDay("Thursday", "5/10", "2018-05-10")}>Thursday</button>
                  <button className={"tablinks"+this.isActive("Friday")} onClick={() => this.switchDay("Friday", "5/11", "2018-05-11")}>Friday</button>
                </div>
                <table className="signups" cellSpacing="10">
                <tbody>
                    <tr>
                        <th></th>
                        <th colSpan="4">{this.state.day}<br/>{this.state.date}</th>
                    </tr>
                    <tr>
                        <th>Slot #</th>
                        <th colSpan="2">Ring 1</th>
                        <th colSpan="2">Ring 2</th>
                    </tr>
                    {rows}
                </tbody>
                </table>
            </div>
        );
    }

	
}

export default Schedule;
