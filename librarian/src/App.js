import React, {Component} from 'react';
import Login from './Login';
import Navbar from './Navbar';
import Browse from './Browse';
import CheckinPage from './CheckinPage';
import CheckoutPage from './CheckoutPage';
import IssueCardPage from './IssueCardPage';
import AddPage from './AddPage';
import RemovePage from './RemovePage';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      lid: null,
      fname: null,
      content: 'Browse',
    }
    this.setAccountInfo = this.setAccountInfo.bind(this);
    this.resetAccountInfo = this.resetAccountInfo.bind(this);
    this.switchContent = this.switchContent.bind(this);
  }
  
  setAccountInfo(lid,fname){
    this.setState({
      lid: lid,
      fname: fname,
    })
  }

  resetAccountInfo(){
    this.setState({
      lid: null,
      fname: null,
      content: 'Browse',
    })
  }

  switchContent(content){
    this.setState({
      content:content
    })
  }

  render() {
    console.log(this.state);
    const {lid, fname,content } = this.state;
    return(
      <div>

        <Navbar 
          unauthenticated={lid === null} 
          content={content} 
          switchContent={this.switchContent}
          resetAccountInfo={this.resetAccountInfo}/>

        {lid === null ? <Login setAccountInfo={this.setAccountInfo}/> : 
            // If authenticated, render main content
            {
              'Browse' : <Browse fname={fname}/>,
              'Remove Book' : <RemovePage />,
              'Check In' : <CheckinPage />,
              'Check Out' : <CheckoutPage />,
              'Add Book' : <AddPage />,
              'Issue Card' : <IssueCardPage lid={lid}/>,
            }[content]
        }


      </div>

    )
  }
}

export default App;
