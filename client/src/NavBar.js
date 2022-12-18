import React, { Component } from 'react';
import { MDBNavbar, MDBBtn } from 'mdbreact';
import NavBarBttn from './NavBarBttn';

class NavBar extends Component {
	onCickLogout() {
		this.props.resetAccountInfo();
	}

	render() {
		const { content, switchContent, resetAccountInfo, guest } = this.props;
		const style = { backgroundColor: '#f5ebf5', textAlign: 'center' };
		if(!guest){
			return (
				<div>
					<MDBNavbar style={style} dark expand='md' scrolling fixed='top'>
						<NavBarBttn name='Checkouts' selected={content === 'Checkouts'} switchContent={switchContent} />
						<NavBarBttn name='Holds' selected={content === 'Holds'} switchContent={switchContent} />
						<NavBarBttn name='Browse' selected={content === 'Browse'} switchContent={switchContent} />
						<NavBarBttn name='Profile' selected={content === 'Profile'} switchContent={switchContent} />
						<MDBBtn onClick={resetAccountInfo.bind(this)} color='unique'>
							Logout
						</MDBBtn>
					</MDBNavbar>
				</div>
			);
		} else {
			return (
				<div>
					<MDBNavbar style={style} dark expand='md' scrolling fixed='top'>
						<NavBarBttn name='Login' selected={content === 'Login'} switchContent={switchContent} />
						<NavBarBttn name='Browse' selected={content === 'Browse'} switchContent={switchContent} />
						<NavBarBttn name='Signup' selected={content === 'Signup'} switchContent={switchContent} />
					</MDBNavbar>
				</div>
			)
		}
	}
}

export default NavBar;
