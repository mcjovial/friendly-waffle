import React, { Component } from 'react';
import axios from 'axios';
import CheckoutEntry from './CheckoutEntry';

class Checkouts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [],
			loading: true,
		};
		this.onClickCheckin = this.onClickCheckin.bind(this);
	}

	componentDidMount() {
		axios
			.get(`/api/viewCheckoutHistory/${this.props.user}`)
			.then((res) => {
				console.log(res);
				this.setState({
					history: res.data,
					loading: false,
				});
				// console.log(this.state.history);
			})
			.catch(console.error);
	}

	onClickCheckin(bid) {
		axios.get(`/api/checkinBook/${bid}`).then((res) => {
			axios.get(`/api/viewCheckoutHistory/${this.props.user}`).then((res) => {
				console.log(res);
				this.setState({
					history: res.data,
				});
			});
		}).catch(console.error);
	}

	render() {
		const { history, loading } = this.state;
		// const style = {

		// }
		return (
			<div style={{ margin: '100px auto', width: '90%', height: '450px', overflowY:'auto'}}>
				{loading? 
					<div style ={{margin:'0 auto'}} className='loader'></div>
				: 
					<table className='tables' width={'100%'}>
						<tbody>
							<tr style={{ textAlign: 'center'}}>
								<th style={{ textAlign: 'left'}}>
									<strong>TITLE</strong>
								</th>
								<th style={{ textAlign: 'left'}}>
									<strong>AUTHOR</strong>
								</th>
								<th>
									<strong>ISBN</strong>
								</th>
								<th>
									<strong>DATE CHECKED OUT</strong>
								</th>
								<th>
									<strong>DATE CHECK IN</strong>
								</th>
								<th>
									<strong>CHECK IN</strong>
								</th>
							</tr>

							{history.length === 0 ? 
								<tr><td colspan='6' style={{textAlign:'center'}}><strong>Empty Checkout History ...</strong></td></tr>
								: 
								history.map((checkout, i) => 
									<CheckoutEntry 
										key={i} 
										checkout={checkout} 
										onClickCheckin={this.onClickCheckin} />)
							}
						</tbody>
					</table>
				}
			</div>
		);
	}
}

export default Checkouts;
