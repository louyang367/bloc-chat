import React, { Component } from 'react';

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: []
    };
    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  componentDidMount() {
     this.roomsRef.on('child_added', snapshot => {
       const room = {};
       /*room[snapshot.key] = snapshot.val();*/
       room.value = snapshot.val();
       room.key = snapshot.key;
       this.setState({ rooms: this.state.rooms.concat( room ) })
    });
  }

  render(){
    return (
      <ul className = {this.props.className}>
      {
        this.state.rooms.map( (room, index) =>
          <li key={room.key}>{room.value}</li>
        )
      }
      </ul>
     );
   }
};

export default RoomList;
