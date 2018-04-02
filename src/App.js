import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';

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
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <nav>
          <h1 className="App-title">Bloc Chat</h1>
          <RoomList className='RoomList' firebase={firebase} />
        </nav>
      </div>
    )
  }
}

export default App;
