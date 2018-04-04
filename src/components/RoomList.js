import React, { Component } from 'react';

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: []
    };
    this.roomsRef = this.props.firebase.database().ref('rooms');
    this.modal = null;
  }

  ignoreEnterKey (e) {
    if ( (e.keyIdentifier==='U+000A'||e.keyIdentifier==='Enter'||e.keyCode===13)
      && (e.target.nodeName==='INPUT' && e.target.type==='text') ){
        e.preventDefault();
      }
  }

  componentDidMount() {
     this.roomsRef.on('child_added', snapshot => {
       const room = {};
       room.value = snapshot.val();
       room.key = snapshot.key;
       this.setState({ rooms: this.state.rooms.concat( room ) })
    });
    this.modal = document.getElementById('formToCreateRoom');
    window.addEventListener('keydown', this.ignoreEnterKey);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.ignoreEnterKey);
  }

  createRoom(e){
    const val = (document.forms['formToCreateRoom']['inputRoomName'].value);
    const newRef = this.roomsRef.push();
    newRef.set(val);
    this.modal.style.display = "block";
    e.preventDefault(); /* form remains until cancel button is clicked */
  }

  handleNewRoomClick(){
    this.modal.style.display = "block";
  }

  handleCloseNewRoomClick(){
    this.modal.style.display = "none";
  }

  render(){
    return (
      <div className = {this.props.className}>
        {/* list of existing rooms */}
        <ul>
          {
            this.state.rooms.map( (room, index) =>
            <li key={room.key}>{room.value}</li>
          )}
        </ul>
        {/* button to create new room */}
        <button type='button' name='New room' id='newRoom' onClick={()=>this.handleNewRoomClick()}>New room</button>
        {/* form to enter new room name. No checkin for duplication. Must click 'cancel' to close */}
        <form name = 'formToCreateRoom' id='formToCreateRoom' onSubmit={(e)=>this.createRoom(e)}>
          <fieldset>
            <h3>Create New Room</h3>
            <label>Enter a room name
              <input type='text' name='inputRoomName' />
            </label>
            <div className='buttons'>
              <button type='reset' value='Cancel' onClick={()=>this.handleCloseNewRoomClick()}>Cancel</button>
              <button type='submit' value='Create'>Create</button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
};

export default RoomList;
