import React, { Component } from 'react';
import { MDBBtn, MDBCol, MDBFormInline } from 'mdbreact';
import axios from 'axios';
import BookList from './BookList';
import PatronList from './PatronList';
import CheckoutList from './CheckoutList';
import HoldsList from './HoldsList';
import Inventory from './Inventory';

class Browse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bookview: true,
			list: [],
			selection: false,
			selectedIndex: -1,
			tempList: [],
			showHolds: false,
			showCheckouts: false,
			showInventory: false,
			loading: false,
			viewAll: false,
		};
		this.onToggle = this.onToggle.bind(this);
		this.onType = this.onType.bind(this);
		this.setIndex = this.setIndex.bind(this);
		this.resetSelection = this.resetSelection.bind(this);
		this.onClickBrowseAll = this.onClickBrowseAll.bind(this);
		this.onClickHolds = this.onClickHolds.bind(this);
		this.onClickCheckouts = this.onClickCheckouts.bind(this);
		this.onClickInventory = this.onClickInventory.bind(this);
		this.onClickViewAll = this.onClickViewAll.bind(this);
		this.addBook = this.addBook.bind(this);
		this.removeBook = this.removeBook.bind(this);
		this.onClickCheckoutHold = this.onClickCheckoutHold.bind(this);
	}

	resetSelection(){
		this.setState({
			selection: false,
			selectedIndex: -1,
			showHolds: false,
			showCheckouts: false,
			showInventory: false,
			tempList: [],
			loading: false,
		})
	}

	onToggle(){
		this.setState({
			bookview: !this.state.bookview,
			list: [],
			selection: false,
			selectedIndex: -1,
			showCheckouts: false,
			showHolds: false,
			showInventory: false,
			viewAll: false,
		})
		document.getElementById('search-for').value = '';
		if (this.state.bookview) {document.getElementById('search-by').value = 'title';}
		else {document.getElementById('search-by').value = 'username';}
	}

	onType(){
		this.setState({loading:true, viewAll:false});
		if(this.state.bookview){
			const searchFor = document.getElementById('search-for').value;
			const searchBy = document.getElementById('search-by').value;
			if (searchFor && searchFor.trim() !== '') {
				axios
					.get(`/api/searchBook/${searchFor}/${searchBy}`)
					.then((res) => {
						// console.log(res);
						this.setState({
							list: res.data,
							loading: false,
						});
					})
					.catch(console.error);
			} else {
				this.setState({
					list: [],
					loading: false,
				});
			}
			// console.log(this.state.list);
		} 
		else {
			const searchFor = document.getElementById('search-for').value;
			const searchBy = document.getElementById('search-by').value;
			if (searchFor && searchFor.trim() !== '') {
				axios
					.get(`/api/viewPatronInfoBy/${searchFor}/${searchBy}/null/null`)
					.then( res => {
						this.setState({
							list: res.data,
							loading: false,
						});
					})
					.catch(console.error);
			} else {
				this.setState({
					list: [],
					loading: false,
				});
				// console.log(this.state.list);
			}
		}
		this.resetSelection();
		console.log(this.state.list);
	}

	setIndex(index){
		this.setState({
			selection: true,
			selectedIndex: index,
		})
	}

	onClickBrowseAll(){
		this.setState({loading:true, viewAll:true});
		document.getElementById('search-for').value = '';
		axios
		.get('/api/browseBooks')
		.then( res => this.setState({list:res.data, loading:false}))
		.catch(console.error);
	}
	
	addBook(isbn){
		const { list, selectedIndex } = this.state;
		let temp = list;
		let oldCount = list[selectedIndex].availablecount;
		temp[selectedIndex].availablecount = 'Adding ...';
		this.setState({
			list: temp
		})
		axios
		.get(`/api/addBookToBooks/${isbn}`)
		.then( () => {
				temp[selectedIndex].availablecount = parseInt(oldCount) + 1;
				this.setState({
					list: temp
				})
			}
		)
		.catch(console.error);
	}

	removeBook(bid){
		this.setState({loading:true});
		const { list, selectedIndex } = this.state;
		axios
		.get(`/api/removeSpecificBook/${bid}`)
		.then( (res) => {
				
				if (res.data.name !== 'error'){
					let temp = list;
					temp[selectedIndex].availablecount = parseInt(list[selectedIndex].availablecount) - 1;
					this.setState({
						list: temp,
					})
					this.onClickInventory();
				}
				this.setState({loading: false})
			}
		)
		.catch(console.error);
	}

	onClickHolds(){
		this.setState({
			showHolds: true,
			showCheckouts: false,
			showInventory: false,
			loading: true,
		})
		const {bookview, list, selectedIndex } = this.state;
		if (bookview) {
			axios
			.get(`/api/viewHoldsByBook/${list[selectedIndex].isbn}`)
			.then(res => {
				console.log(res.data);
				this.setState({tempList:res.data, loading:false});
			})
			.catch(console.error);
		}
		else {
			axios
			.get(`/api/viewHoldsByUser/${list[selectedIndex].username}`)
			.then(res => {
				console.log(res.data);
				this.setState({tempList:res.data, loading:false});
			})
			.catch(console.error);
		}
	}

	onClickCheckouts(){
		this.setState({
			showHolds: false,
			showInventory: false,
			showCheckouts: true,
			loading: true,
		})
		const {bookview, list, selectedIndex } = this.state;
		if (bookview) {
			axios
			.get(`/api/viewCheckoutsByBook/${list[selectedIndex].isbn}`)
			.then(res => {
				console.log(res.data);
				this.setState({tempList:res.data, loading:false});
			})
			.catch(console.error);
		}
		else {
			axios
			.get(`/api/viewCheckoutsByUser/${list[selectedIndex].username}`)
			.then(res => {
				console.log(res.data);
				this.setState({tempList:res.data, loading:false});
			})
			.catch(console.error);
		}
	}

	onClickCheckoutHold(bid,user){
		this.setState({
			showHolds: true,
			showInventory: false,
			showCheckouts: false,
			// loading: true,
		})
		console.log(bid,user);
		axios
		.get(`/api/lib_checkout_hold/${bid}/${user}`)
		.then( res => {
			console.log(res.data);
			this.onClickHolds();
		})
		.catch(console.error);
	}

	onClickInventory(){
		this.setState({
			showHolds: false,
			showCheckouts: false,
			showInventory: true,
			loading: true,
		});
		const {list, selectedIndex } = this.state;
		axios
			.get(`/api/query/*/books_status_view/isbn='${list[selectedIndex].isbn}'`)
			.then(res => {
				console.log(res.data);
				this.setState({tempList:res.data, loading: false});
			})
			.catch(console.error);
	}

	onClickViewAll(){
		this.setState({loading:true, viewAll:true});
		document.getElementById('search-for').value = '';
		axios
		.get('/api/viewAllPatrons/')
		.then(res => this.setState({list:res.data, loading: false}))
		.catch(console.error);
	}


	render() {
		const { 
			list, selectedIndex, bookview, selection, showCheckouts, showHolds, showInventory , tempList, loading, viewAll 
		} = this.state;

		const { fname } =  this.props;
		return (
			<div>
				<div style={{ textAlign: 'center' }}>
					<h1>Welcome Back, {fname}</h1>
					<MDBCol md='12'>

						{bookview? 
							<div>
								<MDBBtn color='amber'>Books</MDBBtn>
								<MDBBtn outline color='amber' onClick={this.onToggle}>Patrons</MDBBtn>
							</div> 
						:
							<div>
								<MDBBtn outline color='cyan' onClick={this.onToggle}>Books</MDBBtn>
								<MDBBtn color='cyan'>Patrons</MDBBtn>
							</div>
						}

						<MDBFormInline className='md-form mr-auto mb-4'onSubmit={ e => {e.preventDefault()} }>
							<input
								autoComplete='off'
								id='search-for'
								className='form-control mr-sm-2'
								type='text'
								placeholder='Search'
								aria-label='Search'
								style={{ width: '60%', fontSize:'20px' }}
								onChange={this.onType}
							/>
							{ bookview ?
								<select className='select-css' id='search-by' onChange={this.onType}>
									<option value='title'>TITLE</option>
									<option value='author'>AUTHOR</option>
									<option value='isbn'>ISBN</option>
									<option value='format'>FORMAT</option>
								</select> 
							:
								<select className='select-css' id='search-by' onChange={this.onType}>
									<option value='username'>USER</option>
									<option value='name'>NAME</option>
									<option value='phone_number'>PHONE</option>
									<option value='email'>EMAIL</option>
									<option value='address'>ADDRESS</option>
								</select>
							}
						</MDBFormInline>

						{selection ? 
							bookview ? 
								<div>
									{showInventory ?
										
										<MDBBtn  color='mdb-color' size='sm'>Inventory</MDBBtn>
									: // holds not selected
										<MDBBtn 
											outline color='mdb-color' 
											size='sm'
											onClick={this.onClickInventory}>
										Inventory</MDBBtn>
									}

									{showHolds ?
										
										<MDBBtn  color='mdb-color' size='sm'>Holds</MDBBtn>
									: // holds not selected
										<MDBBtn 
											outline color='mdb-color' 
											size='sm'
											onClick={this.onClickHolds}>
										Holds</MDBBtn>
									}

									{showCheckouts ?
										<MDBBtn color='mdb-color' size='sm'>Checkouts</MDBBtn>
									: // checkouts not selected
										<MDBBtn 
											outline color='mdb-color' 
											size='sm'
											onClick={this.onClickCheckouts}>
										Checkouts</MDBBtn>
									}

									<MDBBtn outline color='danger' size='sm' onClick={this.resetSelection}>
										Cancel</MDBBtn>
								</div>
								 
							: // selection made in patron view
							<div>
								{showHolds ?
									<MDBBtn  color='blue-grey' size='sm'>Holds</MDBBtn>
								: // holds not selected
									<MDBBtn 
										outline color='blue-grey' 
										size='sm'
										onClick={this.onClickHolds}>
									Holds</MDBBtn>
								}

								{showCheckouts ?
									<MDBBtn color='blue-grey' size='sm'>Checkouts</MDBBtn>
								: // checkouts not selected
									<MDBBtn 
										outline color='blue-grey' 
										size='sm'
										onClick={this.onClickCheckouts}>
									Checkouts</MDBBtn>
								}

								<MDBBtn outline color='danger' size='sm' onClick={this.resetSelection}>
									Cancel</MDBBtn>
							</div>
								
						: // no selection made
							(bookview ? 
								<MDBBtn 
									outline color='amber' 
									size='sm' 
									onClick={this.onClickBrowseAll}>
									Browse All</MDBBtn> 
							: // no selection made in patron view
								<MDBBtn 
									outline color='cyan' 
									size='sm'
									onClick={this.onClickViewAll}>
									View All</MDBBtn> ) 
						}

					</MDBCol>

					{ loading ?

						<div style ={{margin:'50px auto'}} className='loader'></div>
							
					:

						list.length === 0 || (document.getElementById('search-for').value.trim() === '' && !viewAll)? 
						
							<div></div> 

						: 
								
							showHolds || showCheckouts || showInventory?

								showHolds ?

									<HoldsList holdsList={tempList} onClick={this.onClickCheckoutHold}/>
								:
									showCheckouts ?
										<CheckoutList checkoutList={tempList}/>
									:
										<Inventory inventoryList={tempList} onClick={this.removeBook}/>

							:	// Just display results (Holds/Checkouts/Inventory bttn not selected)
								
								bookview ? 
									<BookList
										resetSelection={this.resetSelection} 
										selection={selection}
										selectedIndex={selectedIndex}
										setIndex={this.setIndex} 
										booklist={list}
										addBook={this.addBook}/> 
										
									
								: 
									<PatronList
										resetSelection={this.resetSelection} 
										selection={selection} 
										selectedIndex={selectedIndex}
										setIndex={this.setIndex}
										patronList={list}/>
					}

				</div>
			</div>	
		);
	}
}

export default Browse;
