import React, {Component} from 'react';
import { MDBFormInline, MDBBtn } from 'mdbreact';
import axios from 'axios';


class IssueCardPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            reason: 'First_Time',
            mssg: '',
            loading: false,
        }
        this.onClick = this.onClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onClick(val){
        this.setState({
            reason: val
        })
    }

    onSubmit(){
        this.setState({
            loading: true,
            mssg: ''
        })
        const cid = document.getElementById('cid-swipe').value;
        const user = document.getElementById('user').value;
        if( cid && user && cid.trim() !== '' && user.trim() !== '' ){
            axios
            .get(`/api/issueNewCard/${cid}/${user}/${this.props.lid}/${this.state.reason}`)
            .then(res => {
                console.log(res)
                if (res.data.name !== 'error'){
                    this.setState({
                        loading: false,
                        mssg: 'Card Issued Successfully!'
                    })
                } else{
                    this.setState({
                        loading: false,
                        mssg: res.data.detail
                    })
                }
            })
            .catch(console.error);
        }
        else{
            this.setState({
                loading: false,
                mssg: 'Invalid Input!'
            })
        }
    }

    render(){
        const {reason, loading} = this.state;
        return(
            <div style={{ textAlign: 'center'}}>

                <br/><br/><br/><br/>
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
						style={{ width: '40%', fontSize:'25px' }}
						// onSubmit={this.onSubmit}
					/>
				</MDBFormInline>

				<MDBFormInline  className='md-form mr-auto mb-4' 
					onSubmit={ e => {e.preventDefault()} }>
					
					<input
						autoComplete='off'
						id='user'
						className='form-control mr-sm-2'
						type='text'
						placeholder='Username'
						aria-label='Search'
						style={{ width: '40%', fontSize:'25px' }}
						// onSubmit={this.onSubmit}
					/>

				</MDBFormInline>
                
                <br/>
                <MDBFormInline>
                {reason === 'First_Time' ? 
                    <div>
                        <MDBBtn size='sm' color='pink'>First Time</MDBBtn>
                        <MDBBtn 
                            size='sm' 
                            onClick={e=>this.onClick('Replacement',e)} 
                            outline color='pink'>Replacement</MDBBtn>
                        <MDBBtn 
                            size='sm' 
                            outline color='pink'
                            onClick={e=>this.onClick('Lost_Stolen',e)}>Lost/Stolen</MDBBtn>
                    </div>
                :
                    <div></div>
                }

                {reason === 'Replacement' ? 
                    <div>
                        <MDBBtn 
                            size='sm' 
                            outline color='pink'
                            onClick={e=>this.onClick('First_Time',e)}>First Time</MDBBtn>
                        <MDBBtn size='sm'  color='pink'>Replacement</MDBBtn>
                        <MDBBtn 
                            size='sm' 
                            outline color='pink'
                            onClick={e=>this.onClick('Lost_Stolen',e)}>Lost/Stolen</MDBBtn>
                    </div>
                :
                    <div></div>
                }

                {reason === 'Lost_Stolen' ? 
                    <div>
                        <MDBBtn 
                            size='sm' 
                            outline color='pink'
                            onClick={e=>this.onClick('First_Time',e)}>First Time</MDBBtn>
                        <MDBBtn 
                            size='sm' 
                            outline color='pink'
                            onClick={e=>this.onClick('Replacement',e)}>Replacement</MDBBtn>
                        <MDBBtn size='sm'  color='pink'>Lost/Stolen</MDBBtn>
                    </div>
                :
                    <div></div>
                }

                </MDBFormInline>
                <br/><br/>
                { loading ?
                    <div style ={{margin:'0 auto'}} className='loader'></div>
                :
                    <MDBBtn size='lg' color='unique' onClick={this.onSubmit}>
                            Submit
                    </MDBBtn>
                }
                <br/><br/>
                <div className='alert'>{this.state.mssg}</div>
            </div>

        )
    }
}

export default IssueCardPage;