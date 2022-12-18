import React, { Component } from 'react';

class BookEntry extends Component {
	// constructor(props) {
	// 	super(props);
    // }
    
    onClick(){
        this.props.setIndex(this.props.i);
    }

	render() {
        const { book } = this.props;
        const style = this.props.highlight ? { cursor: 'pointer', backgroundColor: '#dcf8af'} : { cursor: 'pointer', };
		return (
			<tr className='entry' onClick={this.onClick.bind(this)} style={style}>
				<td >{book.title}</td>
				<td >{book.author}</td>
				<td >{book.category}</td>
				<td style={{ textAlign: 'center' }}>{book.isbn}</td>
				<td style={{ textAlign: 'center' }}>{book.format}</td>
			</tr>
		);
	}
}

export default BookEntry;