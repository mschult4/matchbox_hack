import React, { Component } from 'react';
import './Profile.css';
import './App.css'

class Profile extends Component {

    constructor(main_app) {
        super();
        this.state = {
            "boxers": {},
                        "boxer_id":sessionStorage.identity,
			"year": "",
			"first": "",
			"last": "",
			"hall": "",
			"year_u" : "",
			"first_u" : "",
			"last_u" : "",
			"hall_u" : "",
			"goes_by_u" : "",
			"experience_u" : "",
			"vet_years_u" : "",
			"weight_u" : "",
			"handedness_u" : "",
			"old_pw" : "",
			"new_pw" : "",
			"new_pw_check" : "",
	    "spars": {},
        };
        this.main = main_app;
        this.simpleQuery();
        this.sparQuery();
    }

	starQuery() {
		var URL = "https://okp1u501a5.execute-api.us-east-2.amazonaws.com/test/boxers";
		
		fetch(URL)
        .then(results => {
            return results.json();
        }).then(data => {

            this.setState({"boxers": data});
            console.log("state", this.state.boxers);
        })
	}

    simpleQuery() {
		var querylist = [];
		var bad_keys = ["hall_i", "last_i", "year_i", "first_i", "goes_by_i",  "eligible_i", "experience_i", "vet_years_i", "weight_i", "handedness_i", "captain_i", "gender_i", "experience_i", "hall_u", "last_u", "goes_by_u", "year_u", "first_u", "eligible_u", "experience_u", "vet_years_u", "weight_u", "handedness_u", "captain_u", "gender_u", "experience_u", "boxer_id_u", "hall_u", "last_u", "goes_by_u", "year_u", "first_u", "eligible_u", "experience_u", "vet_years_u", "weight_u", "handedness_u", "captain_u", "gender_u", "experience_u", "boxer_id_u"]
		for (var key in this.state) {
			if (key !== "boxers" && this.state[key] !== "" && !bad_keys.includes(key)) {
				var querystr = key;
				querystr += "=";
				querystr += this.state[key];
				querylist.push(querystr);
			}
		}

		var URL="https://okp1u501a5.execute-api.us-east-2.amazonaws.com/test/boxers";

		var middle = "";
		if (querylist.length !== 0) { 
			middle = "?"
			middle += querylist.join("&");
		}
				
        fetch(URL+middle)
        .then(results => {
            return results.json();
        }).then(data => {

            this.setState({"boxers": data});
            console.log("state", this.state.boxers);
        })
    }

	update() {
		var u_keys = ["hall_u", "last_u", "goes_by_u", "year_u", "first_u", "eligible_u", "experience_u", "vet_years_u", "weight_u", "handedness_u", "captain_u", "gender_u", "experience_u", "boxer_id_u"];
		var data = {};
		for (var i in u_keys) {
			if (this.state[u_keys[i]] !== "") {
				data[u_keys[i]] = this.state[u_keys[i]];
			}
		}

		var URL="https://okp1u501a5.execute-api.us-east-2.amazonaws.com/test/boxers";

		var put_dict = {body : JSON.stringify(data), 
			method: 'PUT',
			headers : {"Content-Type": "text/plain"} };
		
		fetch(URL, put_dict)
		.then(results => {
            return results.json();
        }).then(datum => {

            console.log("update", datum);
            console.log(datum[176]);
            var save = -1;
            for (var i = 0; i < datum.length; i = i + 1) {
                if (datum[i]['boxer_id'] == sessionStorage.identity) {
                    save = i;
                    break;
                }
            }    
            datum[0] = datum[save];
            var new_datum = []; 
            new_datum.push(datum[0]); 
			this.setState({"boxers": new_datum});
            console.log("state", this.state.boxers);
        })
	this.simpleQuery();	
	}

	updatePassword() {
		if (this.state.new_pw !== this.state.new_pw_check) {
			alert("New passwords do not match.");
			return;
		}
		var u_keys = ["old_pw", "new_pw", "new_pw_check", "boxer_id"];
		var data = {};
		for (var i in u_keys) {
			if (this.state[u_keys[i]] !== "") {
				data[u_keys[i]] = this.state[u_keys[i]];
			}
		}

		var URL="https://okp1u501a5.execute-api.us-east-2.amazonaws.com/test/signin";

		var put_dict = {body : JSON.stringify(data), 
			method: 'PUT',
			headers : {"Content-Type": "text/plain"} };
		
		fetch(URL, put_dict)
		.then(results => {
            return results.json();
        }).then(datum => {

            console.log("update password", datum);
	    if (datum[0]['verified'] == true)
                alert('Password has been updated.');
	    else
		alert('Password has not updated. Please make sure your old password is correct.');
        })
	this.simpleQuery();	
	}

    sparQuery() {
                var querylist = [];
                var querystr = "boxer_id";
                querystr += "=";
                querystr += this.state['boxer_id'];
                querylist.push(querystr);

                var URL="https://okp1u501a5.execute-api.us-east-2.amazonaws.com/test/spars";

                var middle = "";
                if (querylist.length !== 0) { //pretty later
                        middle = "?"
                        middle += querylist.join("&");
                }

        fetch(URL+middle)
        .then(results => {
            return results.json();
        }).then(data => {
            this.setState({"spars": data});
	    
        })
    }

	update_state(evt) {
		var temp = {};
		temp[evt.target.name] = evt.target.value;
                temp['boxer_id_u'] = sessionStorage.identity;
		this.setState(temp);
	}

