import React, { Component } from 'react';
import * as firebase from 'firebase';
import RoomList from './RoomList';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.messageRef = this.props.firebase.database().ref('Messages');
    this.editMode = false;
    this.contextMenuForMsg = null;
    this.currentMsg = null;
    this.currentList = null;
  }

  componentDidMount() {
    this.messageRef.on('value', (snapshot) => {
      //console.log('child_added triggered! snapshot=' +snapshot.val().content);
      let messages = [];
      const msgsObj = snapshot.val();
      for (let msgId in msgsObj){
        const msg = {
          key: msgId,
          value: msgsObj[msgId]
        }
        messages.push(msg);
      }
      this.setState({ messages: messages });
    })

    document.addEventListener('click', (e)=>{this.clicktoClose(e)});
  }

  componentWillUnmount() {
    this.roomsRef.off('value');
    document.removeEventListener('click', (e)=>{this.clicktoClose(e)});
  }

  handleNewMsgSubmit(){
    if (this.props.currentRoom === null) {
      alert("Please select a room first.");
      return;
    } else if (this.props.currentUser === null) {
      alert("You have to sign in to post a message.");
      return;
    }
    //clicktoClose() has already cleared the screen
    const newMessage = {};
    newMessage.key = this.messageRef.push();

    newMessage.value = {
      sentAt: firebase.database.ServerValue.TIMESTAMP,
      roomId: this.props.currentRoom.key,
      username: this.props.currentUser.displayName,
      content: this.input.value
    };

    newMessage.key.set(newMessage.value)
      .then(()=> {
        this.input.value = '';
      })
      .catch((error)=> {
        alert(error.message);
      });
  }

  handleEditMsgSubmit(){
    const clickedMsgRef = this.props.firebase.database().ref('Messages/'+this.currentMsg.key);
    clickedMsgRef.update({
      "content": this.input.value
    })
    .then(()=> {
      this.input.value = '';
      this.editMode = false;
      this.currentList.style.border = 'none';
      this.currentList = null;
    })
    .catch((error)=> {
      alert(error.message);
    });
  }

  handleMsgContext(e, msg){
    e.preventDefault();
    this.contextMenuForMsg.style.display = "block";
    this.contextMenuForMsg.style.top =  RoomList.mouseY(e, document) + 'px';
    this.contextMenuForMsg.style.left =  RoomList.mouseX(e, document) + 'px';
    this.currentMsg = msg;
    //remove old selection's border
    if (this.currentList != null)
      this.currentList.style.border = 'none';
    this.currentList = e.target.parentElement;
  }

  validateAction(){
    this.input.value = '';
    if (this.props.currentUser === null) {
      alert("You have to sign in to post or edit a post.");
      return false;
    } else if (this.props.currentUser.displayName !== this.currentMsg.value.username){
      alert("You can only edit or delete your own posts.");
      return false;
    }
    return true;
  }

  deleteMsg(e){
    console.log('in deleteMsg currentMsg='+this.currentMsg.value.content+' key='+this.currentMsg.key);
    if (this.validateAction() === false) return;

    const clickedMsgRef = this.props.firebase.database().ref('Messages/'+this.currentMsg.key);
    clickedMsgRef.remove()
      .then(()=>{
        console.log("Remove succeeded.");
        this.currentMsg = null;})
      .catch(error=>{console.log(error.message)});
    // remove context menu no matter what
    this.contextMenuForMsg.style.display = 'none';
  }

  editMsg(e){
    //console.log(`in editMsg: currentMsg=${this.currentMsg.value.content} props.user.value=${this.props.currentUser.value} currentMsg.value.username=${this.currentMsg.value.username}`);
    if (this.validateAction() === false) return;
    this.input.value = this.currentMsg.value.content;
    this.input.focus();
    this.editMode = true;
    this.currentList.style.borderColor = 'red';
    this.currentList.style.borderStyle = 'dashed';
    this.currentList.style.borderWidth = '2px';
  }

  clicktoClose(e){
    //onClick event handler (if exists) is called before this

    // has chosen a context menu item
    if (e.target.parentElement === this.contextMenuForMsg) {
      console.log('1.............');
      this.contextMenuForMsg.style.display = 'none';
    }
    // Clicking outside textarea and not the selected msg exits edit mode
    else if (this.editMode && e.target !== this.currentList && e.target !== this.input) {
      console.log('2..........in clicktoClose: editMode, input='+this.input.value);
      this.input.value = '';
      this.editMode = false;
      this.currentList.style.border = 'none';
      this.contextMenuForMsg.style.display = 'none';
    }
    // clicking anywhere else when context menu is on closes the menu
    else if (this.contextMenuForMsg && this.contextMenuForMsg.style.display !== 'none'){
      console.log('3..........');
      this.contextMenuForMsg.style.display = 'none';
    }
  }

  render(){
    //li don't need ref since onContextMenu has e.target
    //ref={(list)=>{this.currentMsg=msg; this.currentList=list}}>

    return (
      <div>
      <section className = {this.props.className}>
        <h3>{this.props.currentRoom===null?'':this.props.currentRoom.value}</h3>
        <ul>
          {
            this.state.messages.filter((msg)=>this.props.currentRoom!=null
            && msg.value.roomId===this.props.currentRoom.key).map( (msg) =>
            <li key={msg.key} tabIndex="0"
              onContextMenu= {(e)=>this.handleMsgContext(e, msg)}>
              <p id='username'>{msg.value.username}</p>
              <span id='content'>{msg.value.content}</span>
              <span id='sentat'>{new Date(msg.value.sentAt).toLocaleDateString() +' '
                + new Date(msg.value.sentAt).toLocaleTimeString()}</span>
            </li>)
          }
        </ul>
        {/* right click menu */}
        <ul id='contextMsg' ref={(menu)=>this.contextMenuForMsg=menu}>
            <li onClick={(e)=>this.deleteMsg(e)}>Delete</li>
            <li onClick={(e)=>this.editMsg(e)}>Edit</li>
        </ul>
      </section>
      {/*new message textarea*/}
      <section className='newMessage'>
        <textarea name='new message'
          id='newMessage'
          row = '3'
          placeholder='Write your message here...'
          ref={(input) => this.input = input}/>
        <button type='submit' id='newMessageSubmit'
          onClick={()=>this.editMode?this.handleEditMsgSubmit():this.handleNewMsgSubmit()}>Send</button>
      </section>
      </div>
    );
  }
};

export default MessageList;
