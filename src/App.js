import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDufSUU-vMxMs3K2RM4b1Xez-pluR_hA4c",
    authDomain: "bloc-chat-b182c.firebaseapp.com",
    databaseURL: "https://bloc-chat-b182c.firebaseio.com",
    projectId: "bloc-chat-b182c",
    storageBucket: "",
    messagingSenderId: "984059359623"
  };
  firebase.initializeApp(config);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRoom: null,
      currentUser: null
    };
  }

  setCurrentRoom(currentRoom){
    if (currentRoom !== this.state.currentRoom) {
        //console.log('app.js:setCurrentRoom: '+currentRoom)
        this.setState( {currentRoom: currentRoom} );
      }
    }

  setUser(user){
    if (user !== this.state.currentUser) {
      this.setState( {currentUser: user} );
    }
  }

  render() {
    //console.log("app.js render: currentRoom="+this.state.currentRoom+', currentUser='+this.state.currentUser);
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <nav>
          <RoomList className='RoomList'
            firebase={firebase}
            currentRoom={this.state.currentRoom}
            setCurrentRoom= {(room)=>this.setCurrentRoom(room)} />
        </nav>
        <main>
          <MessageList className='MessageList'
            firebase={firebase}
            currentRoom={this.state.currentRoom}
            currentUser={this.state.currentUser}
            />
        </main>
        <footer>
          <User className="User"
            firebase={firebase}
            currentUser={this.state.currentUser}
            setUser={ (user)=>this.setUser(user) }
          />
        </footer>
      </div>
    )
  }
}

export default App;
