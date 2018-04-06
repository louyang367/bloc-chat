import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBZlFvW0Gq4iAR5Uux7Jn2NKEAkAKyyl3s",
    authDomain: "bloc-chat-2db5d.firebaseapp.com",
    databaseURL: "https://bloc-chat-2db5d.firebaseio.com",
    projectId: "bloc-chat-2db5d",
    storageBucket: "bloc-chat-2db5d.appspot.com",
    messagingSenderId: "402057190456"
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
    this.setState( {currentRoom: currentRoom} );
  }

  setUser(user){
    this.setState( {currentUser: user} );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <nav>
          <h1 className="App-title">Bloc Chat</h1>
          <RoomList className='RoomList'
            firebase={firebase}
            currentRoom={this.state.currentRoom}
            setCurrentRoom= {(room)=>this.setCurrentRoom(room)} />
        </nav>
        <main>
          <MessageList className='MessageList'
            firebase={firebase}
            currentRoom={this.state.currentRoom} />
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
