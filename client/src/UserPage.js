import React, { Component } from 'react';
import NavBar from './NavBar';
import Browse from './Browse';
import Checkouts from './Checkouts';
import Profile from './Profile';
import Holds from './Holds';

class UserPage extends Component {
	constructor(props) {
		super(props);
		this.state = { content: 'Browse' };
		this.switchContent = this.switchContent.bind(this);
	}

	switchContent(content) {
		this.setState({
			content: content,
		});
	}

	render() {
		const { content } = this.state;
		const { accountInfo, resetAccountInfo, setAccountInfo } = this.props;
		return (
			<div>
				<NavBar 
					content={content} 
					switchContent={this.switchContent}  
					resetAccountInfo={resetAccountInfo}/>

				{content === 'Browse' ? 
					<Browse 
						fname={accountInfo.fname} 
						user={accountInfo.username} 
						switchContent={this.switchContent}/> : 
					<div></div>}

				{content === 'Checkouts' ? 
					<Checkouts 
						user={accountInfo.username}/> : 
					<div></div>}
					
				{content === 'Holds' ? 
					<Holds 
						switchContent={this.switchContent} 
						user={accountInfo.username}/> : 
					<div></div>}
				
				
				{content === 'Profile' ? 
					<Profile 
						setAccountInfo={setAccountInfo}
						accountInfo={accountInfo}/> : 
					<div></div>}

			</div>
		);
	}
}

export default UserPage;
