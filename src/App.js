import './App.css';
import {useRef} from 'react';

const login_box = {
  position: "absolute", width: 400, height: 380, background: "lightgrey", textAlign: "center",
  top: "50%", left: "50%", marginLeft: -200, marginTop: -190
}
const login_title = {
  position: "absolute", fontSize: "30pt", fontWeight: "bold", width: 400,
  top: 20, left: 0, textAlign: "center"
}

const login_email_label = {
  position: "absolute", fontWeight: "bold",
  top: 100, left: 20, textAlign: "center"
}
const login_email_input = {
  position: "absolute", width: 220, background: "white",
  top: 100, left: 150, textAlign: "left"
}

const login_pass_label = {
  position: "absolute", fontWeight: "bold",
  top: 150, left: 20, textAlign: "center"
}
const login_pass_input = {
  position: "absolute", width: 220, background: "white",
  top: 150, left: 150, textAlign: "left"
}

const login_type_label = {
  position: "absolute", fontWeight: "bold",
  top: 200, left: 20, textAlign: "center"
}
const login_type_radio = {
  position: "absolute", width: 220,
  top: 200, left: 150, textAlign: "left"
}

const login_button = {
  position: "relative", fontSize: "16pt",
  top: 320, width: 200
}

// login screen
function App() {
  var input_email = useRef(null);
  var input_password = useRef(null);
  var input_account_type = null;

  function login() {
    if (document.querySelector('input[name="account_type"]:checked') != null) input_account_type = document.querySelector('input[name="account_type"]:checked');

    if (input_email.current.value.length == 0 || input_password.current.value.length == 0 || input_account_type.value == null) {
      alert("Fill out all fields before logging in or registering.");
    } else {
      // this is where we send info to the database and select which page to open based on the user type
      console.log(input_email.current.value);
      console.log(input_password.current.value);
      console.log(input_account_type.value);
    }
  }

  return (
    <div className="App">
      <div id="login-box" style={login_box}>
        <label style={login_title}>LOG IN</label>

        <label style={login_email_label}>email address:</label>
        <input id="email" type="text" ref={input_email} style={login_email_input}></input>

        <label style={login_pass_label}>password:</label>
        <input id="password" type="text" ref={input_password} style={login_pass_input}></input>

        <label style={login_type_label}>account type:</label>
        <div style={login_type_radio}>
          <div> 
            <label><input type="radio" id="supporter" name="account_type" value="supporter"></input>supporter</label>
          </div><div> 
            <label><input type="radio" id="designer" name="account_type" value="designer"></input>designer</label>
          </div><div> 
            <label><input type="radio" id="administrator" name="account_type" value="administrator"></input>administrator</label>
          </div>
        </div>

        <button style={login_button} onClick={login}>Login or Register</button>
      </div>
    </div>
  );
}

export default App;
