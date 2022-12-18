import React, {Component} from 'react';
import { MDBFormInline, MDBBtn } from 'mdbreact';
import axios from 'axios';


class AddPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            loading: false,
            mssg: '',
            format: 'Physical',
        }
        this.onClick = this.onClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onClick(val){
        this.setState({
            format: val
        })
    }

    onSubmit(){
        this.setState({
            loading: true,
            mssg: '',
        })
        const title = document.getElementById('add-title').value;
        const author = document.getElementById('add-author').value;
        const isbn = document.getElementById('add-isbn').value;
        const count = document.getElementById('add-count').value;
        const category = document.getElementById('add-category').value;

        if( 
            title && title.trim() !== '' &&
            author && author.trim() !== '' &&
            isbn && isbn.trim() !== '' &&
            count && count.trim() !== '' &&
            category && category.trim() !== '' 
        ){
            const t = title.replace(/ /g,'-')
            const a = author.replace(/ /g,'-')
            const c = category.replace(/ /g,'-')
            const f = this.state.format[0]
            console.log(`/api/addBookToBookInfo/${isbn}/${t}/${a}/${c}/${f}/${count}`);
            axios
            .get(`/api/addBookToBookInfo/${isbn}/${t}/${a}/${c}/${f}/${count}`)
            .then(res => {
                if (res.data.name === 'error'){
                    this.setState({
                        mssg: res.data.detail,
                        loading: false,
                    })
                }
                else{
                    console.log(res);
                    this.setState({
                        mssg: 'Success',
                        loading: false,
                    })
                }
                
            })
            .catch(console.error);
        }
        else{
            this.setState({
                mssg: 'Invalid Input(s)',
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

        const { format } = this.state;
            
        return(
            <div style={style_login}>
                <br/><br/>
                <MDBFormInline className='md-form mr-auto mb-4' 
                    onSubmit={ e => {e.preventDefault()} } >
                    <input
                        autoComplete='off'
                        id='add-title'
                        className='form-control mr-sm-2'
                        type='text'
                        placeholder='Title'
                        aria-label='Search'
                        style={{ width: '50%', fontSize:'25px' }}
                        // onSubmit={this.onSubmit}
                    />
                </MDBFormInline>

                <MDBFormInline  className='md-form mr-auto mb-4' 
                    onSubmit={ e => {e.preventDefault()} }>
                    
                    <input
                        autoComplete='off'
                        id='add-author'
                        className='form-control mr-sm-2'
                        type='text'
                        placeholder='Author(s)'
                        aria-label='Search'
                        style={{ width: '50%', fontSize:'25px' }}
                        // onSubmit={this.onSubmit}
                    />

                </MDBFormInline>

                <MDBFormInline className='md-form mr-auto mb-4' 
                    onSubmit={ e => {e.preventDefault()} } >
                    <input
                        autoComplete='off'
                        id='add-isbn'
                        className='form-control mr-sm-2'
                        type='text'
                        placeholder='ISBN'
                        aria-label='Search'
                        maxLength='13'
                        style={{ width: '40%', fontSize:'25px' }}
                        // onSubmit={this.onSubmit}
                    />
                    {' '}
                    <input
                        autoComplete='off'
                        id='add-count'
                        className='form-control mr-sm-2'
                        type='number'
                        min='1'
                        placeholder='#'
                        aria-label='Search'
                        maxLength='10'
                        style={{ width: '10%', fontSize:'25px' }}
                        // onSubmit={this.onSubmit}
                    />
                </MDBFormInline>

                <MDBFormInline className='md-form mr-auto mb-4' 
                    onSubmit={ e => {e.preventDefault()} } >
                    <input
                        autoComplete='off'
                        id='add-category'
                        className='form-control mr-sm-2'
                        type='text'
                        placeholder='Category'
                        aria-label='Search'
                        style={{ width: '50%', fontSize:'25px' }}
                        // onSubmit={this.onSubmit}
                    />
                </MDBFormInline>

                
                <MDBFormInline>
                {format === 'Physical' ? 
                    <div>
                        <MDBBtn size='sm' color='light-green'>Physical</MDBBtn>
                        <MDBBtn 
                            size='sm' 
                            onClick={e=>this.onClick('Audio',e)} 
                            outline color='light-green'>Audio</MDBBtn>
                        <MDBBtn 
                            size='sm' 
                            outline color='light-green'
                            onClick={e=>this.onClick('E-Book',e)}>E-Book</MDBBtn>
                    </div>
                :
                    <div></div>
                }

                {format === 'Audio' ? 
                    <div>
                        <MDBBtn 
                            size='sm' 
                            outline color='light-green'
                            onClick={e=>this.onClick('Physical',e)}>Physical</MDBBtn>
                        <MDBBtn size='sm'  color='light-green'>Audio</MDBBtn>
                        <MDBBtn 
                            size='sm' 
                            outline color='light-green'
                            onClick={e=>this.onClick('E-Book',e)}>E-Book</MDBBtn>
                    </div>
                :
                    <div></div>
                }

                {format === 'E-Book' ? 
                    <div>
                        <MDBBtn 
                            size='sm' 
                            outline color='light-green'
                            onClick={e=>this.onClick('Physical',e)}>Physical</MDBBtn>
                        <MDBBtn 
                            size='sm' 
                            outline color='light-green'
                            onClick={e=>this.onClick('Audio',e)}>Audio</MDBBtn>
                        <MDBBtn size='sm'  color='light-green'>E-Book</MDBBtn>
                    </div>
                :
                    <div></div>
                }
                
                </MDBFormInline>




                <br/>
                {this.state.loading ?
                    <div style ={{margin:'0 auto'}} className='loader'></div>
                :
                    <MDBFormInline>
                        <MDBBtn size='lg' color='deep-purple' onClick={this.onSubmit}>
                            Add Book
                        </MDBBtn>
                    </MDBFormInline>
                }

                <br />
                <div className='alert'>{this.state.mssg}</div>
            </div>
        )
    }
}

export default AddPage;