import React, { Component } from 'react';
import NavBar from './NavBar';
import Browse from './Browse';
import Login from './Login';
import SignUpForm from './SignUpForm';

class GuestPage extends Component {
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
		const { accountInfo, setAccountInfo } = this.props;
		return (
			<div>
                <NavBar 
                    guest={true}
					content={content} 
					switchContent={this.switchContent}  />

                <br/>

				{content === 'Browse' ? 
					<Browse 
						fname={accountInfo.fname} 
                        user={accountInfo.username}
                        guest={true} 
						switchContent={this.switchContent}/> : 
					<div></div>
                }

                {content === 'Login' ?
                    <Login 
                        setAccountInfo={setAccountInfo}
                        switchContent={this.switchContent}/> :
                    <div></div>
                }

				{content === 'Signup' ?
					<SignUpForm 
						switchContent={this.switchContent}/> :
					<div></div>
				}

			</div>
		);
	}
}

export default GuestPage;
