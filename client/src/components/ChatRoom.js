 /* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import { AddMessage } from './AddMessage';
import { MessageList } from './MessageList';
import { HomeNav } from './Nav';

import _ from 'lodash';

class GroupChatRoom extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      typingStatus: false,
      messages: [],
      roomname: '2016-06-01_madrid_to_barcelona'
    }
    this.debouncedDisableTypingStatus = _.debounce(this.disableTypingStatus, 1000);
  }

  componentDidMount () {
    this.props.route.mainSocket.on('typing status', (bool) => {
      this.enableTypingStatus();
      this.debouncedDisableTypingStatus();
    }); 
    this.props.route.mainSocket.on('get messages for room', (messages) => {
      console.log('23456789', messages);
      this.setState({
        messages: messages
      });
    });
    
    this.getMessages();
  }

  sendMessage (event) {
    event.preventDefault(); 
    let messageData = {
      username: this.props.route.username,
      message: ReactDOM.findDOMNode(this.refs.message).value,
      room: 'default',
      createAt: new Date()
    }
    console.log('!!!!!!!', messageData);

    this.props.route.mainSocket.emit('send message', messageData, this.state.roomname);
  }

  sendTypingStatus () {
    this.props.route.mainSocket.emit('send typing status', true);
  }

  enableTypingStatus () {
    this.setState({
      typingStatus: true
    });
    console.log('toggle ', true);
  }
  
  disableTypingStatus () {
    this.setState({
      typingStatus: false
    });
    console.log('toggle ', false);
  }

  getMessages () {
    this.props.route.mainSocket.emit('get messages for room', this.state.roomname);
  }

  render () {
    let typingStatus = this.state.typingStatus ? <div style={{color:'white'}}>Is Typing...</div> : <div></div>;
    return (
      <div>
        <HomeNav />
        <h1 style={{color:'white'}}>GroupChatRoom</h1>
        <MessageList username={this.props.route.username} messages={this.state.messages} />
        {typingStatus}
        <form>
          <fieldset>
            <legend style={{color:'white'}}>Send:</legend>
            <textarea ref='message' onChange={() => {this.sendTypingStatus()}}/><br/>
            <input onClick={(event) => this.sendMessage(event)} type="submit" value="Submit" style={{color:'white'}} />
          </fieldset>
        </form>
      </div>
    );
  }
}

export {GroupChatRoom};