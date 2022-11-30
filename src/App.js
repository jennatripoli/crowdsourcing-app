import './App.css';
import React, {useRef} from 'react';

var currentPage;

function App() {
  const [redraw, forceRedraw] = React.useState(0);
  if (currentPage == null) currentPage = <Login />

  function Login() {
    const login_box = { position: "absolute", width: 400, height: 380, background: "lightgrey", textAlign: "center", top: "50%", left: "50%", marginLeft: -200, marginTop: -190 }
    const login_title = { position: "absolute", fontSize: "30pt", fontWeight: "bold", width: 400, top: 20, left: 0, textAlign: "center" }
    const login_email_label = { position: "absolute", fontWeight: "bold", top: 100, left: 20, textAlign: "center" }
    const login_email_input = { position: "absolute", width: 220, background: "white", top: 100, left: 150, textAlign: "left" }
    const login_pass_label = { position: "absolute", fontWeight: "bold", top: 150, left: 20, textAlign: "center" }
    const login_pass_input = { position: "absolute", width: 220, background: "white", top: 150, left: 150, textAlign: "left" }
    const login_type_label = { position: "absolute", fontWeight: "bold", top: 200, left: 20, textAlign: "center" }
    const login_type_radio = { position: "absolute", width: 220, top: 200, left: 150, textAlign: "left" }
    const login_button = { position: "relative", fontSize: "16pt", top: 320, width: 200 }

    var input_email = useRef(null);
    var input_password = useRef(null);
    var input_account_type = null;

    function handle_button_login() {
      if (document.querySelector('input[name="account_type"]:checked') != null) input_account_type = document.querySelector('input[name="account_type"]:checked');
  
      if (input_email.current.value.length == 0 || input_password.current.value.length == 0 || input_account_type.value == null) {
        alert("Fill out all fields before logging in or registering.");
      } else {
        console.log(input_email.current.value);
        console.log(input_password.current.value);
        console.log(input_account_type.value);
        currentPage = <DesignerViewProject />;
        forceRedraw(redraw + 1);
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
            <div> <label><input type="radio" id="supporter" name="account_type" value="supporter"></input>supporter</label> </div>
            <div> <label><input type="radio" id="designer" name="account_type" value="designer"></input>designer</label> </div>
            <div> <label><input type="radio" id="administrator" name="account_type" value="administrator"></input>administrator</label> </div>
          </div>

          <button style={login_button} onClick={handle_button_login}>Login or Register</button>
        </div>
      </div>
    );
  }

  function DesignerViewProject() {
    const info_box = { position: "absolute", width: 800, height: 700, background: "lightgrey", textAlign: "center", top: 50, left: 50, display: "inline-block" }
    const project_name = { position: "relative", fontSize: "40pt", fontWeight: "bold", top: 40 }
    const deadline_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 150, left: 20 }
    const deadline_label = { position: "absolute", width: 370, fontSize: "12pt", top: 10, left: 0 }
    const days_label = { position: "absolute", width: 370, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }
    
    const goal_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 150, right: 20 }
    const goal_label = { position: "absolute", width: 370, fontSize: "12pt", top: 10, left: 0 }
    const raised_label = { position: "absolute", width: 370, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }
    
    const description_box = { position: "absolute", width: 760, height: 340, background: "white", outline: "1px solid black", textAlign: "center", top: 255, left: 20 }
    const description_label = { position: "absolute", width: 740, height: 320, textAlign: "left", top: 10, left: 10 }
    const designer_label = { position: "absolute", fontSize: "14pt", fontWeight: "bold", bottom: 70, right: 20 }

    const active_label = { position: "absolute", width: 540, fontSize: "20pt", fontWeight: "bold", top: -45, left: 0 }
    const active_pledges_box = { position: "absolute", width: 540, height: 650, background: "lightgrey", textAlign: "center", top: 100, left: 900, display: "inline-block" }
    const pledge_box = { position: "relative", width: 500, height: 100, background: "white", outline: "1px solid black", textAlign: "left", left: 10, top: 10, padding: 10 }
    const pledge_name = { position: "absolute", fontWeight: "bold" }
    const pledge_amount = { position: "absolute", top: 35 }
    const pledge_description = { position: "absolute", top: 60 }

    return (
      <div className="DesignerViewProject">
        <div id="info_box" style={info_box}>
          <label style ={project_name}>Project Name</label>
          <div id="deadline_box" style={deadline_box}>
            <label style={deadline_label}>Project Deadline: mm/dd/yyyy</label>
            <label style={days_label}>00 DAYS LEFT</label>
          </div>
          <div id="goal_box" style={goal_box}>
            <label style={goal_label}>Project Goal: $0000</label>
            <label style={raised_label}>$0000 RAISED</label>
          </div>
          <div id="description_box" style={description_box}>
            <label style={description_label}>Project Description</label>
          </div>
          <label style={designer_label}><i>By: Designer Name</i></label>
        </div>

        <div id="active_pledges_box" style={active_pledges_box}>
          <label style={active_label}>Active Pledges</label>
          <div id="pledge_box" style={pledge_box}>
            <label style={pledge_name}>Pledge Name</label>
            <label style={pledge_amount}>$1000</label>
            <label style={pledge_description}>Pledge Description</label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>{currentPage}</div>
  );
}

export default App;
