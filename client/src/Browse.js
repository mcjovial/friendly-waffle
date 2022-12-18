import React, { Component } from 'react';
import { MDBBtn, MDBCol, MDBFormInline } from 'mdbreact';
import axios from 'axios';
import BookList from './BookList';
import CheckoutBttn from './CheckoutBttn';
import HoldBttn from './HoldBttn';

class Browse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			booklist: [],
			selection: false,
			selectedIndex: -1,
			loading: false,
			viewAll: false,
		};
		this.onChange = this.onChange.bind(this);
		this.onClickBrowse = this.onClickBrowse.bind(this);
		this.setIndex = this.setIndex.bind(this);
		this.onClickCancel = this.onClickCancel.bind(this);
	}

	onChange() {
		this.setState({loading:true, viewAll: false})
		const searchFor = document.getElementById('search-for').value;
		const searchBy = document.getElementById('search-by').value;
		if (searchFor && searchFor.trim() !== '') {
			axios
				.get(`/api/searchBook/${searchFor}/${searchBy}`)
				.then((res) => {
					this.setState({
						booklist: res.data,
					});
				})
				.catch(console.error);
		} else {
			this.setState({
				booklist: [],
			});
		}
		console.log(this.state.booklist);
		this.setState({
			selection: false,
			selectedIndex: -1,
			loading: false,
			viewAll: false,
		});
	}

	onClickBrowse() {
		this.setState({loading:true, viewAll:true})
		document.getElementById('search-for').value = '';
		axios
			.get(`/api/browseBooks`)
			.then((res) => {
				this.setState({
					booklist: res.data,
					loading:false
				});
			})
			.catch(console.error);
	}

	setIndex(index) {
		this.setState({
			selection: true,
			selectedIndex: index,
		});
	}

	onClickCancel() {
		this.setState({
			selection: false,
			selectedIndex: -1,
		});
	}

	render() {
		const { booklist, selectedIndex, selection, loading, viewAll } = this.state;
		const { guest } =  this.props;
		console.log('BookList', booklist);
		return (
			<div>
				<div style={{ textAlign: 'center' }}>
					{ guest ?<h1 className='libName'>The Biblio Mecca</h1>: <h1>Welcome Back, {this.props.fname}</h1>}
					<MDBCol md='12'>
						<MDBFormInline className='md-form mr-auto mb-4'
							onSubmit={ e => {e.preventDefault(); this.onChange()} }>
							<input
								autoComplete='off'
								id='search-for'
								className='form-control mr-sm-2'
								type='text'
								placeholder='Search'
								aria-label='Search'
								style={{ width: '60%', fontSize:'20px' }}
								onChange={this.onChange}
							/>
							<select className='select-css' id='search-by' onChange={this.onChange}>
								<option value='title'>TITLE</option>
								<option value='author'>AUTHOR</option>
								<option value='category'>CATEGORY</option>
								<option value='isbn'>ISBN</option>
								<option value='format'>FORMAT</option>
							</select>

						</MDBFormInline>
						<MDBFormInline className='md-form mr-auto mb-4'>
							{selection && !guest ? (
								<div>
									{booklist[selectedIndex].format !== 'Physical' && booklist[selectedIndex].availablecount !== '0' ? (
										<CheckoutBttn 
											user={this.props.user} 
											isbn={booklist[selectedIndex].isbn} 
											switchContent={this.props.switchContent} />
									) : (
										<HoldBttn 
											user={this.props.user} 
											isbn={booklist[selectedIndex].isbn} 
											switchContent={this.props.switchContent} />
									)}
									<MDBBtn 
										onClick={this.onClickCancel} 
										outline color='danger' 
										rounded size='sm' 
										className='mr-auto'>
										Cancel
									</MDBBtn>
								</div>
							) : (
								<MDBBtn onClick={this.onClickBrowse} outline color='default' rounded size='sm' className='mr-auto'>
									Browse All
								</MDBBtn>
							)}
						</MDBFormInline>
					</MDBCol>
				</div>


				{loading ?
					<div style ={{margin:'0 auto'}} className='loader'></div>
				:
					booklist.length === 0 || (document.getElementById('search-for').value.trim() === '' && !viewAll)? 
						<div></div> 
					:
						<BookList 
							booklist={booklist} 
							selectedIndex={selectedIndex} 
							setIndex={this.setIndex} />
				}
				
				{ selection && guest ? <h3 style={{textAlign:'center', color:'red'}}>Login to checkout or place hold !</h3>: <div></div>}
			</div>
		);
	}
}

export default Browse;