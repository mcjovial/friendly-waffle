import React from 'react';
import PatronEntry from './PatronEntry';

const PatronList = ({ patronList, setIndex, selectedIndex, resetSelection }) => {

	return (
		<div style={{ margin: '20px auto', width: '950px', height: '280px' , overflowY: 'auto' }}>
			<table className='tables' style={{width: '100%'}}>
				<tbody>
					<tr style={{ textAlign: 'left'}}>
						<th >
							<strong>USER</strong>
						</th>
						<th >
							<strong>NAME</strong>
						</th>
						<th>
							<strong>ADDRESS</strong>
						</th>
						<th>
							<strong>PHONE NUMBER</strong>
						</th>
						<th>
							<strong>EMAIL</strong>
						</th>
						<th style={{ textAlign: 'center'}}>
							<strong>LATE FEES</strong>
						</th>
					</tr>
					{patronList.map( (patron,i) =>  
						<PatronEntry 
							key={i}
							index={i}
							selected= {i === selectedIndex}
							onClick={i === selectedIndex ? resetSelection : setIndex}
							patron={patron}/>)}
				</tbody>
			</table>
		</div>
	);
};

export default PatronList;
