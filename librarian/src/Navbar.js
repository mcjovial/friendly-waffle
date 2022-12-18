import React, { Component } from 'react';
import { MDBNavbar, MDBBtn } from 'mdbreact';
import NavBarBttn from './NavbarBttn';

class NavBar extends Component {
	// onCickLogout() {
	// 	this.props.resetAccountInfo();
	// }

	render() {
		// const { content, switchContent, resetAccountInfo, guest } = this.props;
        const style = { backgroundColor: 'rgba(250, 255, 205, 0.932)', textAlign: 'center' };
        const {unauthenticated, switchContent, content, resetAccountInfo} = this.props;
        return (
            <div>
                <MDBNavbar style={style} dark expand='md' scrolling fixed='top'>
                    { unauthenticated ? <div><br/><br/></div> :
                        <div>
                            <NavBarBttn 
                                name='Issue Card' 
                                selected={content === 'Issue Card'}
                                switchContent={switchContent}/>
                            
                            <NavBarBttn 
                                name='Check In' 
                                selected={content === 'Check In'}
                                switchContent={switchContent}/>

                            <NavBarBttn 
                                name='Check Out' 
                                selected={content === 'Check Out'}
                                switchContent={switchContent}/>

                            <NavBarBttn 
                                name='Browse' 
                                selected={content === 'Browse'}
                                switchContent={switchContent}/>

                            <NavBarBttn 
                                name='Add Book' 
                                selected={content === 'Add Book'}
                                switchContent={switchContent}/>


                            <NavBarBttn 
                                name='Remove Book' 
                                selected={content === 'Remove Book'}
                                switchContent={switchContent}/>
                            
                            <MDBBtn color='pink' size='sm' onClick={resetAccountInfo}>Logout</MDBBtn>
                        
                        </div>}
                </MDBNavbar>
            </div>
        );
		
	}
}

export default NavBar;
