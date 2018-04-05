import React, { Component } from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.messageRef = this.props.firebase.database().ref('Messages');
  }

  componentDidMount() {
    this.messageRef.on('child_added', (snapshot) => {
      const msg = {
        value: snapshot.val(),
        key: snapshot.key
      }
      this.setState({ messages: this.state.messages.concat( msg ) });
    })
  }

  render(){
    return (
      <div className = {this.props.className}>
        <h3>{this.props.currentRoom===null?'':this.props.currentRoom.value}</h3>
        <ul>
          {
            this.state.messages.filter((msg)=>this.props.currentRoom!=null
            && msg.value.roomId===this.props.currentRoom.key).map( (msg) => <li key={msg.key}>
            <p id='username'>{msg.value.username}</p>
            <span id='content'>{msg.value.content}</span>
            <span id='sentat'>{msg.value.sentAt}</span></li>)
          }
        </ul>
      </div>
    );
  }
};

export default MessageList;
