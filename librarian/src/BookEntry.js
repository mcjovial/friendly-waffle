import React, {Component} from 'react';
import { MDBBtn } from 'mdbreact';


class BookEntry extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            showAddBttn: false,
        }
    }

    render(){
        const {book, onClick, selected, index, addBook} = this.props;
        const style = selected ? { cursor: 'pointer', backgroundColor: '#dcf8af'} : { cursor: 'pointer', };
        return(
            <tr style={style} className='entry' onClick={e => {onClick(index,e)}}>
                <td style={{ textAlign: 'left'}}>{book.title}</td>
                <td style={{ textAlign: 'left'}}>{book.author}</td>
                <td style={{ textAlign: 'left'}}>{book.format}</td>
                <td >{book.isbn}</td>

                {selected ? 
                    this.state.showAddBttn ?
                        <td>
                            <MDBBtn 
                                onClick = {e => addBook(book.isbn,e)}
                                onMouseLeave={(e)=>this.setState({showAddBttn:false})}
                                size='sm' outline color='success'>
                                add
                            </MDBBtn>
                        </td>
                    :
                        <td onMouseEnter={(e)=>this.setState({showAddBttn:true})} >
                            {book.availablecount}
                        </td> 
                : 
                    <td>{book.availablecount}</td> 
                }


            </tr>
        )
    } 
    
}

export default BookEntry;