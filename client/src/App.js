import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserPage from './UserPage';
import GuestPage from './GuestPage';

class App extends Component {
	state = {
		isAuthen: false,
		accountInfo: {
			username: null,
			fname: null,
			lname: null,
			dob: null,
			address: null,
			phone: null,
			email: null,
			fees: null,
		},
	};

	setAccountInfo(data) {
		this.setState({
			isAuthen: true,
			accountInfo: data,
		});
	}

	resetAccountInfo() {
		this.setState({
			isAuthen: false,
			accountInfo: {
				username: null,
				fname: null,
				lname: null,
				dob: null,
				address: null,
				phone: null,
				email: null,
				fees: null,
			},
		});
	}

	render() {
		console.log(this.state.accountInfo);
		const { accountInfo, isAuthen } = this.state;
		return ( 
			<div>
				{isAuthen === false ?
				<GuestPage 
					accountInfo={accountInfo} 
					setAccountInfo={this.setAccountInfo.bind(this)} /> :
				<UserPage 
					accountInfo={accountInfo} 
					setAccountInfo={this.setAccountInfo.bind(this)} 
					resetAccountInfo={this.resetAccountInfo.bind(this)}/>}
			</div>
		);
	}
}


export default App;