	render() {
        let headings = ["mixed_first","mixed_last","mixed_goes_by","year","hall","eligible","experience","vet_years","weight","handedness","captain","gender"];
        let heading_disp = ["First Name", "Last Name", "Nickname", "Year", "Hall", "Eligible", "Experience", "Veteran Years", "Weight", "Handedness", "Captain", "Gender"];
        let spar_headings = ["date", "opp_first", "opp_last"];
	let spar_headings_disp = ['Date', 'Opponent'];
        var rows = [];
        var name = [];
        var spars = [];
   	spars.push(spar_headings_disp.map((str) => <th className="designated" key={str}>{str}</th>));
        for (var row_num = 0; row_num < this.state.boxers.length; row_num++) {

            	for (var i=0; i < headings.length; i++) {
			var values = [];
			if (headings[i] === 'mixed_first') {
			    var first = this.state.boxers[0]['mixed_first'];
			    var nick = this.state.boxers[0]['mixed_goes_by'];
			    if (nick === null) 
			        nick = " ";
			    else
			        nick = " \""+nick+"\" ";
			    var last = this.state.boxers[0]['mixed_last'];
	    		    name.push(<h2>{first+nick+last}</h2>);

			}
			else if (headings[i] === 'mixed_goes_by' || headings[i] === 'mixed_last')
			    continue;
			else {
			    values.push(<td className="profiledata" key={headings[i]}>{heading_disp[i]}</td>);
               		    values.push(<td className="profiledata" key={i}>{this.state.boxers[row_num][headings[i]]}</td>);
			}
			rows.push(<tr className="profilerow" key={row_num}>{values}</tr>);
            	}
        }

        for (var row_num = 0; row_num < this.state.spars.length; row_num++) {
		var values = [];
            	for (var i=0; i < spar_headings_disp.length; i++) {
			if (spar_headings_disp[i] === 'Opponent') {
			    var first = this.state.spars[row_num]['opp_first'];
                            var last = this.state.spars[row_num]['opp_last'];
                            values.push(<td key={i} className="designated">{first+" "+last}</td>);
                        }
			else
               		    values.push(<td className="designated" key={i}>{this.state.spars[row_num][spar_headings[i]]}</td>);
		}
		spars.push(<tr className="designated" key={row_num}>{values}</tr>);
        }
        return (
            <div className="App">
	    {name}
            <table id = "profile_table">
                <tbody>
                    {rows}
                </tbody>
            </table>
            <br />
			<form className = "profileform">
				<h4 id="desc">Enter data to update your profile.</h4><br/>
				<label className="profilelabel">
				First:<br /> 
				</label>
				<input className="profileinput" type="text" name="first_u" onChange={(evt) => this.update_state(evt)}/>
				<br />
				<br />
				<label className="profilelabel">
				Last:<br /> 
				</label>
				<input className="profileinput" type="text" name="last_u" onChange={(evt) => this.update_state(evt)}/>
				<br />
				<br />
				<label className="profilelabel">
				Nickname:<br /> 
				</label>
				<input className="profileinput" type="text" name="goes_by_u" onChange={(evt) => this.update_state(evt)}/>
				<br />
				<br />
				<label className="profilelabel">
				Year:<br /> 
				</label>
				<input className="profileinput" type="text" name="year_u" onChange={(evt) => this.update_state(evt)}/>
				<br />
				<br />
				<label className="profilelabel">
				Hall:<br /> 
				</label>
				<input className="profileinput" type="text" name="hall_u" onChange={(evt) => this.update_state(evt)}/>
				<br />
				<br />
				<label className="profilelabel">
				Experience:<br />
				</label>
				<select className="profileselect" name="experience_u" onChange={(evt) => this.update_state(evt)}>
					<option value=""></option>
					<option value="novice">Novice</option>
					<option value="veteran">Veteran</option>
				</select>
				<br />
				<br />
				<br />
				<label className="profilelabel">
				Veteran Years:<br />
				</label>
				<select className="profileselect" name="vet_years_u" onChange={(evt) => this.update_state(evt)}>
					<option value=""></option>
					<option value="0">0</option>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>
				<br />
				<br />
				<label className="profilelabel">
				Weight:<br />
				</label>
				<input className="profileinput" type="text" name="weight_u" onChange={(evt) => this.update_state(evt)}/>
				<br />
				<br />
				<label className="profilelabel">
				Handedness:<br />
				</label>
				<select className="profileselect" name="handedness_u" onChange={(evt) => this.update_state(evt)}>
					<option value=""></option>
					<option value="L">L</option>
					<option value="R">R</option>
				</select>
				<br />
				<br />

				<button className="littlebtn" type="button" onClick={() => this.update()}>Update</button>
			</form>
                        <br />
			<br />
			<br />
			<form className="profileform">
				<h4 id = "pw_desc">Change Password</h4><br/>
				<label className="profilelabel">
				Old Password:<br />
				</label>
				<input type="password" className="passinput" name="old_pw" onChange={(evt) => this.update_state(evt)}/>
				<br />
				<br />
				<label className="profilelabel">
				New Password:<br />
				</label>
				<input type="password" name="new_pw" className="passinput" onChange={(evt) => this.update_state(evt)}/>
				<br />
				<br />
				<label className="profilelabel">
				Re-Type New Password:
				</label>
				<input className="passinput" type="password" name="new_pw_check" onChange={(evt) => this.update_state(evt)}/>
				<br />
				<br />

				<button className="littlebtn" type="button" onClick={() => this.updatePassword()}>Update</button>
			</form>
			<br />
			<br />
			<br />
 			<form className="profileform">
                        	<h4 id="spar_desc">Your Past Spars</h4>
            			<table className = "designated">
                			<tbody className="designated">
                    				{spars}
                			</tbody>
            			</table>
			</form>
			<br />
            </div>
        );
    }

	
}

export default Profile;
