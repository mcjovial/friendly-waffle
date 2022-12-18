import React, { Component } from 'react';
import { MDBFormInline, MDBBtn } from 'mdbreact';
import axios from 'axios';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			failed: false,
			loading: false,
		};
		this.onClickLogin = this.onClickLogin.bind(this);
	}

	onClickLogin() {
		this.setState({
			failed: false,
			loading: true,
		})
		const user = document.getElementById('login-user').value;
		const pass = document.getElementById('login-pass').value;
		if (user.trim() === '' || pass.trim() === '') {
			this.setState({
				failed: true,
				loading: false,
			});
		} else {
			axios
				.get(`/api/librarianLogin/${user}/${pass}`)
				.then((res) => {
					if (res.data) {
						axios
							.get(`/api/getLibrarianName/${user}`)
							.then((res) => {
                                console.log(res.data);
                                this.props.setAccountInfo(user,res.data[0].fname);
							})
							.catch(console.error);
					} else {
						this.setState({
							failed: true,
							loading: false,
						});
					}
				})
				.catch(console.error);
		}
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
				<MDBFormInline className='md-form mr-auto mb-4' 
					onSubmit={ e => {e.preventDefault(); this.onClickLogin()} } >
					<input
						autoComplete='off'
						id='login-user'
						className='form-control mr-sm-2'
						type='password'
						placeholder='LID'
                        aria-label='Search'
                        maxLength='4'
						style={{ width: '40%', fontSize:'25px' }}
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
						style={{ width: '40%', fontSize:'25px' }}
					/>

				</MDBFormInline>

				<br/>

				{ this.state.loading ?
					<div style ={{margin:'0 auto'}} className='loader'></div>
				:
					<MDBFormInline>
						<MDBBtn size='lg' color='danger' onClick={this.onClickLogin}>
							sign in
						</MDBBtn>
					</MDBFormInline>
				}

				<br />
				<br />
				{this.state.failed ? <h3 style={{ color: 'red' }}>Invalid LID and/or password</h3> : <div></div>}
			</div>
		);
	}
}

export default Login;
