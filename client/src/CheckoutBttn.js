import React, { Component } from 'react';
import { MDBBtn } from 'mdbreact';
import axios from 'axios';

class CheckoutBttn extends Component {

    onClick(){
		const {user , isbn, bid, switchContent} = this.props;

		if (bid){
			console.log(user,bid);
			axios.get(`/api/checkoutAHold/${bid}/${user}`)
			.then( res => {
				switchContent('Checkouts')
			})
			.catch(console.error);
		}
		else{
			console.log(user,isbn);
			axios.get(`/api/onlineCheckout/${isbn}/${user}`)
			.then( res => switchContent('Checkouts'))
			.catch(console.error);
		}
    }

	render() {
		return (
			<MDBBtn onClick={this.onClick.bind(this)} outline color='success' rounded size='sm' className='mr-auto'>
				Checkout
			</MDBBtn>
		);
	}
}

export default CheckoutBttn;
