import React, { Component } from 'react';
import { MDBBtn } from 'mdbreact';
import axios from 'axios';

class HoldBttn extends Component {

    onClick(){
        const {user , isbn, switchContent} = this.props;
        axios.get(`/api/placeHold/${user}/${isbn}`)
        .then( res => {
			console.log(user,isbn);
			switchContent('Holds');
		})
        .catch(console.error);
    }

	render() {
		return (
			<MDBBtn onClick={this.onClick.bind(this)}  outline color='indigo' rounded size='sm' className='mr-auto'>
				Hold
			</MDBBtn>
		);
	}
}

export default HoldBttn;
