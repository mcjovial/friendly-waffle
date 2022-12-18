import React from 'react';
import BookEntry from './BookEntry';

const BookList = ({ booklist, setIndex, selectedIndex }) => {
	return (
		<div style={{ margin: '20px auto', width: '950px', height: '280px' , overflowY: 'auto' }}>
			<table className='tables' style={{width: '100%'}}>
				<tbody>
					<tr>
						<th style={{ textAlign: 'left'}}>
							<strong>TITLE</strong>
						</th>
						<th style={{ textAlign: 'left'}}>
							<strong>AUTHOR</strong>
						</th>
						<th>
							<strong>CATEGORY</strong>
						</th>
						<th>
							<strong>ISBN</strong>
						</th>
						<th>
							<strong>FORMAT</strong>
						</th>
					</tr>
					{booklist.map( (book,i) => 
						<BookEntry book={book} i={i} setIndex={setIndex} key={book.isbn} 
						highlight={selectedIndex === i ? true : false}/>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default BookList;
