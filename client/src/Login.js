import React, { Component } from 'react';
import { MDBFormInline, MDBBtn } from 'mdbreact';
import axios from 'axios';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mssg: '',
			loading: false,
		};
		this.onClickLogin = this.onClickLogin.bind(this);
		this.onClickSignup = this.onClickSignup.bind(this);
	}

	onClickLogin() {
		this.setState({loading:true,mssg:''})
		const user = document.getElementById('login-user').value;
		const pass = document.getElementById('login-pass').value;
		if (user.trim() === '' || pass.trim() === '') {
			this.setState({
				mssg: 'Invalid Input',
				loading: false
			});
		} else {
			axios
				.get(`/api/authenticateLogin/${user}/${pass}`)
				.then((res) => {
					if (res.data) {
						axios
							.get(`/api/viewPatronInfo/${user}`)
							.then((res) => {
								console.log(res.data);
								const accountInfo = {
									username: user,
									fname: res.data[0].fname,
									lname: res.data[0].lname,
									dob: res.data[0].dob,
									cid: res.data[0].cid,
									address: res.data[0].address,
									phone: res.data[0].phone_number,
									email: res.data[0].email,
									fees: res.data[0].late_fee_amount,
								};
								this.props.setAccountInfo(accountInfo);
							})
							.catch(console.error);
					} else {
						this.setState({
							mssg: 'Inccorrect Username/Password',
							loading: false,
						});
					}
				})
				.catch(console.error);
		}
	}

	onClickSignup() {
		this.props.switchContent('Signup');
	}

	render() {
		const style_login = {
			fontFamily: 'courrier-new',
			width: '600px',
			margin: '20px auto ',
			textAlign: 'center',
		};

		return (
			<div style={style_login}>
				<div>
					<h1>Login</h1>
				</div>
				<br/>
				<MDBFormInline className='md-form mr-auto mb-4' 
					onSubmit={ e => {e.preventDefault(); this.onClickLogin()} } >
					<input
						autoComplete='off'
						id='login-user'
						className='form-control mr-sm-2'
						type='text'
						placeholder='Username'
						aria-label='Search'
						style={{ width: '85%', fontSize:'20px' }}
						// onSubmit={this.onSubmit}
					/>
				</MDBFormInline>

				<MDBFormInline  className='md-form mr-auto mb-4' 
					onSubmit={ e => {e.preventDefault(); this.onClickLogin()} }>
					
					<input
						autoComplete='off'
						id='login-pass'
						className='form-control mr-sm-2'
						type='password'
						placeholder='Password'
						aria-label='Search'
						style={{ width: '85%', fontSize:'20px' }}
						// onSubmit={this.onSubmit}
					/>

				</MDBFormInline>

				<br/>
				{this.state.loading?
					<div style ={{margin:'0 auto'}} className='loader'></div>
				:
					<MDBFormInline>
						<MDBBtn size='lg' color='indigo' onClick={this.onClickLogin}>
							sign in
						</MDBBtn>
						<MDBBtn size='lg' color='default' onClick={this.onClickSignup}>
							sign up
						</MDBBtn>
					</MDBFormInline>
				}

				<br />
				<br />
				<div className="alert">
						{this.state.mssg}
				</div>
			</div>
		);
	}
}

export default Login;
