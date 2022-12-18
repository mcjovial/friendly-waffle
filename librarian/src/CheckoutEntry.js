import React from 'react';

const CheckoutEntry = ({checkout}) => {
	return (
		<tr>
			<td>{checkout.username}</td>
            <td>{checkout.title}</td>
            <td>{checkout.isbn}</td>
			{ checkout.check_out_date ?
				<td>{checkout.check_out_date.substr(0,10)} {' '} {checkout.check_out_date.substr(11,8)}</td>
			:
				<td></td>
			}
			<td>{checkout.bid}</td>
		</tr>
	);
};  

export default CheckoutEntry;
