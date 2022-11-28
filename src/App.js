import './App.css';

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
  position: "relative", fontSize: "16pt", background: "white",
  top: 320, width: 300
}

// login screen
function App() {
  return (
    <div className="App">
      <div id="login-box" style={login_box}>
        <label style={login_title}>LOG IN</label>

        <label style={login_email_label}>email address:</label>
        <input id="email" type="text" style={login_email_input}></input>

        <label style={login_pass_label}>password:</label>
        <input id="password" type="text" style={login_pass_input}></input>

        <label style={login_type_label}>account type:</label>
        <div style={login_type_radio}>
          <div> <input type="radio" id="supporter" name="account_type" value="supporter"></input>
            <label for="supporter">supporter</label> </div>
          <div> <input type="radio" id="designer" name="account_type" value="designer"></input>
            <label for="designer">designer</label> </div>
          <div> <input type="radio" id="administrator" name="account_type" value="administrator"></input>
            <label for="administrator">administrator</label> </div>
        </div>

        <button style={login_button}>Login or Create Account</button>
      </div>

    </div>
  );
}

export default App;
