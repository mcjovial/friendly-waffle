import React from 'react';
import { MDBBtn } from 'mdbreact';

const Inventory = ({inventoryList, onClick}) => {
    return(
        <div style={{ margin: '20px auto', width: '950px', height: '280px' , overflowY: 'auto' }}>
            <table className='tables' style={{width: '100%'}}>
                <tbody>
                    <tr style={{ textAlign: 'left'}}>
                        <th >
                            <strong>BID</strong>
                        </th>
                        <th >
                            <strong>TITLE</strong>
                        </th>
                        <th>
                            <strong>AUTHOR</strong>
                        </th>
                        <th>
                            <strong>ISBN</strong>
                        </th>
                        <th>
                            <strong>FORMAT</strong>
                        </th>
                        <th>
                            <strong>STATUS</strong>
                        </th>
                        <th>
                            <strong>REMOVE</strong>
                        </th>
                    </tr>
                    
                    {inventoryList.map(i => (
                        <tr key={i.bid}>
                            <td>{i.bid}</td>
                            <td>{i.title}</td>
                            <td>{i.author}</td>
                            <td>{i.isbn}</td>
                            <td>{i.format}</td>
                            <td>{i.status}</td>
                            <td>
                                {   i.status === 'IN' ?
                                        <MDBBtn 
                                            size='sm' 
                                            outline color='danger' 
                                            onClick={e => onClick(i.bid,e)}>
                                            Remove</MDBBtn>
                                    : <div></div>
                                }
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )   
}

export default Inventory;