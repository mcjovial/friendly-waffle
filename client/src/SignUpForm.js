import React, { Component } from 'react';
import { MDBBtn } from 'mdbreact';
import axios from 'axios';
import './styles.css';

class SignUpForm extends Component {
	constructor(props){
		super(props);
		this.state ={
			failed: false,
			error: '',
		}
		this.onClick = this.onClick.bind(this);
	}
	
	onClick(){
		const user = document.getElementById('user').value;
		const pass = document.getElementById('pass').value;
		const fn = document.getElementById('fn').value;
		const ln = document.getElementById('ln').value;
		const dob = document.getElementById('dob').value;
		const addr = document.getElementById('addr').value;
		const phone = document.getElementById('phone').value;
		let email = document.getElementById('email').value;
		console.log(user, pass, fn, ln, dob, addr, phone, email);
		if(
			user.trim() === '' ||
			pass.trim() === '' ||
			fn.trim() === '' ||
			ln.trim() === '' ||
			dob.trim() === '' ||
			addr.trim() === '' ||
			phone.trim() === '' ||
			email.trim() === ''
		){
			this.setState({
				failed:true,
				error: 'All Fields Must Be Filled'
			})
		}
		else{
			axios.get(`/api/createNewPatron/${user}/${pass}/${fn}/${ln}/${dob}/${addr}/${phone}/${email}`)
				.then( err => {
					if(err.data.name === 'error'){
						console.log(err.data.detail);
						this.setState({
							failed:true,
							error: err.data.detail,
						})
					}
					else{
						this.props.switchContent('Login');
					}
				} ).catch(console.error);
		}
	}
	
	render() {
		return (
			<form className='fillout' action='#' autoComplete='false'>
				<div className='signup-container'>
					<h1>Sign Up</h1>
					<p>Please fill in this form to create an account.</p>

					<label>
						<b>Username</b>
					</label>
					<input type='text' placeholder='Enter Username' id='user' required />

					<label>
						<b>Password</b>
					</label>
					<input type='text' placeholder='Enter Password' id='pass' required />

					<label>
						<b>First Name</b>
					</label>
					<input type='text' placeholder='Enter Your First Name' id='fn' required />

					<label>
						<b>Last Name</b>
					</label>
					<input type='text' placeholder='Enter Your Last Name' id='ln' required />

					<label>
						<b>Date of Birth</b>
					</label>
					<input type='date' placeholder='mm/dd/yyyy' id='dob' required />

					<label>
						<b>Phone Number</b>
					</label>
					<input type='tel' placeholder='xxx-xxx-xxxx' id='phone' required pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' />

					<label>
						<b>Address</b>
					</label>
					<input type='text' placeholder='Enter Street, City, State, Zipcode' id='addr' required />

					<label>
						<b>Email</b>
					</label>
					<input type='email' placeholder='Enter Email' id='email' />
					<div style={{textAlign: 'center'}}>
						<MDBBtn  size='xl' color='default' onClick={this.onClick}>
							sign up
						</MDBBtn>
						{ this.state.failed ? 
							<div className="alert">
								{this.state.error}
							</div> 
						: 
							<div></div>}
					</div>
				</div>
				<br/><br/>
			</form>
		);
	}
}

export default SignUpForm;
