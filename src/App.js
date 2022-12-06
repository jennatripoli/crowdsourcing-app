import './App.css';
import React, { useRef } from 'react';
import axios from 'axios';

var current_page, current_user, current_project, available_funds
const instance = axios.create({ baseURL: 'https://icki0h6bb0.execute-api.us-east-1.amazonaws.com/Prod/' });

function App() {
  let [redraw, forceRedraw] = React.useState(0)
  if (current_page == null) current_page = <Login />

  function Header() {
    const header_user = { position: "absolute", left: 20, top: 28 }
    const header_title = { position: "absolute", fontSize: 24, left: "50%", textAlign: "center", marginLeft: -200, width: 400, top: 20 }
    const header_box = { position: "absolute", background: "lightgrey", width: "100%", height: 10, top: 60 }
    const header_label = { position: "absolute", left: 20, top: 8 }
    const header_button = {position: "absolute", right: 20, top: 24 }
    let back_button = (<div/>), funds_label = (<div/>)

    if (current_page.type.name == "DesignerViewProject" || current_page.type.name == "DesignerCreateProject") {
      back_button = (<button onClick={() => back_designer_list()}>Back to List</button>)
    } else if (current_page.type.name == "DesignerEditProject") {
      back_button = (<button onClick={() => back_designer_view()}>Back to View</button>)
    } else if (current_page.type.name == "DesignerCreatePledge") {
      back_button = (<button onClick={() => back_designer_edit()}>Back to Edit</button>)      
    } else if (current_page.type.name == "SupporterViewProject") {
      back_button = (<button onClick={() => back_supporter_list()}>Back to List</button>)      
    }

    if (current_page.type.name == "SupporterListProjects" || current_page.type.name == "SupporterViewProject") {
      funds_label = (<label>Available Funds: ${available_funds}</label>)
    }

    function back_designer_list() {
      current_project = null
      current_page = <DesignerListProjects/>
      forceRedraw(redraw + 1)
      redraw++
    }

    function back_designer_view() {
      current_page = <DesignerViewProject/>
      forceRedraw(redraw + 1)
      redraw++
    }

    function back_designer_edit() {
      current_page = <DesignerEditProject/>
      forceRedraw(redraw + 1)
      redraw++
    }

    function back_supporter_list() {
      current_project= null
      current_page = <SupporterListProjects/>
      forceRedraw(redraw + 1)
      redraw++
    }

    return (
      <div>
        <label style={header_user}>{current_user}</label>
        <label style={header_title}>CROWDSOURCING APP</label>
        <div style={header_label}>{funds_label}</div>
        <div style={header_button}>{back_button}</div>
        <div style={header_box}/>
      </div>
    )
  }

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
      if (document.querySelector('input[name="account_type"]:checked') != null) input_account_type = document.querySelector('input[name="account_type"]:checked')

      if (input_email.current.value == null || input_password.current.value == null || input_account_type.value == null) {
        alert("Fill out all fields before logging in or registering.")
      } else {
        let msg = {}
        msg["email"] = input_email.current.value
        msg["password"] = input_password.current.value
        let data = { 'body': JSON.stringify(msg) }

        current_user = input_email.current.value

        if (input_account_type.value == 'designer') {
          instance.post('/loginDesigner', data).then((response) => {
            current_page = <DesignerListProjects />
            forceRedraw(redraw + 1)
            redraw++
          })
        } else if (input_account_type.value == 'administrator') {
          instance.post('/loginAdministrator', data).then((response) => {
            current_page = <AdministratorListProjects />
            forceRedraw(redraw + 1)
            redraw++
          })
        } else {
          instance.post('/loginSupporter', data).then((response) => {
            available_funds = response.availableFunds
            current_page = <SupporterListProjects />
            forceRedraw(redraw + 1)
            redraw++
          })
        }
      }
    }

    return (
      <div className="Login">
        <Header />
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

  function SupporterListProjects() {
    const search_bar = { position: "absolute", width: 300, left: 50, top: 120 }
    const sort_label = { position: "absolute", left: 408, top: 120 }
    const name_button = { position: "absolute", left: 470, top: 120 }
    const deadline_button = { position: "absolute", left: 530, top: 120 }
    const type_button = { position: "absolute", left: 608, top: 120 }

    const projects_box = { position: "absolute", background: "lightgrey", width: 800, height: 607, overflowY: "scroll", top: 150, left: 50 }
    const project_button = { width: 760, textAlign: "left", margin: 10, marginBottom: 0 }
    const project_name = { fontSize: "18pt", fontWeight: "bold" }

    const activity_label = { position: "absolute", fontSize: "20pt", fontWeight: "bold", top: 110, left: 1050 }
    const activity_box = { position: "absolute", width: 540, height: 605, background: "lightgrey", textAlign: "center", top: 150, left: 900, display: "inline-block", overflowY: "scroll" }

    let input_name = useRef(null)

    let msg = {}
    msg["type"] = ""
    let data = { 'body': JSON.stringify(msg) }

    let [entries, setEntries] = React.useState(undefined)
    let [retrieving, setRetrieving] = React.useState(false)

    function retrieve() {
      if (retrieving) return
      setRetrieving(true)

      instance.post('/searchProject', data).then((response) => {
        if (response != null) {
          let allProjects = response.data.result
          if (allProjects != undefined) {
            let inner = []
            for (let i = 0; i < allProjects.length; i++) {
              let project = allProjects[i]
              const entry = (
                <div id="project_box">
                  <button style={project_button} onClick={() => handle_button_view(project.name)}>
                    <label style={project_name}>{project.name}</label><br/>
                    <label>Description: {project.description}</label><br/>
                    <label>Deadline: {project.deadline}</label><br/>
                    <label>Type: {project.type}</label><br/>
                    <label>Goal: ${project.goal}</label><br/>
                  </button>
                </div>
              )
              inner.push(entry)
            }
            setEntries(inner)
            setRetrieving(false)
          }
        }
      })
    }

    function handle_button_view(project_name_param) {
      current_project = project_name_param
      current_page = <SupporterViewProject />
      forceRedraw(redraw + 1)
      redraw++
    }

    function handle_button_type() {
      msg = {}
      msg["type"] = input_name.current.value
      data = { 'body': JSON.stringify(msg) }
      setEntries(undefined)
      retrieve()
      return
    }

    if (entries === undefined) {
      retrieve()
      return
    }

    return (
      <div className="SupporterListProjects">
        <Header />
        <div>
          <input style={search_bar} name="project_name" type="text" ref={input_name} placeholder="search projects" />
          <label style={sort_label}>Sort By: </label>
          <button style={name_button}>Name</button>
          <button style={deadline_button}>Deadline</button>
          <button style={type_button} onClick={handle_button_type}>Type</button>
        </div>
        <div style={projects_box}>{entries}</div>

        <label style={activity_label}>Supporter Activity</label>
        <div id="active_pledges_box" style={activity_box}>
        </div>
      </div>
    )
  }

  function SupporterViewProject() {
    const info_box = { position: "absolute", width: 800, height: 635, background: "lightgrey", textAlign: "center", top: 120, left: 50, display: "inline-block" }
    const project_name = { position: "relative", fontSize: "30pt", fontWeight: "bold", top: 20 }
    const deadline_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 100, left: 20 }
    const deadline_label = { position: "absolute", width: 370, fontSize: "12pt", top: 10, left: 0 }
    const days_label = { position: "absolute", width: 370, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }

    const goal_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 100, right: 20 }
    const goal_label = { position: "absolute", width: 370, fontSize: "12pt", top: 10, left: 0 }
    const raised_label = { position: "absolute", width: 370, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }

    const description_box = { position: "absolute", width: 760, height: 340, background: "white", outline: "1px solid black", textAlign: "center", top: 205, left: 20 }
    const description_label = { position: "absolute", width: 740, height: 320, textAlign: "left", top: 10, left: 10 }
    const designer_label = { position: "absolute", fontSize: "14pt", fontWeight: "bold", top: 550, right: 20 }

    const active_label = { position: "absolute", fontSize: "20pt", fontWeight: "bold", top: 110, left: 1070 }
    const active_pledges_box = { position: "absolute", width: 540, height: 605, background: "lightgrey", textAlign: "center", top: 150, left: 900, display: "inline-block", overflowY: "scroll" }
    const pledge_box = { position: "relative", width: 480, background: "white", outline: "1px solid black", textAlign: "left", left: 10, top: 10, padding: 10 }
    const claim_button = { position: "absolute", right: 10, top: 10 }

    let msg = {}
    msg["name"] = current_project
    let data = { 'body': JSON.stringify(msg) }

    let [entries, setEntries] = React.useState(undefined)
    let [pledges, setPledges] = React.useState(undefined)
    let [retrieving, setRetrieving] = React.useState(false)

    function retrieve() {
      if (retrieving) return;
      setRetrieving(true)

      instance.post('/supporterViewProject', data).then((response) => {
        let temp = {}
        if (response != null) {
          temp.name = response.data.name
          temp.story = response.data.story
          temp.designerEmail = response.data.designerEmail
          temp.type = response.data.type
          temp.goal = response.data.goal
          temp.deadline = response.data.deadline
          temp.successful = response.data.successful
          temp.activePledges = response.data.activePledges
          temp.directSupports = response.data.directSupports
        }
        setEntries(temp)
  
        if (temp.activePledges != null) {
          let inner = []
          for (let i = 0; i < temp.activePledges.length; i++) {
            let pledge = temp.activePledges[i]
            let entry = (
              <div id="pledge_box" style={pledge_box}>
                <label style={{fontWeight: "bold"}}>Amount: ${pledge.amount}</label><br/>
                <label>{pledge.description}</label>
                <button style={claim_button} onClick={claim_pledge(pledge.description, pledge.amount)}>Claim</button>
                <label></label><br/>
              </div>
            )
            inner.push(entry)
          }
          setPledges(inner)
        }
        setRetrieving(false)
      })
    }

    function claim_pledge(param_description, param_amount) {
      if (available_funds < param_amount) alert("Not enough available funds to claim pledge.")
      else {
        let msg2 = {}
        msg2["projectName"] = current_project
        msg2["supporterEmail"] = current_user
        msg2["descriptionReward"] = param_description
        let data2 = { 'body': JSON.stringify(msg) }

        instance.post('/claimPledge', data).then((response) => {
          if (response.status == 400) alert("You have already claimed this pledge and cannot claim it again.")
          else available_funds = response.availableFunds
        })
      }
    }

    function days_from_deadline() {
      let today = new Date(), deadline = new Date(entries.deadline)
      return Math.ceil((deadline - today) / (1000*60*60*24))
    }

    if (entries === undefined || pledges === undefined) {
      retrieve()
      return
    }

    return (
      <div className="SupporterViewProject">
        <Header />
        <div id="info_box" style={info_box}>
          <label style={project_name}>{entries.name}</label>
          <div id="deadline_box" style={deadline_box}>
            <label style={deadline_label}>Project Deadline: {entries.deadline}</label>
            <label style={days_label}>{days_from_deadline()} DAYS LEFT</label>
          </div>
          <div id="goal_box" style={goal_box}>
            <label style={goal_label}>Project Goal: ${entries.goal}</label>
            <label style={raised_label}>$__ RAISED</label>
          </div>
          <div id="description_box" style={description_box}>
            <label style={description_label}>{entries.story}</label>
          </div>
          <label style={designer_label}><i>By: {entries.designerEmail}</i></label>
        </div>

        <label style={active_label}>Active Pledges</label>
        <div id="active_pledges_box" style={active_pledges_box}>
          <div id="pledges">{pledges}</div>
        </div>
      </div>
    );
  }

  function DesignerListProjects() {
    const page_label = { position: "absolute", fontSize: "30pt", fontWeight: "bold", textAlign: "center", width: 800, left: 20, top: 90 }
    const projects_box = { background: "lightgrey", position: "absolute", width: 800, height: 520, overflowY: "scroll", top: 150, left: 50 }
    const project_button = { width: 700, textAlign: "left", margin: 10, marginBottom: 0 }
    const create_button = { position: "absolute", fontSize: "40pt", paddingLeft: 16, paddingRight: 16, top: 690, left: 380 }
    const edit_button = { position: "relative", top: -10, width: 50 }

    const activity_label = { position: "absolute", fontSize: "20pt", fontWeight: "bold", top: 110, left: 1060 }
    const activity_box = { position: "absolute", width: 540, height: 605, background: "lightgrey", textAlign: "center", top: 150, left: 900, display: "inline-block", overflowY: "scroll" }

    let msg = {}
    msg["email"] = current_user
    let data = { 'body': JSON.stringify(msg) }

    let [entries, setEntries] = React.useState(undefined)
    let [retrieving, setRetrieving] = React.useState(false)

    function retrieve() {
      if (retrieving) return
      setRetrieving(true)

      instance.post('/designerList', data).then((response) => {
        if (response != null) {
          let allProjects = response.data.result
          if (allProjects != undefined) {
            let inner = []
            for (let i = 0; i < allProjects.length; i++) {
              let project = allProjects[i]
              const entry = (
                <div id="project_box">
                  <button style={project_button} onClick={() => handle_button_view(project.name)}>
                    <label style={{fontSize: "18pt", fontWeight: "bold"}}>{project.name}</label><br/>
                    <label>Description: {project.description}</label><br/>
                    <label>Deadline: {project.deadline}</label><br/>
                    <label>Type: {project.type}</label><br/>
                    <label>Goal: ${project.goal}</label><br/>
                    <label>Launched: {project.launched ? "Yes":"No"}</label><br/>
                  </button>
                  <button style={edit_button} onClick={() => handle_button_edit(project.name)}>Edit</button>
                </div>
              )
              inner.push(entry)
            }
            setEntries(inner)
            setRetrieving(false)
          }
        }
      })
    }

    function handle_button_view(name_param) {
      current_project = name_param
      current_page = <DesignerViewProject />
      forceRedraw(redraw + 1)
      redraw++
    }

    function handle_button_create() {
      current_page = <DesignerCreateProject />
      forceRedraw(redraw + 1)
      redraw++
    }

    function handle_button_edit(name_param) {
      current_project = name_param
      current_page = <DesignerEditProject />
      forceRedraw(redraw + 1)
      redraw++
    }

    if (entries === undefined) {
      retrieve()
      return
    }

    return (
      <div className="DesignerListProjects">
        <Header />
        <label style={page_label}>Your Projects</label>
        <div style={projects_box}>{entries}</div>
        <button style={create_button} onClick={handle_button_create}>+</button>

        <label style={activity_label}>Project Activity</label>
        <div id="active_pledges_box" style={activity_box}></div>
      </div>
    )
  }

  function DesignerCreateProject() {
    const info_box = { position: "absolute", width: 800, height: 550, background: "lightgrey", textAlign: "center", top: 120, left: 50, display: "inline-block" }
    const project_name = { position: "relative", fontSize: "30pt", fontWeight: "bold", textAlign: "center", top: 20 }
    const deadline_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 100, left: 20 }
    const deadline_label = { position: "absolute", fontWeight: "bold", width: 370, fontSize: "12pt", top: 30, left: 0 }
    const goal_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 100, right: 20 }
    const goal_label = { position: "absolute", fontWeight: "bold", width: 370, fontSize: "12pt", top: 30, left: 0 }
    const description_box = { position: "absolute", padding: 10, width: 738, height: 275, textAlign: "left", top: 205, left: 20 }
    const designer_label = { position: "absolute", fontSize: "14pt", fontWeight: "bold", top: 510, right: 20 }
    const create_button = { position: "absolute", fontSize: "20pt", top: 700, left: 200 }

    let input_name = useRef(null), input_description = useRef(null), input_goal = useRef(null), input_deadline = useRef(null), input_type = useRef(null)

    function handle_button_create() {
      if (input_name.current.value == null || input_goal.current.value <= 0 || input_deadline.current.value == null) {
        alert("Fill out all required fields before creating a new project.")
      } else {
        let msg = {}
        msg["name"] = input_name.current.value
        msg["story"] = input_description.current.value
        msg["designerEmail"] = current_user
        msg["type"] = input_type.current.value
        msg["goal"] = input_goal.current.value
        msg["deadline"] = input_deadline.current.value
        msg["successful"] = null
        msg["launched"] = 0
        let data = { 'body': JSON.stringify(msg) }

        instance.post('/createProject', data).then((response) => {
          current_project = input_name.current.value
          current_page = <DesignerViewProject />
          forceRedraw(redraw + 1)
          redraw++
        })
      }
    }

    return (
      <div className="DesignerCreateProject">
        <Header />
        <div style={info_box}>
          <input name="project_name" style={project_name} type="text" ref={input_name} placeholder="project name" />
          <div style={deadline_box}><label style={deadline_label}>Project Deadline: <input name="project_deadline" type="date" style={{width: 100}} ref={input_deadline} /></label></div>
          <div style={goal_box}><label style={goal_label}>Project Goal: $<input name="project_goal" type="number" style={{width: 100}} ref={input_goal} min="1" /></label></div>
          <textarea wrap="soft" name="project_description" type="text" ref={input_description} style={description_box} placeholder="project description" />
          <label style={designer_label}><i>Designer: {current_user}</i></label>
        </div>

        <button style={create_button} onClick={handle_button_create}>Create</button>
      </div>
    )
  }

  function DesignerCreatePledge() {
    let input_amount = useRef(null)
    let input_reward = useRef(null)

    function handle_button_create() {
      if (input_amount.current.value == 0) {
        alert("Fill out all required fields before creating a new pledge.")
      } else {
        let msg = {}
        msg["amount"] = input_reward.current.value
        msg["descriptionReward"] = input_reward.current.value
        msg["maxSupporters"] = 1000
        msg["projectName"] = current_project
        let data = { 'body': JSON.stringify(msg) }

        instance.post('/createPledge', data).then((response) => {
          current_page = <DesignerViewProject />
          forceRedraw(redraw + 1)
          redraw++
        })
      }
    }

    return (
      <div className="DesignerCreatePledge">
        <Header />
        <br/><br/><br/><br/><br/><br/>
        <label>CREATE A NEW PLDEGE</label><br />
        <label>Description (optional):<input name="project_description" type="text" ref={input_reward} /></label><br />
        <label>Amount: $<input name="project_goal" type="number" ref={input_amount} min="1" default="1" /></label><br />
        <button onClick={handle_button_create}>Create Pledge</button>
      </div>
    )
  }

  function DesignerEditProject() {
    const info_box = { position: "absolute", width: 800, height: 550, background: "lightgrey", textAlign: "center", top: 120, left: 50, display: "inline-block" }
    const project_name = { position: "relative", fontSize: "30pt", fontWeight: "bold", top: 20 }

    const type_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 100, left: 20 }
    const type_label = { position: "absolute", fontWeight: "bold", width: 370, fontSize: "12pt", top: 30, left: 0}

    const goal_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 100, right: 20 }
    const goal_label = { position: "absolute", fontWeight: "bold", width: 370, fontSize: "12pt", top: 10, left: 0 }
    const deadline_label = { position: "absolute", fontWeight: "bold", width: 370, fontSize: "12pt", top: 50, left: 0 }

    const description_box = { position: "absolute", padding: 10, width: 738, height: 275, textAlign: "left", top: 205, left: 20 }
    const designer_label = { position: "absolute", fontSize: "14pt", fontWeight: "bold", top: 510, right: 20 }

    const launch_button = { position: "absolute", fontSize: "20pt", top: 700, left: 200 }
    const save_button = { position: "absolute", fontSize: "20pt", top: 700, left: 415 }
    const delete_button = { position: "absolute", fontSize: "20pt", top: 700, left: 600 }

    const all_pledges_label = { position: "absolute", fontSize: "20pt", fontWeight: "bold", top: 110, left: 1070 }
    const all_pledges_box = { position: "absolute", width: 540, height: 520, background: "lightgrey", textAlign: "center", top: 150, left: 900, display: "inline-block", overflowY: "scroll" }
    const pledge_box = { position: "relative", width: 480, background: "white", outline: "1px solid black", textAlign: "left", left: 10, top: 10, padding: 10 }
    const pledge_amount = { fontWeight: "bold" }
    const pledge_delete_button = { position: "absolute", top: 10, right: 10 }
    const pledge_create_button = { position: "absolute", fontSize: "40pt", paddingLeft: 16, paddingRight: 16, top: 690, left: 1120 }

    let input_description = useRef(null), input_goal = useRef(null), input_deadline = useRef(null), input_type = useRef(null)

    let msg = {}
    msg["name"] = current_project
    let data = { 'body': JSON.stringify(msg) }

    let [entries, setEntries] = React.useState(undefined)
    let [pledges, setPledges] = React.useState(undefined)
    let [retrieving, setRetrieving] = React.useState(false)

    function retrieve() {
      if (retrieving) return;
      setRetrieving(true)

      instance.post('/designerViewProject', data).then((response) => {
        let inner1 = {}
        if (response != null) {
          inner1.name = response.data.name
          inner1.story = response.data.story
          inner1.designerEmail = response.data.designerEmail
          inner1.type = response.data.type
          inner1.goal = response.data.goal
          inner1.deadline = response.data.deadline
          inner1.activePledges = response.data.activePledges
        }
        setEntries(inner1)

        if (inner1.activePledges != null) {
          let inner2 = []
          for (let i = 0; i < inner1.activePledges.length; i++) {
            let pledge = inner1.activePledges[i]
            let entry = (
              <div id="pledge_box" style={pledge_box}>
                <label style={pledge_amount}>Amount: ${pledge.amount}</label><br/>
                <label>{pledge.description}</label>
                <button style={pledge_delete_button} onClick={() => handle_button_delete_pledge(pledge.description)}>Delete</button>
                <label></label><br/>
              </div>
            )
            inner2.push(entry)
          }
          setPledges(inner2)
        }
        setRetrieving(false)
      })
    }

    function handle_button_save() {
      if (input_goal.current.value <= 0 || input_deadline.current.value == null) {
        alert("Fill out all required fields before saving the project.")
      } else {
        let msg = {}
        msg["name"] = entries.name
        msg["story"] = input_description.current.value
        msg["type"] = input_type.current.value
        msg["goal"] = input_goal.current.value
        msg["deadline"] = input_deadline.current.value
        let data = { 'body': JSON.stringify(msg) }

        instance.post('/editProject', data).then((response) => {
          current_page = <DesignerViewProject />
          forceRedraw(redraw + 1)
          redraw++
        })
      }
    }

    function handle_button_delete() {
      msg["name"] = entries.name
      let data = { 'body': JSON.stringify(msg) }

      instance.post('/designerDeleteProject', data).then((response) => {
        current_project = null
        current_page = <DesignerListProjects />
        forceRedraw(redraw + 1)
        redraw++
      })
    }

    function handle_button_launch() {
      if (input_goal.current.value <= 0 || input_deadline.current.value == null) {
        alert("Fill out all required fields before launching the project.")
      } else {
        let msg = {}
        msg["name"] = entries.name
        let data = { 'body': JSON.stringify(msg) }

        instance.post('/launchProject', data).then((response) => {
          current_project = null
          current_page = <DesignerListProjects />
          forceRedraw(redraw + 1)
          redraw++
        })
      }
    }

    function handle_button_create_pledge() {
      current_page = <DesignerCreatePledge />
      forceRedraw(redraw + 1)
      redraw++
    }

    function handle_button_delete_pledge(reward_param) {
      msg["descriptionReward"] = reward_param
      let data = { 'body': JSON.stringify(msg) }

      instance.post('/designerDeletePledge', data).then((response) => {
        current_page = <DesignerEditProject />
        forceRedraw(redraw + 1)
        redraw++
      })
    }

    if (entries === undefined) {
      retrieve()
      return
    }

    return (
      <div className="DesignerEditProject">
        <Header />
        <div style={info_box}>
          <label style={project_name}>{entries.name}</label><br />
          <div style={type_box}><label style={type_label}>Project Type: <input name="project_type" type="text" ref={input_type} style={{width: 150}} defaultValue={entries.type} /></label></div>
          <div style={goal_box}>
            <label style={goal_label}>Project Goal: $<input name="project_goal" type="number" ref={input_goal} style={{width: 150}} min="1" defaultValue={entries.goal} /></label>
            <label style={deadline_label}>Project Deadline: <input name="project_deadline" type="date" ref={input_deadline} style={{width: 130}} defaultValue={entries.deadline} /></label>
            </div>
          <textarea wrap="soft" name="project_description" type="text" ref={input_description} defaultValue={entries.name} style={description_box} />
          <label style={designer_label}><i>Designer: {entries.designerEmail}</i></label>
        </div>

        <button style={save_button} onClick={handle_button_save}>Save</button>
        <button style={launch_button} onClick={handle_button_launch}>Launch</button>
        <button style={delete_button} onClick={handle_button_delete}>Delete</button>

        <label style={all_pledges_label}>All Pledges</label>
        <button style={pledge_create_button} onClick={() => handle_button_create_pledge()}>+</button>
        <div style={all_pledges_box}>{pledges}</div>
      </div>
    )
  }

  function DesignerViewProject() {
    const info_box = { position: "absolute", width: 800, height: 635, background: "lightgrey", textAlign: "center", top: 120, left: 50, display: "inline-block" }
    const project_name = { position: "relative", fontSize: "30pt", fontWeight: "bold", top: 20 }
    const deadline_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 100, left: 20 }
    const deadline_label = { position: "absolute", width: 370, fontSize: "12pt", top: 10, left: 0 }
    const days_label = { position: "absolute", width: 370, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }

    const goal_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 100, right: 20 }
    const goal_label = { position: "absolute", width: 370, fontSize: "12pt", top: 10, left: 0 }
    const raised_label = { position: "absolute", width: 370, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }

    const description_box = { position: "absolute", width: 760, height: 340, background: "white", outline: "1px solid black", textAlign: "center", top: 205, left: 20 }
    const description_label = { position: "absolute", width: 740, height: 320, textAlign: "left", top: 10, left: 10 }
    const designer_label = { position: "absolute", fontSize: "14pt", fontWeight: "bold", top: 550, right: 20 }

    const active_label = { position: "absolute", fontSize: "20pt", fontWeight: "bold", top: 110, left: 1070 }
    const active_pledges_box = { position: "absolute", width: 540, height: 605, background: "lightgrey", textAlign: "center", top: 150, left: 900, display: "inline-block", overflowY: "scroll" }
    const pledge_box = { position: "relative", width: 480, background: "white", outline: "1px solid black", textAlign: "left", left: 10, top: 10, padding: 10 }
    const pledge_amount = { fontWeight: "bold" }

    let msg = {}
    msg["name"] = current_project
    let data = { 'body': JSON.stringify(msg) }

    let [entries, setEntries] = React.useState(undefined)
    let [pledges, setPledges] = React.useState(undefined)
    let [retrieving, setRetrieving] = React.useState(false)

    function retrieve() {
      if (retrieving) return;
      setRetrieving(true)

      instance.post('/designerViewProject', data).then((response) => {
        let inner1 = {}
        if (response != null) {
          inner1.name = response.data.name
          inner1.story = response.data.story
          inner1.designerEmail = response.data.designerEmail
          inner1.type = response.data.type
          inner1.goal = response.data.goal
          inner1.deadline = response.data.deadline
          inner1.successful = response.data.successful
          inner1.launched = response.data.launched
          inner1.activePledges = response.data.activePledges
          inner1.directSupports = response.data.directSupports
        }
        setEntries(inner1)
  
        if (inner1.activePledges != null) {
          let inner2 = []
          for (let i = 0; i < inner1.activePledges.length; i++) {
            let pledge = inner1.activePledges[i]
            let entry = (
              <div id="pledge_box" style={pledge_box}>
                <label style={pledge_amount}>Amount: ${pledge.amount}</label><br/>
                <label>{pledge.description}</label>
                <label></label><br/>
              </div>
            )
            inner2.push(entry)
          }
          setPledges(inner2)
        }
        setRetrieving(false)
      })
    }

    function days_from_deadline() {
      let today = new Date(), deadline = new Date(entries.deadline)
      return Math.ceil((deadline - today) / (1000*60*60*24))
    }

    if (entries === undefined || pledges === undefined) {
      retrieve()
      return
    }

    return (
      <div className="DesignerViewProject">
        <Header />
        <div id="info_box" style={info_box}>
          <label style={project_name}>{entries.name}</label>
          <div id="deadline_box" style={deadline_box}>
            <label style={deadline_label}>Project Deadline: {entries.deadline}</label>
            <label style={days_label}>{days_from_deadline()} DAYS LEFT</label>
          </div>
          <div id="goal_box" style={goal_box}>
            <label style={goal_label}>Project Goal: ${entries.goal}</label>
            <label style={raised_label}>$__ RAISED</label>
          </div>
          <div id="description_box" style={description_box}>
            <label style={description_label}>{entries.story}</label>
          </div>
          <label style={designer_label}><i>Designer: {entries.designerEmail}</i></label>
        </div>

        <label style={active_label}>Active Pledges</label>
        <div id="active_pledges_box" style={active_pledges_box}>
          <div id="pledges">{pledges}</div>
        </div>
      </div>
    );
  }

  function AdministratorListProjects() {
    const page_label = { position: "absolute", fontSize: "30pt", fontWeight: "bold", textAlign: "center", width: 800, left: 20, top: 90 }
    const projects_box = { position: "absolute", background: "lightgrey", width: 800, height: 607, overflowY: "scroll", top: 150, left: 50 }
    const project_button = { width: 700, textAlign: "left", margin: 10, marginBottom: 0 }
    const delete_button = { position: "relative", top: -10, width: 55 }

    const activity_label = { position: "absolute", fontSize: "20pt", fontWeight: "bold", top: 110, left: 1092 }
    const activity_box = { position: "absolute", width: 540, height: 605, background: "lightgrey", textAlign: "center", top: 150, left: 900 }

    const activity_projects_box = { position: "absolute", width: 500, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 20, left: 20 }
    const activity_projects_label = { position: "absolute", width: 500, fontSize: "12pt", top: 10, left: 0 }
    const activity_projects_number = { position: "absolute", width: 500, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }

    const activity_funded_box = { position: "absolute", width: 500, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 130, right: 20 }
    const activity_funded_label = { position: "absolute", width: 500, fontSize: "12pt", top: 10, left: 0 }
    const activity_funded_number = { position: "absolute", width: 500, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }

    const activity_pledges_box = { position: "absolute", width: 500, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 240, right: 20 }
    const activity_pledges_label = { position: "absolute", width: 500, fontSize: "12pt", top: 10, left: 0 }
    const activity_pledges_number = { position: "absolute", width: 500, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }
    
    let [entries, setEntries] = React.useState(undefined)
    let [retrieving, setRetrieving] = React.useState(false)

    function retrieve() {
      if (retrieving) return
      setRetrieving(true)

      instance.post('/adminList').then((response) => {
        console.log(response.data.result)
        if (response != null) {
          let allProjects = response.data.result
          if (allProjects != undefined) {
            let inner = []
            for (let i = 0; i < allProjects.length; i++) {
              let project = allProjects[i]
              const entry = (
                <div id="project_box">
                  <button style={project_button} onClick={() => handle_button_view(project.name)}>
                    <label style={{fontSize: "18pt", fontWeight: "bold"}}>{project.name}</label><br/>
                    <label>Description: {project.description}</label><br/>
                    <label>Deadline: {project.deadline}</label><br/>
                    <label>Type: {project.type}</label><br/>
                    <label>Goal: ${project.goal}</label><br/>
                    <label>Designer: {project.entrepreneur}</label><br/>
                    <label>Launched: {project.launched ? "Yes":"No"}</label>
                  </button>
                  <button style={delete_button} onClick={() => handle_button_delete(project.name)}>Delete</button>
                </div>
              )
              inner.push(entry)
            }
            setEntries(inner)
            setRetrieving(false)
          }
        }
      })
    }

    function handle_button_view(name_param) {
      current_project = name_param
      current_page = <DesignerViewProject />
      forceRedraw(redraw + 1)
      redraw++
    }

    function handle_button_delete(name_param) {
      let msg = {}
      msg["name"] = name_param
      let data = { 'body': JSON.stringify(msg) }

      instance.post('/designerDeleteProject', data).then((response) => {
        current_page = <AdministratorListProjects />
        forceRedraw(redraw + 1)
        redraw++
      })
    }

    if (entries === undefined) {
      retrieve()
      return
    }

    return (
      <div className="AdministratorListProjects">
        <Header />
        <label style={page_label}>All Projects</label>
        <div style={projects_box}>{entries}</div>

        <label style={activity_label}>Site Activity</label>
        <div style={activity_box}>
          <div style={activity_projects_box}>
            <label style={activity_projects_label}>TOTAL PROJECTS:</label>
            <label style={activity_projects_number}>{entries.length}</label>
          </div>
          <div style={activity_funded_box}>
            <label style={activity_funded_label}>TOTAL FUNDED:</label>
            <label style={activity_funded_number}>$___</label>
          </div>
          <div style={activity_pledges_box}>
            <label style={activity_pledges_label}>TOTAL PLEDGES:</label>
            <label style={activity_pledges_number}>___</label>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>{current_page}</div>
  );
}

export default App;
