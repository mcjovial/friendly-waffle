import React from 'react';
import BookEntry from './BookEntry';

const BookList = ({ booklist, setIndex, selectedIndex, resetSelection, addBook }) => {

	return (
		<div style={{ margin: '20px auto', width: '950px', height: '280px' , overflowY: 'auto' }}>
			<table className='booklist' style={{width: '100%'}}>
				<tbody>
					<tr>
						<th style={{ textAlign: 'left'}}>
							<strong>TITLE</strong>
						</th>
						<th style={{ textAlign: 'left'}}>
							<strong>AUTHOR</strong>
						</th>
						<th>
							<strong>FORMAT</strong>
						</th>
						<th>
							<strong>ISBN</strong>
						</th>
						<th>
							<strong>AVAILABLE COUNT</strong>
						</th>
					</tr>
					{booklist.map( (book,i) => 
						<BookEntry 
							key={i}
							index={i} 
							book={book}
							onClick={i===selectedIndex ? resetSelection : setIndex}
							selected={ i===selectedIndex }
							addBook={addBook}/>)}
				</tbody>
			</table>
		</div>
	);
};

export default BookList;
