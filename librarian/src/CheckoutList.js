import React from 'react';
import CheckoutEntry from './CheckoutEntry';

const CheckoutList = ({checkoutList}) => {
    return(
        <div style={{ margin: '20px auto', width: '950px', height: '280px' , overflowY: 'auto' }}>
			<table className='tables' style={{width: '100%'}}>
				<tbody>
					<tr>
						<th style={{ textAlign: 'left'}}>
							<strong>USER</strong>
						</th>
                        <th>
							<strong>TITLE</strong>
						</th>
                        <th>
							<strong>ISBN</strong>
						</th>
						<th>
							<strong>CHECK OUT DATE</strong>
						</th>
						<th>
							<strong>BID</strong>
						</th>
					</tr>
					{checkoutList.length === 0 ? 
						<tr><td colSpan='5'><strong>No Active Checkouts</strong></td></tr>
					:
						checkoutList.map((checkout,i) => <CheckoutEntry checkout={checkout} key={i}/> )
					}
				</tbody>
			</table>
		</div>
    )
}

export default CheckoutList;