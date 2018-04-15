import React, { Component } from 'react';
//import * as firebase from 'firebase';

class User extends Component {
  constructor(props) {
    super(props);
    //this.userRef = this.props.firebase.ref('signedInUsers');
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( (user) => {
      if (user) {
        console.log('onAuthStateChanged: '+user.displayName+'signed in');
        const ref = this.props.firebase.database().ref('signedInUsers/'+user.uid);
        ref.child('isTyping').set('false').catch((error)=>{
          alert('onAuthStateChanged: '+error.message);
        })
      }
      else {
        console.log('onAuthStateChanged: '+this.props.currentUser.displayName+'signed out');
        this.props.firebase.database().ref('signedInUsers/'+this.props.currentUser.uid).remove().catch((error)=>{
          alert('onAuthStateChanged: '+error.message);
        })
      }
      this.props.setUser(user);
    });
  }

  handleSignOut() {
    console.log('in handleSignOut!');
    this.props.firebase.auth().signOut().then( ()=> {
      console.log('handleSignOut succeeded');
      // firebase.auth().onAuthStateChanged catches all user changes and calls setUser() anyway
    }).catch((error)=>{
      alert('Sign out error: '+error.message);
    });
  }

  handleSignIn() {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();

    this.props.firebase.auth().setPersistence(this.props.firebase.auth.Auth.Persistence.SESSION)
      .then(()=> {
        this.props.firebase.auth().signInWithPopup(provider).then( (result)=> {
          // firebase.auth().onAuthStateChanged catches all user changes and calls setUser() anyway
        }).catch((error)=>{
          alert(`Sign in error: errorMessage=${error.message} email=${error.email} credential=${error.credential}`);
        });
      })
    .catch((error)=> {
      alert('setPersistence error: '+error:message);
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
