import React from 'react';
import { MDBBtn } from 'mdbreact';

const CheckoutEntry = ({ checkout, onClickCheckin }) => {
	return (
		<tr className='entry'>
			<td>{checkout.title}</td>
			<td>{checkout.author}</td>
			<td style={{ textAlign: 'center' }}>{checkout.isbn}</td>

			<td style={{ textAlign: 'center' }}>{`${checkout.check_out_date.substr(0,10)} ${checkout.check_out_date.substr(11,8)}`}</td>

            <td style={{ textAlign: 'center' }}>{
                checkout.check_in_date == null ? 
                <strong>{''}</strong> : 
                `${checkout.check_in_date.substr(0,10)} ${checkout.check_in_date.substr(11,8)}`}
            </td>
			
            <td style={{ textAlign: 'center' }}>

                {checkout.check_in_date !== null ?
                    <div></div>
                :
                    checkout.format === 'P' ?
                        <strong>{'Return at Library'}</strong>
                    :
                    <MDBBtn 
                        onClick={ (e) => onClickCheckin(checkout.bid,e)} 
                        size='sm' color='danger' 
                        margin='0'>Check In</MDBBtn> 
                }
            
            </td>

		</tr>
	);
};

export default CheckoutEntry;
