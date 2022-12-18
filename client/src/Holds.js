import React, { Component } from 'react';
import axios from 'axios';
import HoldEntry from './HoldEntry';

class Holds extends Component {
	constructor(props) {
		super(props);
		this.state = {
			holds: [],
			loading: true,
		};
	}

	componentDidMount() {
		axios
			.get(`api/checkMyHold/${this.props.user}`)
			.then((res) => {
				console.log(res);
				this.setState({
					holds: res.data,
					loading:false
				});
				console.log(this.state.holds);
			})
			.catch(console.error);
	}

	render() {
		const { holds, loading } = this.state;

		return (
			<div style={{ margin: '100px auto', width: '90%' }}>
				{loading? (
					<div style ={{margin:'0 auto'}} className='loader'></div>
				) : (
					<table className='tables' width={'100%'}>
						<tbody>
							<tr style={{ textAlign: 'center' }}>
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
									<strong>FORMAT</strong>
								</th>
								<th>
									<strong>REQUEST DATE</strong>
								</th>
								<th>
									<strong>AVAILABILITY</strong>
								</th>
							</tr>

							{holds.length === 0 ? (
								<tr><td colspan='6' style={{textAlign:'center'}}><strong>No Holds Active ...</strong></td></tr>
							) : (
								holds.map((hold, i) => 
									<HoldEntry 
										switchContent={this.props.switchContent} 
										user={this.props.user}
										hold={hold} 
										key={i}/>)
							)}
						</tbody>
					</table>
				)}
			</div>
		);
	}
}

export default Holds;
