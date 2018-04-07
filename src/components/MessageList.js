import React, { Component } from 'react';
import * as firebase from 'firebase';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.messageRef = this.props.firebase.database().ref('Messages');
    this.newMessage = {};
  }

  componentDidMount() {
    this.messageRef.on('child_added', (snapshot) => {
      //console.log('child_added triggered! snapshot=' +snapshot.val().content);
      const msg = {
        value: snapshot.val(),
        key: snapshot.key
      }
      this.setState({ messages: this.state.messages.concat( msg ) });
    })
  }

  handleNewMessage(){
    if (this.props.currentRoom == null) {
      alert("Please select a room first.");
      return;
    } else if (this.props.currentUser == null) {
      alert("You have to sign in to post a message.");
      return;
    }

    this.newMessage.key = this.messageRef.push();
    this.newMessage.value = {
      sentAt: firebase.database.ServerValue.TIMESTAMP,
      roomId: this.props.currentRoom.key,
      username: this.props.currentUser.displayName,
      content: this.input.value
    };

    this.newMessage.key.set(this.newMessage.value)
      .then(()=> {
        this.newMessage = {};
        this.input.value = '';
      })
      .catch((error)=> {
        alert(error.message);
      });
  }

  render(){
    return (
      <div>
      <section className = {this.props.className}>
        <h3>{this.props.currentRoom===null?'':this.props.currentRoom.value}</h3>
        <ul>
          {
            this.state.messages.filter((msg)=>this.props.currentRoom!=null
            && msg.value.roomId===this.props.currentRoom.key).map( (msg) =>
            <li key={msg.key}>
              <p id='username'>{msg.value.username}</p>
              <span id='content'>{msg.value.content}</span>
              <span id='sentat'>{new Date(msg.value.sentAt).toLocaleDateString() +' '
                + new Date(msg.value.sentAt).toLocaleTimeString()}</span>
            </li>)
          }
        </ul>
      </section>
      <section className='newMessage'>
        <textarea name='new message'
          id='newMessage'
          row = '3'
          placeholder='Write your message here...'
          ref={(input) => this.input = input}/>
        <button type='submit' id='newMessageSubmit' onClick={()=>this.handleNewMessage()}>Send</button>
      </section>
      </div>
    );
  }
};

export default MessageList;
