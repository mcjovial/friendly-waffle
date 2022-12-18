import React, { Component } from 'react';
import { MDBBtn } from 'mdbreact';

class NavBarBttn extends Component {

    onClick(){
      this.props.switchContent(this.props.name);
      // console.log(this.props.name);
    }
  
    render() {
      // console.log(this.props.selected);
      const { selected , name } = this.props;
      if (selected) {
        return <MDBBtn color='deep-purple' size='lg'>{name}</MDBBtn>;
      } else {
        return <MDBBtn outline color='deep-purple' onClick={this.onClick.bind(this)}>{name}</MDBBtn>;
      }
    }
      
  };

  export default NavBarBttn;