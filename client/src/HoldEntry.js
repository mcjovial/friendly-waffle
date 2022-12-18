import React from 'react';
import CheckoutBttn from './CheckoutBttn';

const HoldEntry = ({hold, switchContent, user}) => {
    console.log(hold.b_available_on);
	return (
		<tr className='entry'>
			<td style={{ textAlign: 'left' }}>{hold.b_title}</td>
			<td style={{ textAlign: 'left' }}>{hold.b_author}</td>
			<td style={{ textAlign: 'center' }}>{hold.b_isbn}</td>
			<td style={{ textAlign: 'center' }}>{hold.b_format}</td>
			<td style={{ textAlign: 'center' }}>{`${hold.b_request_on.substr(0,10)} ${hold.b_request_on.substr(11,8)}`}</td>

            <td style={{textAlign:'center'}}>
			{hold.b_available_on == null ? <p>Pending ...</p> : 
                hold.b_format === 'Physical' ? <p>Pick up at Library</p> : 
					<CheckoutBttn 
						switchContent={switchContent} 
						user={user} 
						bid={hold.b_bid}/>
            }
            </td>
			
		</tr>
	);
};

export default HoldEntry;