import React, { Component } from 'react';
import * as firebase from 'firebase';

class User extends Component {

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user);
    });
  }

  handleSignOut() {
    firebase.auth().signOut().then( ()=> {
      // firebase.auth().onAuthStateChanged catches all user changes and calls setUser() anyway
      //this.props.setUser(null);
    }).catch(function(error) {
      alert('Sign out error: '+error.message);
    });
  }

  handleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then( (result)=> {
      // firebase.auth().onAuthStateChanged catches all user changes and calls setUser() anyway
      //this.props.setUser(result.user);
    }).catch(function(error) {
      alert(`Sign in error: errorCode=${error.code} errorMessage=${error.message} email=${error.email} credential=${error.credential}`);
    });
  }

  render(){
    if (this.props.currentUser === null)
      return (
        <div className = {this.props.className}>
          <p>You are not signed in.</p>
          <button type='button' name='SignIn' id='singIn' onClick={()=>this.handleSignIn()}>Sign in</button>
        </div> )
    else return (
      <div className = {this.props.className}>
        <p>You are signed in as:</p>
        <h3>{this.props.currentUser.displayName}</h3>
        <button type='button' name='SignOut' id='singOut' onClick={()=>this.handleSignOut()}>Sign out</button>
      </div> )
  }
};

export default User;
