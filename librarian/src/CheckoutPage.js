import React, { Component } from 'react';
import { MDBFormInline, MDBBtn } from 'mdbreact';
import axios from 'axios';

class CheckoutPage extends Component {

	constructor(props){
		super(props);
		this.state = {
			mssg: '',
			loading: false,
		}
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(){
		this.setState({
			loading: true,
			mssg: '',
		})
		const cid = document.getElementById('cid-swipe').value;
        const bid = document.getElementById('bid-scan').value;
        if( cid && bid && cid.trim() !== '' && bid.trim() !== '' ){
            axios
            .get(`/api/checkout_lib/${bid}/${cid}`)
            .then(res => {
                console.log(res)
                if (res.data.name !== 'error'){
                    this.setState({
						mssg: 'Checkout Successful',
						loading: false,
                    })
                } else{
					if (res.data.detail){
						this.setState({
							mssg: res.data.detail,
							loading: false,
						})
					}
					else{
						this.setState({
							mssg: 'This book is currently unavailable',
							loading: false,
						})
					}
                }
            })
            .catch(console.error);
        }
        else{
			this.setState({
				mssg: 'Invalid Input!',
				loading: false,
			})
        }
	}

    render(){
        const style_login = {
			fontFamily: 'courrier-new',
			width: '600px',
			margin: '20px auto ',
			textAlign: 'center',
		};
        return(
            <div style={style_login}>
                <br/><br/><br/><br/><br/><br/>
				<MDBFormInline className='md-form mr-auto mb-4' 
					onSubmit={ e => {e.preventDefault()} } >
					<input
						autoComplete='off'
						id='cid-swipe'
						className='form-control mr-sm-2'
						type='text'
						placeholder='Swipe Card (CID)'
                        aria-label='Search'
                        maxLength='10'
						style={{ width: '50%', fontSize:'25px' }}
						// onSubmit={this.onSubmit}
					/>
				</MDBFormInline>

				<MDBFormInline  className='md-form mr-auto mb-4' 
					onSubmit={ e => {e.preventDefault()} }>
					
					<input
						autoComplete='off'
						id='bid-scan'
						className='form-control mr-sm-2'
						type='text'
						placeholder='Scan Book (BID)'
						aria-label='Search'
						style={{ width: '50%', fontSize:'25px' }}
						// onSubmit={this.onSubmit}
					/>

				</MDBFormInline>

				<br/>

				{ this.state.loading ?
					<div style ={{margin:'0 auto'}} className='loader'></div>
				:
					<MDBFormInline>
						<MDBBtn size='lg' color='purple' onClick={this.onSubmit}>
							Check Out
						</MDBBtn>
					</MDBFormInline>
				}

				<br />
				<br />
				<div className='alert'>{this.state.mssg}</div>
			</div>
        )
    }
}

export default CheckoutPage;