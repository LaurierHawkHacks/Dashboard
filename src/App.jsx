import LoginPage from './pages/LoginPage';
import LandingPage from './pages/Landing';
import Theme from './misc/Theme';
import config from "./config.json";
import React, {useState, useEffect} from 'react';
import firebase from "firebase";


const fire = firebase.initializeApp(config.firebaseConfig);

function App() {

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasAccount, setHasAccount]= useState(false);


  const clearError =()=>{
    setEmailError("");
    setPasswordError("");
  }

  const clearInputs = () =>{
    setUser("");
    setPassword("");
  }
  const handleLogin = () =>{
    clearError();
    fire.auth().signInWithEmailAndPassword(email, password).catch(error => {
      
      switch(error.code){
        case "auth/invalid-email":
        case "auth/user-disabled":
        case "auth/user-notfound":
          setEmailError(error.message);
          break;
        case "auth/wrong-password":
          setPasswordError(error.message);
          break;
      }
    })
    
  }

  const handleSignUp = () => {
    clearError();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
      
      switch(error.code){
        case "auth/email-already-in-use":
        case "auth/invalid-email":
          setEmailError(error.message);
          break;
        case "auth/weak-password":
          setPasswordError(error.message);
          break;
      }
    })
  }

  const handleLogout =()=>{
    fire.auth().signOut();
  }

  const authListener =() =>{
    fire.auth().onAuthStateChanged((user)=>{
      if(user){
        clearInputs();
        setUser(user);
      }else{
        setUser("");
      }
    })
  }
  
  useEffect(()=>{
    authListener();
    
  },[])

  return (

    <Theme>
      {user ? 
        (<LandingPage handleLogout={handleLogout}/>)
        :
        (
        <LoginPage 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        handleSignUp={handleSignUp}
        hasAccount={hasAccount}
        setHasAccount={setHasAccount}
        emailError={emailError}
        passwordError={passwordError}
         />

      )}
    </Theme>
  );
};

export default App;
