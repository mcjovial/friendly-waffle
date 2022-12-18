import React, { Component } from 'react';
import { MDBBtn } from 'mdbreact';

class NavBarBttn extends Component {

    onClick(){
      this.props.switchContent(this.props.name);
    }
  
    render() {
      // console.log(this.props.selected);
      const { selected , name } = this.props;
      if (selected) {
        return <MDBBtn color='elegant' size='md' onClick={this.onClick.bind(this)}>{name}</MDBBtn>;
      } else {
        return <MDBBtn outline color='elegant' size='sm' onClick={this.onClick.bind(this)}>{name}</MDBBtn>;
      }
    }
      
  };

  export default NavBarBttn;