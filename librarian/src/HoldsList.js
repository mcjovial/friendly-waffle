import React from 'react';
import HoldsEntry from './HoldsEntry';

const HoldsList = ({holdsList, onClick}) => {
    return(
        <div style={{ margin: '20px auto', width: '950px', height: '280px' , overflowY: 'auto' }}>
			<table className='tables' style={{width: '100%'}}>
				<tbody>
					<tr>
						<th style={{ textAlign: 'left'}}>
							<strong>USER</strong>
						</th>
                        <th style={{ textAlign: 'left'}}>
							<strong>TITLE</strong>
						</th>
                        <th>
							<strong>ISBN</strong>
						</th>
						<th>
							<strong>REQUEST DATE</strong>
						</th>
						<th>
							<strong>AVAILABLE DATE</strong>
						</th>
						<th>
							<strong>BID</strong>
						</th>
						<th>
							<strong>CHECKOUT</strong>
						</th>
					</tr>
					{holdsList.length === 0 ?
						<tr><td colSpan='7'><strong>No Holds Requested</strong></td></tr>
					:
						holdsList.map((hold,i) => <HoldsEntry key={i} hold={hold} onClick={onClick}/>)
					}
                        
				</tbody>
			</table>
		</div>
    )
}

export default HoldsList;