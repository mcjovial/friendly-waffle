import React, {Component} from 'react';
import { MDBFormInline, MDBBtn } from 'mdbreact';
import axios from 'axios';

class CheckinPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            list : [],
            loading: true,
        }
        this.onSearch = this.onSearch.bind(this);
        this.onClickCheckin = this.onClickCheckin.bind(this);
    }

    componentDidMount(){
        axios
        .get('/api/viewActiveCheckouts/')
        .then(res => this.setState({list:res.data, loading:false}))
        .catch(console.error);
    }

    onSearch(){
        this.setState({
            loading: true,
        });
        const bid = document.getElementById('search-bid').value;
        if(bid && bid.trim() !== ''){
            axios
            .get(`/api/viewCheckoutByBID/${bid}/`)
            .then(res => this.setState({list:res.data,loading:false}))
            .catch(console.error);
        } else {
            axios
            .get('/api/viewActiveCheckouts/')
            .then(res => this.setState({list:res.data, loading:false}))
            .catch(console.error);
        }
    }

    onClickCheckin(bid) {
        this.setState({
            loading: true,
        });
        axios
        .get(`/api/checkinBook/${bid}`)
        .then((res) => {
            axios
            .get(`/api/viewActiveCheckouts/`)
            .then((res) => {
				this.setState({
                    list: res.data,
                    loading: false,
				});
			});
		}).catch(console.error);
	}

    render(){
        console.log(this.state.list);
        const {list, loading} = this.state;
        return(
            <div style={{textAlign:'center'}}>

                    { loading ?  <div 
                                style={{margin:'200px auto', height:'160px', width:'160px'}} 
                                className='loader'></div> :
                    <div>
                        <br/>
                        <MDBFormInline  className='md-form mr-auto mb-4' 
                            onSubmit={ e => {e.preventDefault(); this.onClickLogin()} } >
                            <input
                                autoComplete='off'
                                id='search-bid'
                                className='form-control mr-sm-2'
                                type='text'
                                placeholder='Scan Book (BID)'
                                aria-label='Search'
                                maxLength='4'
                                style={{ width: '40%', fontSize:'30px' }}
                            />
                            <MDBBtn size='md' color='danger' onClick={this.onSearch} >
                                SEARCH
                            </MDBBtn>
                        </MDBFormInline>
                        <div style={{ margin: '20px auto', width: '950px', height: '480px' , overflowY: 'auto' }}>
                        <table className='tables' style={{width: '100%'}}>
                            <tbody>
                                <tr>
                                    <th style={{ textAlign: 'left'}}>
                                        <strong>INDEX</strong>
                                    </th>
                                    <th style={{ textAlign: 'left'}}>
                                        <strong>USER</strong>
                                    </th>
                                    <th style={{ textAlign: 'left'}}>
                                        <strong>TITLE</strong>
                                    </th>
                                    <th>
                                        <strong>CHECK OUT DATE</strong>
                                    </th>
                                    <th>
                                        <strong>ISBN</strong>
                                    </th>
                                    <th>
                                        <strong>BID</strong>
                                    </th>
                                    <th>
                                        <strong>CHECK IN</strong>
                                    </th>
                                </tr>
                                {list.map((e,i)=>(
                                    <tr key={i}>
                                        <td>{i+1}</td>
                                        <td>{e.username}</td>
                                        <td>{e.title}</td>

                                    <td>
                                        {e.check_out_date.substr(0,10)} {' '} {e.check_out_date.substr(11,8)}
                                    </td>


                                        <td>{e.isbn}</td>
                                        <td>{e.bid}</td>
                                        <td>{e.format === 'P' ? 
                                                <MDBBtn 
                                                    size='sm' 
                                                    color='cyan' 
                                                    onClick={event => this.onClickCheckin(e.bid,event)}>
                                                    Check in</MDBBtn> 
                                            : 
                                                'Online'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    
                </div>
                    </div>
                    }
            </div>
        )
    }
}

export default CheckinPage;