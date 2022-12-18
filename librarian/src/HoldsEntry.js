import React from 'react';
import { MDBBtn } from 'mdbreact';

const HoldsEntry = ({ hold, onClick }) => {
	return (
		<tr>
			<td>{hold.username}</td>
			<td>{hold.title}</td>
			<td>{hold.isbn}</td>

			<td>{hold.request_on.substr(0,10)} {' '} {hold.request_on.substr(11,8)}</td>
			{hold.available_on ?
				<td>{hold.available_on.substr(0,10)} {' '} {hold.available_on.substr(11,8)}</td>
			:
				<td></td>
			}
			<td>{hold.bid}</td>
			{hold.format === 'P' ?
				<td><MDBBtn onClick={ e => onClick(hold.bid,hold.username,e)} size='sm' outline color='success'>Checkout</MDBBtn></td>
			:
				<td></td>
			}
		</tr>
	);
};

export default HoldsEntry;
