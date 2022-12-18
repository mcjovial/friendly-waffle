import React, {Component} from 'react';
import { MDBBtn } from 'mdbreact';
import axios from 'axios';

class Profile extends Component {

    onClick(){
        console.log(this.props.accountInfo.username);
        axios.get(`/api/payFee/${this.props.accountInfo.username}`)
            .then( res => {
                axios
                .get(`/api/viewPatronInfo/${this.props.accountInfo.username}`)
                .then((res) => {
                    console.log(res.data);
                    const accountInfo = {
                        username: this.props.accountInfo.username,
                        fname: res.data[0].fname,
                        lname: res.data[0].lname,
                        dob: res.data[0].dob,
                        cid: res.data[0].cid,
                        address: res.data[0].address,
                        phone: res.data[0].phone_number,
                        email: res.data[0].email,
                        fees: res.data[0].late_fee_amount,
                    };
                    this.props.setAccountInfo(accountInfo);
        })
        .catch(console.error);
            })
            .catch(console.error);
    }

    componentDidMount(){
        axios
        .get(`/api/viewPatronInfo/${this.props.accountInfo.username}`)
        .then((res) => {
            console.log(res.data);
            const accountInfo = {
                username: this.props.accountInfo.username,
                fname: res.data[0].fname,
                lname: res.data[0].lname,
                dob: res.data[0].dob,
                cid: res.data[0].cid,
                address: res.data[0].address,
                phone: res.data[0].phone_number,
                email: res.data[0].email,
                fees: res.data[0].late_fee_amount,
            };
            this.props.setAccountInfo(accountInfo);
        })
        .catch(console.error);
    }

    render(){
        const { accountInfo } = this.props; 
        return (
            <form className='profile' action='#' autoComplete='false'>
                <div className='signup-container'>
                    <br/><br/><br/>
                    <label>
                        <b>First Name</b>
                    </label>
                    <input type='text' placeholder={accountInfo.fname} id='fn' disabled/>

                    <label>
                        <b>Last Name</b>
                    </label>
                    <input type='text' placeholder={accountInfo.lname} id='ln' disabled />

                    <label>
                        <b>Date of Birth</b>
                    </label>
                    <input type='text' placeholder={accountInfo.dob.substr(0,10)} id='dob' disabled />

                    <label>
                        <b>Phone Number</b>
                    </label>
                    <input type='tel' placeholder={accountInfo.phone} id='phone' disabled />

                    <label>
                        <b>Address</b>
                    </label>
                    <input type='text' placeholder={accountInfo.address} id='addr' disabled />

                    <label>
                        <b>Email</b>
                    </label>
                    <input type='email' placeholder={accountInfo.email} id='email' disabled />

                    <label>
                        <b>Card ID</b>
                    </label>
                    <input type='email' placeholder={accountInfo.cid} id='cid' disabled />
                    
                    <br />
                    <label>
                        <h3>  Fees: {accountInfo.fees} </h3>
                    </label>
                    {accountInfo.fees !== '$ 0.00' ? 
                    <MDBBtn onClick={this.onClick.bind(this)} color='danger'>Pay Off</MDBBtn> :
                    <div></div>}
                    

                </div>
                
                <br />
                <br />
            </form>
        );
    }
};

export default Profile;