import React, { Component } from 'react';
import { MDBFormInline, MDBBtn } from 'mdbreact';
import axios from 'axios';

class RemovePage extends Component {

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
			mssg: '',
			loading: true,
		})
		const isbn = document.getElementById('isbn').value;
        if( isbn && isbn.trim() !== '' ){
            axios
            .get(`/api/removeBookBasedOnISBN/${isbn}/`)
            .then(res => {
                console.log(res)
                if (res.data.name !== 'error'){
                    this.setState({
						mssg: 'Book Removed',
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
							mssg: 'Error!!',
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
						id='isbn'
						className='form-control mr-sm-2'
						type='text'
						placeholder='ISBN'
                        aria-label='Search'
                        maxLength='13'
						style={{ width: '50%', fontSize:'25px' }}
						// onSubmit={this.onSubmit}
					/>
				</MDBFormInline>


				<br/>
				{this.state.loading ?
					<div style ={{margin:'0 auto'}} className='loader'></div>
				:
					<MDBFormInline>
						<MDBBtn size='lg' color='deep-orange' onClick={this.onSubmit}>
							Remove
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

export default RemovePage;