import './App.css';
import React, {useRef} from 'react';
import axios from "axios";

var currentPage;
const instance = axios.create({baseURL: 'https://icki0h6bb0.execute-api.us-east-1.amazonaws.com/Prod/'});

function App() {
  let [redraw, forceRedraw] = React.useState(0)
  if (currentPage == null) currentPage = <Login />
  let initRef = useRef(null)




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

    let input_email = useRef(null)
    let input_password = useRef(null)
    let input_account_type = null

    function handle_button_login() {
      if (document.querySelector('input[name="account_type"]:checked') != null) input_account_type = document.querySelector('input[name="account_type"]:checked');
  
      if (input_email.current.value == null || input_password.current.value == null || input_account_type.value == null) {
        alert("Fill out all fields before logging in or registering.")
      } else {
        let msg = {}
        msg["email"] = input_email.current.value
        msg["password"] = input_password.current.value
        msg["account_type"] = input_account_type.value
        let dataValue = JSON.stringify(msg)
        let data = { 'body' : dataValue }

        if (input_account_type.value == 'designer') {
          instance.post('/loginDesigner', data).then((response) => {
            currentPage = DesignerListProjects(msg["email"])
            forceRedraw(redraw + 1)
            redraw++
          })
        } else if (input_account_type.value == 'administrator') {
          instance.post('/loginAdministrator', data).then((response) => {
            //currentPage = <AdministratorListProjects />
            //forceRedraw(redraw + 1)
            //redraw++
          })
        } else {
          //instance.post('/loginSupporter', data).then((response) => {
            //currentPage = <SupporterListProjects />
            //forceRedraw(redraw + 1)
            //redraw++
          //})
        }
      }
    }

    return (
      <div className="Login">
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




  function DesignerListProjects(designer_email_param) {
    let msg = {}
    msg["email"] = designer_email_param
    let dataValue = JSON.stringify(msg)
    let data = { 'body' : dataValue }

    let entries = []

    instance.post('/designerList', data).then((response) => {
      let projects = response.data.projects

      if (projects != null) {
        for (let project of projects) {
          let entry = (
            <div id="project_box">
              <label onClick={handle_button_view(project.name)}>{project.name}</label><br/>
              <label >Description: {project.description}</label><br/>
              <label >Type: {project.type}</label><br/>
              <label >Goal: ${project.goal}</label><br/>
              <label >Deadline: {project.deadline}</label><br/>
            </div>
          )
          entries.push(entry)
        }
      }
    })

    function handle_button_view(project_name_param) {
      currentPage = DesignerViewProject(project_name_param)
      forceRedraw(redraw + 1)
      redraw++
    }

    function handle_button_create() {
      currentPage = DesignerCreateProject()
      forceRedraw(redraw + 1)
      redraw++
    }

    return (
      <div className="DesignerListProjects">
        <label>Designer List Projects</label><br/>
        <label>{designer_email_param}</label><br/>
        <label>{entries}</label><br/>
        <button onClick={handle_button_create}>Create New Project</button><br/>
      </div>
    )
  }




  function DesignerCreateProject() {
    let input_name = initRef
    let input_description = initRef
    let input_goal = initRef
    let input_deadline = initRef

    function handle_button_create() {
      if (input_name.current.value == null || input_goal.current.value <= 0 || input_deadline.current.value == null) {
        alert("Fill out all required fields before creating a new project.")
      } else {
        let msg = {}
        msg["name"] = input_name.current.value
        msg["description"] = input_description.current.value
        msg["goal"] = input_goal.current.value
        msg["deadline"] = input_deadline.current.value
        let dataValue = JSON.stringify(msg)
        let data = { 'body' : dataValue }

        instance.post('/createProject', data).then((response) => {
          currentPage = DesignerViewProject(msg["name"])
          forceRedraw(redraw + 1)
          redraw++
        })
      }
    }

    return (
      <div className="DesignerCreateProject">
        <label>CREATE A NEW PROJECT</label><br/>
        <label>Project Name:<input name="project_name" type="text" ref={input_name}/></label><br/>
        <label>Description (optional):<input name="project_description" type="text" ref={input_description}/></label><br/>
        <label>Goal: $<input name="project_goal" type="number" ref={input_goal} min="1" default="1"/></label><br/>
        <label>Deadline:<input name="project_deadline" type="date" ref={input_deadline}/></label><br/>
        <button onClick={handle_button_create}>Create Project</button>
      </div>
    )
  }




  function DesignerViewProject(project_name_param) {
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

    var name, story, designerEmail, type, goal, deadline, activePledges, directSupports, successful, launched

    let msg = {}
    msg["name"] = project_name_param
    let dataValue = JSON.stringify(msg)
    let data = { 'body' : dataValue }

    instance.post('/designerViewProject', data).then((response) => {
      name = response.data.name
      story = response.data.story
      designerEmail = response.data.designerEmail
      type = response.data.type
      goal = response.data.goal
      deadline = response.data.deadline
      activePledges = response.data.activePledges
      directSupports = response.data.directSupports
      successful = response.data.successful
      launched = response.data.launched
    })

    // TODO figure out how to iterate over active pledges
    let entries = []
    if (activePledges != null) {
      for (let pledge of activePledges) {
        let entry = (
          <div id="pledge_box" style={pledge_box}>
            <label style={pledge_name}>{pledge.name}</label>
            <label style={pledge_amount}>{pledge.amount}</label>
            <label style={pledge_description}>{pledge.description}</label>
          </div>
        )
        entries.push(entry)
      }
    }

    return (
      <div className="DesignerViewProject">
        <div id="info_box" style={info_box}>
          <label style={project_name}>{name}</label>
          <div id="deadline_box" style={deadline_box}>
            <label style={deadline_label}>Project Deadline: {deadline}</label>
            <label style={days_label}>__ DAYS LEFT</label>
          </div>
          <div id="goal_box" style={goal_box}>
            <label style={goal_label}>Project Goal: ${goal}</label>
            <label style={raised_label}>$__ RAISED</label>
          </div>
          <div id="description_box" style={description_box}>
            <label style={description_label}>{story}</label>
          </div>
          <label style={designer_label}><i>By: {designerEmail}</i></label>
        </div>

        <div id="active_pledges_box" style={active_pledges_box}>
          <label style={active_label}>Active Pledges</label>
          <div id="pledges">{entries}</div>
        </div>
      </div>
    );
  }

  return (
    <div>{currentPage}</div>
  );
}

export default App;
