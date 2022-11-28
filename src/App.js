import './App.css';

const login_box = {position: "absolute", width: 400, height: 600, background: "grey", textAlign: "center",
  top: "50%", left: "50%", marginLeft: -200, marginTop: -300}
const login_title = {top: 40}
const login_email = {top: 100}
const login_password = {top: 200}

// login screen
function App() {
  return (
    <div className="App">
      {/* 
        email address text box
        password text box
        account type user select
        login or create new account button

        <div id="login-box" style={login_box}>
          <label style={login_title}>LOG IN</label>

          <label style={login_email}>email address:</label>
          <input id="email" type="text" style={login_email}></input>
          <label style={login_password}>password:</label>
          <input id="password" type="text" style={login_password}></input>
        </div>
      */}
        
    </div>
  );
}

export default App;
