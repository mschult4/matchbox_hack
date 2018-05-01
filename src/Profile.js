import React, { Component } from 'react';
import './Profile.css';

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
        };
        this.main = main_app;
        this.simpleQuery();
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
		console.log("top of simple: ", this.state.year);	
		var querylist = [];
		var bad_keys = ["hall_i", "last_i", "year_i", "first_i", "goes_by_i",  "eligible_i", "experience_i", "vet_years_i", "weight_i", "handedness_i", "captain_i", "gender_i", "experience_i", "hall_u", "last_u", "goes_by_u", "year_u", "first_u", "eligible_u", "experience_u", "vet_years_u", "weight_u", "handedness_u", "captain_u", "gender_u", "experience_u", "boxer_id_u", "hall_u", "last_u", "goes_by_u", "year_u", "first_u", "eligible_u", "experience_u", "vet_years_u", "weight_u", "handedness_u", "captain_u", "gender_u", "experience_u", "boxer_id_u"]
		for (var key in this.state) {
			console.log("key: ", key);
			console.log("value: ", this.state[key]);
			if (key !== "boxers" && this.state[key] !== "" && !bad_keys.includes(key)) {
				var querystr = key;
				querystr += "=";
				querystr += this.state[key];
				querylist.push(querystr);
				console.log(querylist);
			}
		}

		var URL="https://okp1u501a5.execute-api.us-east-2.amazonaws.com/test/boxers";

		var middle = "";
		console.log(querylist);
		if (querylist.length !== 0) { //pretty later
			middle = "?"
			middle += querylist.join("&");
			console.log(middle);
		}
				
        fetch(URL+middle)
        .then(results => {
            return results.json();
        }).then(data => {

            this.setState({"boxers": data});
            console.log("state", this.state.boxers);
            console.log(this.state.boxers[0]);
        })
    }

	update() {
		console.log("in insert", this.state);
		var u_keys = ["hall_u", "last_u", "goes_by_u", "year_u", "first_u", "eligible_u", "experience_u", "vet_years_u", "weight_u", "handedness_u", "captain_u", "gender_u", "experience_u", "boxer_id_u"];
		var data = {};
		for (var i in u_keys) {
			if (this.state[u_keys[i]] !== "") {
				data[u_keys[i]] = this.state[u_keys[i]];
			}
		}
		console.log("body: ", data);

		var URL="https://okp1u501a5.execute-api.us-east-2.amazonaws.com/test/boxers";

		var put_dict = {body : JSON.stringify(data), 
			method: 'PUT',
			headers : {"Content-Type": "text/plain"} };
		
		console.log("put_dict", put_dict);
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
                    console.log(save, i);
                    break;
                }
            }    
            console.log("save", save);  
            datum[0] = datum[save];
            console.log(datum);   
            var new_datum = []; 
            new_datum.push(datum[0]); 
            console.log(new_datum); 
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
		console.log("update password", this.state);
		var u_keys = ["old_pw", "new_pw", "new_pw_check", "boxer_id"];
		var data = {};
		for (var i in u_keys) {
			if (this.state[u_keys[i]] !== "") {
				data[u_keys[i]] = this.state[u_keys[i]];
			}
		}
		console.log("body: ", data);

		var URL="https://okp1u501a5.execute-api.us-east-2.amazonaws.com/test/signin";

		var put_dict = {body : JSON.stringify(data), 
			method: 'PUT',
			headers : {"Content-Type": "text/plain"} };
		
		console.log("put_dict", put_dict);
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

	update_state(evt) {
		console.log(sessionStorage);
		var temp = {};
		temp[evt.target.name] = evt.target.value;
                temp['boxer_id_u'] = sessionStorage.identity;
		this.setState(temp);
		console.log("state from test: ", evt.target.name);
	}

	render() {
        let headings = ["mixed_first","mixed_last","mixed_goes_by","year","hall","eligible","experience","vet_years","weight","handedness","captain","gender"];
        let heading_disp = ["First Name", "Last Name", "Nickname", "Year", "Hall", "Eligible", "Experience", "Veteran Years", "Weight", "Handedness", "Captain", "Gender"];
        var rows = [];
        var name = [];
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
			    values.push(<td key={headings[i]}>{heading_disp[i]}</td>);
               		    values.push(<td key={i}>{this.state.boxers[row_num][headings[i]]}</td>);
			}
			rows.push(<tr key={row_num}>{values}</tr>);
            	}
        }
        return (
            <div className="App">
            <header className="App-header">
            <h1 className="App-title">MatchBox</h1>
            </header>
	    {name}
            <table>
                <tbody>
                    {rows}
                </tbody>
            </table>
            <br />
			<form>
				<h4 id="desc">Enter data to update your profile.</h4><br/>
				<label>
				First:<br /> 
				<input type="text" name="first_u" onChange={(evt) => this.update_state(evt)}/>
				</label>
				<br />
				<br />
				<br />
				<br />
				<label>
				Last:<br /> 
				<input type="text" name="last_u" onChange={(evt) => this.update_state(evt)}/>
				</label>
				<br />
				<br />
				<br />
				<br />
				<label>
				Nickname:<br /> 
				<input type="text" name="goes_by_u" onChange={(evt) => this.update_state(evt)}/>
				</label>
				<br />
				<br />
				<br />
				<br />
				<label>
				Year:<br /> 
				<input type="text" name="year_u" onChange={(evt) => this.update_state(evt)}/>
				</label>
				<br />
				<br />
				<br />
				<br />
				<label>
				Hall:<br /> 
				<input type="text" name="hall_u" onChange={(evt) => this.update_state(evt)}/>
				</label>
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<select name="experience_u" onChange={(evt) => this.update_state(evt)}>
					<option value="">Experience</option>
					<option value="novice">Novice</option>
					<option value="veteran">Veteran</option>
				</select>
				<br />
				<br />
				<br />
				<select name="vet_years_u" onChange={(evt) => this.update_state(evt)}>
					<option value="">Veteran Years</option>
					<option value="0">0</option>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>
				<br />
				<br />
				<br />
				<label>
				Weight:<br />
				<input type="text" name="weight_u" onChange={(evt) => this.update_state(evt)}/>
				</label>
				<br />
				<br />
				<br />
				<br />
				<br />
				<select name="handedness_u" onChange={(evt) => this.update_state(evt)}>
					<option value="">Handedness</option>
					<option value="L">L</option>
					<option value="R">R</option>
				</select>
				<br />
				<br />
				<br />

				<button type="button" onClick={() => this.update()}>Submit</button>
			</form>
                        <br />
			<form>
				<h4 id = "pw_desc">Change Password</h4><br/>
				<label>
				Old Password:
				<input type="password" name="old_pw" onChange={(evt) => this.update_state(evt)}/>
				</label>
				<br />
				<br />
				<br />
				<br />
				<label>
				New Password:
				<input type="password" name="new_pw" onChange={(evt) => this.update_state(evt)}/>
				</label>
				<br />
				<br />
				<br />
				<br />
				<label>
				Retype New Password:
				<input type="password" name="new_pw_check" onChange={(evt) => this.update_state(evt)}/>
				</label>
				<br />
				<br />
				<br />
				<br />

				<button type="button" onClick={() => this.updatePassword()}>Submit</button>
			</form>
 			<form>
                        	<h4 id="spar_desc">Show Spars</h4>
			</form>

            </div>
        );
    }

	
}

export default Profile;
