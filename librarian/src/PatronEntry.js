import React from 'react';

const PatronEntry = ({patron, onClick, selected, index}) => {
    const style = selected ? { cursor: 'pointer', backgroundColor: '#dcf8af'} : { cursor: 'pointer', };
    return(
        <tr style={style} className='entry' onClick={e => onClick(index,e)}>
            <td>{patron.username}</td>
            <td>{patron.name.substr(0, 10)}</td>
            <td>{patron.address.substr(0, 15)}</td>
            <td style={{ textAlign: 'center' }}>{patron.phone_number}</td>
            <td>{patron.email}</td>
            <td style={{ textAlign: 'center' }}>{patron.late_fee_amount}</td>
        </tr>
    )
};

export default PatronEntry;
