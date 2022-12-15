import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

const instance = axios.create({ baseURL: 'https://icki0h6bb0.execute-api.us-east-1.amazonaws.com/Prod/' });

function App() {
  let [redraw, forceRedraw] = React.useState(0)
  let [current_page, setCurrentPage] = React.useState(<Login/>)
  let [current_name, setCurrentName] = React.useState("Login")
  let [current_funds, setCurrentFunds] = React.useState(0)
  let [current_project, setCurrentProject] = React.useState(null)
  let [current_user, setCurrentUser] = React.useState(null)
  let [current_type, setCurrentType] = React.useState("")

  React.useEffect (() => {
    if (current_name === "SupporterListProjects") setCurrentPage(<SupporterListProjects/>)
    else if (current_name === "SupporterViewProject") setCurrentPage(<SupporterViewProject/>)
    else if (current_name === "DesignerListProjects") setCurrentPage(<DesignerListProjects/>)
    else if (current_name === "DesignerViewProject") setCurrentPage(<DesignerViewProject/>)
    else if (current_name === "DesignerEditProject") setCurrentPage(<DesignerEditProject/>)
    else if (current_name === "DesignerCreateProject") setCurrentPage(<DesignerCreateProject/>)
    else if (current_name === "DesignerCreatePledge") setCurrentPage(<DesignerCreatePledge/>)
    else if (current_name === "AdministratorListProjects") setCurrentPage(<AdministratorListProjects/>)
    else if (current_name === "AdministratorViewProject") setCurrentPage(<AdministratorViewProject/>)
  }, [redraw, current_name])

  function Header() {
    const header_user = { position: "absolute", left: 20, top: 28 }
    const header_title = { position: "absolute", fontWeight: "bold", fontSize: 24, left: "50%", textAlign: "center", marginLeft: -200, width: 400, top: 14 }
    const header_box = { position: "absolute", background: "thistle", width: "100%", height: 10, top: 60 }
    const header_label = { position: "absolute", left: 250, top: 8 }
    const header_button = {position: "absolute", right: 20, top: 28 }
    const header_label2 = { position: "absolute", top: 28, left: 250 }
    const header_input = { position: "absolute", top: 29, left: 344, width: 50 }
    const header_button2 = { position: "absolute", top: 29, left: 406 }
    const header_type = { position: "absolute", left: 20, top: 8 }

    let back_button = (<div/>), funds_label = (<div/>), funds_label2 = (<div/>), funds_input = (<div/>), funds_button = (<div/>)
    let [funds_input_val, setFundsInput] = useState("")

    if (current_name === "DesignerViewProject" || current_name === "DesignerCreateProject") back_button = (<button style={header_button} onClick={back_designer_list}>Back to List</button>)
    else if (current_name === "DesignerEditProject") back_button = (<button style={header_button} onClick={back_designer_view}>Back to View</button>)
    else if (current_name === "DesignerCreatePledge") back_button = (<button style={header_button} onClick={back_designer_edit}>Back to Edit</button>)      
    else if (current_name === "SupporterViewProject") back_button = (<button style={header_button} onClick={back_supporter_list}>Back to List</button>)
    else if (current_name === "AdministratorViewProject") back_button = (<button style={header_button} onClick={back_administrator_list}>Back to List</button>)

    if (current_name === "SupporterListProjects" || current_name === "SupporterViewProject") {
      funds_label = (<label style={header_label}>Available Funds: ${current_funds}</label>)
      funds_label2 = (<label style={header_label2}>Add Funds: $</label>)
      funds_input = (<input style={header_input} name="funds" type="number" value={funds_input_val} onChange={e => setFundsInput(e.target.value)} min="1" />)
      funds_button = (<button style={header_button2} onClick={() => setFunds(funds_input_val)}>+</button>)
    }

    function setFunds(param_add) {
      if (param_add === "" || parseInt(param_add) <= 0) alert("Please enter a valid amount to add to your current funds.")
      else {
        let msg = {}
        msg["supporterEmail"] = current_user
        msg["additionalFunds"] = parseInt(param_add)
        let data = { 'body': JSON.stringify(msg) }
        
        instance.post('/addFunds', data).then((response) => {
          setCurrentFunds(response.data.availableFunds)
          forceRedraw(redraw + 1)
        })
      }
    }

    function back_designer_list() {
      setCurrentProject(null)
      setCurrentName("DesignerListProjects")
      forceRedraw(redraw + 1)
    }

    function back_designer_view() {
      setCurrentName("DesignerViewProject")
      forceRedraw(redraw + 1)
    }

    function back_designer_edit() {
      setCurrentName("DesignerEditProject")
      forceRedraw(redraw + 1)
    }

    function back_supporter_list() {
      setCurrentProject(null)
      setCurrentName("SupporterListProjects")
      forceRedraw(redraw + 1)
    }

    function back_administrator_list() {
      setCurrentProject(null)
      setCurrentName("AdministratorListProjects")
      forceRedraw(redraw + 1)
    }

    return (
      <div>
        <label style={header_user}>{current_user}</label>
        <label style={header_type}>{current_type}</label>
        <label style={header_title}>CROWDSOURCING APP</label>
        {funds_label} {funds_label2} {funds_input} {back_button} {funds_button}
        <div style={header_box}/>
      </div>
    )
  }

  function Login() {
    const login_box = { position: "absolute", width: 400, height: 290, background: "thistle", textAlign: "center", top: "50%", left: "50%", marginLeft: -200, marginTop: -130 }
    const login_title = { position: "absolute", fontSize: "30pt", fontWeight: "bold", width: 400, top: 20, left: 0, textAlign: "center" }
    const login_email_label = { position: "absolute", fontWeight: "bold", top: 100, left: 20, textAlign: "center" }
    const login_email_input = { position: "absolute", width: 220, background: "white", top: 100, left: 150, textAlign: "left" }
    const login_type_label = { position: "absolute", fontWeight: "bold", top: 140, left: 20, textAlign: "center" }
    const login_type_radio = { position: "absolute", width: 220, top: 140, left: 150, textAlign: "left" }
    const login_button = { position: "relative", fontSize: "16pt", top: 230, width: 200 }

    let [input_email, setEmail] = useState("")
    let input_account_type = ""

    function handle_button_login() {
      if (document.querySelector('input[name="account_type"]:checked') !== "") input_account_type = document.querySelector('input[name="account_type"]:checked')

      if (input_email === "" || input_account_type.value === "") alert("Fill out all fields before logging in or registering.")
      else {
        let msg = {}
        msg["email"] = input_email
        msg["password"] = "mom"
        let data = { 'body': JSON.stringify(msg) }

        if (input_account_type.value === 'designer') {
          instance.post('/loginDesigner', data).then((response) => {
            setCurrentUser(input_email)
            setCurrentType("DESIGNER")
            setCurrentName("DesignerListProjects")
            forceRedraw(redraw + 1)
          })
        } else if (input_account_type.value === 'administrator') {
          instance.post('/loginAdministrator', data).then((response) => {
            setCurrentUser(input_email)
            setCurrentType("ADMINISTRATOR")
            setCurrentName("AdministratorListProjects")
            forceRedraw(redraw + 1)
          })
        } else {
          instance.post('/loginSupporter', data).then((response) => {
            setCurrentUser(input_email)
            setCurrentType("SUPPORTER")
            setCurrentFunds(response.data.availableFunds)
            setCurrentName("SupporterListProjects")
            forceRedraw(redraw + 1)
          })
        }
      }
    }

    return (
      <div className="Login">
        <div style={login_box}>
          <label style={login_title}>LOG IN</label>

          <label style={login_email_label}>email address:</label>
          <input type="text" value={input_email} onChange={e => setEmail(e.target.value)} style={login_email_input}></input>

          <label style={login_type_label}>account type:</label>
          <div style={login_type_radio}>
            <div><label><input type="radio" id="supporter" name="account_type" value="supporter"></input>supporter</label></div>
            <div><label><input type="radio" id="designer" name="account_type" value="designer"></input>designer</label></div>
            <div><label><input type="radio" id="administrator" name="account_type" value="administrator"></input>administrator</label></div>
          </div>

          <button style={login_button} onClick={handle_button_login}>Login or Register</button>
        </div>
      </div>
    );
  }

  function SupporterListProjects() {
    const search_bar = { position: "absolute", width: 300, left: 60, top: 120 }
    const search_label = { position: "absolute", left: 410, top: 120 }
    const type_button = { position: "absolute", left: 490, top: 120 }
    const description_button = { position: "absolute", left: 540, top: 120 }

    const projects_box = { position: "absolute", background: "thistle", width: 800, height: 607, overflowY: "scroll", top: 150, left: 50 }
    const project_button = { width: 760, textAlign: "left", margin: 10, marginBottom: 0 }
    const project_name = { fontSize: "18pt", fontWeight: "bold" }

    const activity_label = { position: "absolute", fontSize: "20pt", fontWeight: "bold", top: 110, left: 925 }
    const activity_box_1 = { position: "absolute", width: 260, height: 605, background: "thistle", textAlign: "center", top: 150, left: 900, display: "inline-block", overflowY: "scroll" }
    const activity_box_2 = { position: "absolute", width: 260, height: 605, background: "thistle", textAlign: "center", top: 150, left: 1172, display: "inline-block", overflowY: "scroll" }
    const activity_box = { width: 212, background: "white", margin: 10, marginBottom: 0, padding: 5, paddingTop: 2 }

    let msg = {}
    msg["type"] = ""
    msg["keyWord"] = ""
    let data = { 'body': JSON.stringify(msg) }

    let [entries, setEntries] = React.useState(undefined)
    let [entries2, setEntries2] = React.useState(undefined)
    let [entries3, setEntries3] = React.useState(undefined)
    let [retrieving, setRetrieving] = React.useState(false)
    let [input_search, setSearch] = useState("")

    function retrieve() {
      if (retrieving) return
      setRetrieving(true)

      instance.post('/searchProject', data).then((response) => {
        if (response !== null) {
          let allProjects = response.data.result
          if (allProjects !== undefined) {
            let inner = []
            for (let i = 0; i < allProjects.length; i++) {
              let project = allProjects[i]
              if (project.successful === null) {
                const entry = (
                  <div id="project_box">
                    <button style={project_button} onClick={() => handle_button_view(project.name)}>
                      <label style={project_name}>{project.name}</label><br/>
                      <label><span style={{fontWeight: "bold"}}>Description: </span>{project.description}</label><br/>
                      <label><span style={{fontWeight: "bold"}}>Deadline: </span>{project.deadline}</label><br/>
                      <label><span style={{fontWeight: "bold"}}>Type: </span>{project.type}</label><br/>
                      <label><span style={{fontWeight: "bold"}}>Goal: </span>${project.goal}</label><br/>
                    </button>
                  </div>
                )
                inner.push(entry)
              }
            }
            inner.push(<div style={{height: 10}}/>)
            setEntries(inner)
          }
        }
      })

      let msg2 = {}
      msg2["name"] = current_user
      let data2 = { 'body': JSON.stringify(msg2) }

      instance.post('/supporterViewActivity', data2).then((response) => {
        if (response != null) {
          let inner2 = [], inner3 = [], pledges = response.data.pledges, supports = response.data.directSupport
          for (let i = 0; i < supports.length; i++) {
            const entry = ( 
              <div id="support_box" style={activity_box}>
                <label style={{fontWeight: "bold", fontSize: "20pt"}}>${supports[i].amount}</label><br/>
                <label style={{fontWeight: "bold"}}>Project: {supports[i].projectName}</label>
              </div>
            )
            inner2.push(entry)
          }
          inner2.push(<div style={{height: 10}}/>)
          setEntries2(inner2)

          for (let i = 0; i < pledges.length; i++) {
            const entry = ( 
              <div id="pledge_box" style={activity_box}>
                <label style={{fontWeight: "bold", fontSize: "20pt"}}>${pledges[i].amount}</label><br/>
                <label style={{fontWeight: "bold"}}>Project: {pledges[i].project}</label><br/>
                <label>{pledges[i].description}</label>
              </div>
            )
            inner3.push(entry)
          }
          inner3.push(<div style={{height: 10}}/>)
          setEntries3(inner3)
          setRetrieving(false)
        }
      })
    }

    function handle_button_view(project_name_param) {
      setCurrentProject(project_name_param)
      setCurrentName("SupporterViewProject")
      forceRedraw(redraw + 1)
    }

    function handle_button_type() {
      msg = {}
      msg["type"] = input_search
      msg["keyWord"] = ""
      data = { 'body': JSON.stringify(msg) }
      setEntries(undefined)
      retrieve()
      return
    }

    function handle_button_description() {
      msg = {}
      msg["type"] = ""
      msg["keyWord"] = input_search
      data = { 'body': JSON.stringify(msg) }
      setEntries(undefined)
      retrieve()
      return
    }

    if (entries === undefined || entries2 === undefined || entries3 === undefined) {
      retrieve()
      return
    }

    return (
      <div id="SupporterListProjects" className="SupporterListProjects">
        <div>
          <input style={search_bar} name="project_search" type="text" value={input_search} onChange={e => setSearch(e.target.value)} placeholder="search projects" />
          <label style={search_label}>Search By:</label>
          <button style={type_button} onClick={handle_button_type}>Type</button>
          <button style={description_button} onClick={handle_button_description}>Description</button>
        </div>

        <div style={projects_box}>{entries}</div>

        <label style={activity_label}>Pledge Activity&emsp;&emsp;&emsp;&nbsp;Direct Support</label>
        <div style={activity_box_1}>{entries3}</div>
        <div style={activity_box_2}>{entries2}</div>
      </div>
    )
  }

  function SupporterViewProject() {
    const info_box = { position: "absolute", width: 800, height: 635, background: "thistle", textAlign: "center", top: 120, left: 50, display: "inline-block" }
    const project_name = { position: "relative", fontSize: "30pt", fontWeight: "bold", top: 20 }
    const deadline_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 100, left: 20 }
    const deadline_label = { position: "absolute", width: 370, fontSize: "12pt", top: 10, left: 0 }
    const days_label = { position: "absolute", width: 370, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }

    const goal_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 100, right: 20 }
    const goal_label = { position: "absolute", width: 370, fontSize: "12pt", top: 10, left: 0 }
    const raised_label = { position: "absolute", width: 370, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }
    const type_label = { position: "absolute", fontSize: "14pt", fontWeight: "bold", top: 550, left: 20 } 

    const description_box = { position: "absolute", width: 760, height: 340, background: "white", outline: "1px solid black", textAlign: "center", top: 205, left: 20 }
    const description_label = { position: "absolute", width: 740, height: 320, textAlign: "left", top: 10, left: 10 }
    const designer_label = { position: "absolute", fontSize: "14pt", fontWeight: "bold", top: 550, right: 20 }

    const active_label = { position: "absolute", fontSize: "20pt", fontWeight: "bold", top: 110, left: 1070 }
    const active_pledges_box = { position: "absolute", width: 540, height: 540, background: "thistle", textAlign: "center", top: 150, left: 900, display: "inline-block", overflowY: "scroll" }
    const pledge_box = { position: "relative", width: 480, background: "white", outline: "1px solid black", textAlign: "left", left: 10, top: 10, padding: 10, marginBottom: 10 }
    const claim_button = { position: "absolute", right: 10, top: 10 }

    const direct_box = { position: "absolute", width: 540, height: 45, background: "thistle", textAlign: "center", top: 710, left: 900 }
    const direct_label = { position: "absolute", fontSize: "18pt", fontWeight: "bold", top: 5, left: 80 }
    const direct_input = { position: "absolute", width: 60, height: 22, top: 9, left: 295}
    const direct_button = { position: "absolute", top: 9, left: 380, fontSize: "14pt" }

    let msg = {}
    msg["name"] = current_project
    msg["supporterEmail"] = current_user
    let data = { 'body': JSON.stringify(msg) }

    let [entries, setEntries] = React.useState(undefined)
    let [pledges, setPledges] = React.useState(undefined)
    let [retrieving, setRetrieving] = React.useState(false)
    let [direct_input_val, setDirectInput] = useState("")

    function retrieve() {
      if (retrieving) return;
      setRetrieving(true)

      instance.post('/supporterViewProject', data).then((response) => {
        let temp = {}
        if (response !== null) {
          temp.name = response.data.name
          temp.story = response.data.story
          temp.designerEmail = response.data.designerEmail
          temp.type = response.data.type
          temp.goal = response.data.goal
          temp.deadline = response.data.deadline
          temp.successful = response.data.successful
          temp.activePledges = response.data.activePledges
          temp.directSupports = response.data.directSupports
          temp.amountRaised = response.data.amountRaised
        }
        setEntries(temp)
  
        if (temp.activePledges !== null) {
          let inner = []
          for (let i = 0; i < temp.activePledges.length; i++) {
            let pledge = temp.activePledges[i]
            let entry = (
              <div style={pledge_box}>
                <label style={{fontWeight: "bold"}}>Amount: ${pledge.amount}</label><br/>
                <label>{pledge.description}</label>
                { (pledge.pledgeCapacity !== 0) ? <button style={claim_button} onClick={() => claim_pledge(pledge.description, pledge.amount)}>Claim</button> : <br/> }
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
      if (parseInt(current_funds) < parseInt(param_amount)) alert("Not enough available funds to claim pledge.")
      else {
        let msg2 = {}
        msg2["projectName"] = current_project
        msg2["supporterEmail"] = current_user
        msg2["descriptionReward"] = param_description
        let data2 = { 'body': JSON.stringify(msg2) }

        instance.post('/claimPledge', data2).then((response) => {
          if (response.data.statusCode === 400) alert("You have already claimed this pledge and cannot claim it again.")
          else {
            setCurrentFunds(parseInt(current_funds) - parseInt(param_amount))
            forceRedraw(redraw + 1)
          }
        })
      }
    }

    function days_from_deadline() {
      let today = new Date(), deadline = new Date(entries.deadline)
      return Math.ceil((deadline - today) / (1000*60*60*24))
    }

    function direct_support(param_amount) {
      if (param_amount === "" || parseInt(param_amount) <= 0) alert("Please enter a valid amount to directly support this project.")
      else if (parseInt(param_amount) > parseInt(current_funds)) alert("Not enough available funds to directly support this amount.")
      else {
        let msg2 = {}
        msg2["projectName"] = current_project
        msg2["supporterEmail"] = current_user
        msg2["amount"] = parseInt(param_amount)
        let data2 = { 'body': JSON.stringify(msg2) }

        instance.post('/directSupport', data2).then((response) => {
          if (response.data.statusCode === 200) {
            setCurrentFunds(parseInt(response.data.supporterFunds))
            forceRedraw(redraw + 1)
          } else alert("Cannot directly fund a project more than once.")
        })
      }
    }

    if (entries === undefined || pledges === undefined) {
      retrieve()
      return
    }

    return (
      <div id="SupporterViewProject" className="SupporterViewProject">
        <div style={info_box}>
          <label style={project_name}>{entries.name}</label>

          <div style={deadline_box}>
            <label style={deadline_label}>Project Deadline: {entries.deadline}</label>
            <label style={days_label}>{days_from_deadline()} DAYS LEFT</label>
          </div>

          <div style={goal_box}>
            <label style={goal_label}>Project Goal: ${entries.goal}</label>
            <label style={raised_label}>${entries.amountRaised} RAISED</label>
          </div>

          <div style={description_box}>
            <label style={description_label}>{entries.story}</label>
          </div>

          <label style={type_label}><i>Project Type: {entries.type}</i></label>
          <label style={designer_label}><i>By: {entries.designerEmail}</i></label>
        </div>

        <label style={active_label}>Active Pledges</label>
        <div style={active_pledges_box}>{pledges}</div>

        <div style={direct_box}>
          <label style={direct_label}>Directly Support: $</label>
          <input name="money" type="number" value={direct_input_val} onChange={e => setDirectInput(e.target.value)} style={direct_input} min="1" />
          <button style={direct_button} onClick={() => direct_support(direct_input_val)}>Submit</button>
        </div>
      </div>
    );
  }

  function DesignerListProjects() {
    const page_label = { position: "absolute", fontSize: "30pt", fontWeight: "bold", textAlign: "center", width: 800, left: 20, top: 90 }
    const projects_box = { background: "thistle", position: "absolute", width: 800, height: 520, overflowY: "scroll", top: 150, left: 50 }
    const project_button = { width: 700, textAlign: "left", margin: 10, marginBottom: 0 }
    const create_button = { position: "absolute", fontSize: "40pt", paddingLeft: 16, paddingRight: 16, top: 690, left: 420 }
    const edit_button = { position: "relative", top: -10, width: 50 }

    const activity_label = { position: "absolute", fontSize: "20pt", fontWeight: "bold", top: 110, left: 925 }
    const activity_box_1 = { position: "absolute", width: 260, height: 605, background: "thistle", textAlign: "center", top: 150, left: 900, display: "inline-block", overflowY: "scroll" }
    const activity_box_2 = { position: "absolute", width: 260, height: 605, background: "thistle", textAlign: "center", top: 150, left: 1172, display: "inline-block", overflowY: "scroll" }
    const activity_box = { width: 212, background: "white", margin: 10, marginBottom: 0, padding: 5, paddingTop: 2 }

    let msg = {}
    msg["email"] = current_user
    let data = { 'body': JSON.stringify(msg) }

    let [entries, setEntries] = React.useState(undefined)
    let [entries2, setEntries2] = React.useState(undefined)
    let [entries3, setEntries3] = React.useState(undefined)
    let [retrieving, setRetrieving] = React.useState(false)

    function retrieve() {
      if (retrieving) return
      setRetrieving(true)

      instance.post('/designerList', data).then((response) => {
        if (response !== null) {
          let allProjects = response.data.result
          if (allProjects !== undefined) {
            let inner = []
            for (let i = 0; i < allProjects.length; i++) {
              let project = allProjects[i]
              const entry = (
                <div id="project_box">
                  <button style={project_button} onClick={() => handle_button_view(project.name)}>
                    <label style={{fontSize: "18pt", fontWeight: "bold"}}>{project.name}</label><br/>
                    <label><span style={{fontWeight: "bold"}}>Description: </span>{project.description}</label><br/>
                    <label><span style={{fontWeight: "bold"}}>Deadline: </span>{project.deadline}</label><br/>
                    <label><span style={{fontWeight: "bold"}}>Type: </span>{project.type}</label><br/>
                    <label><span style={{fontWeight: "bold"}}>Goal: </span>${project.goal}</label><br/>
                    <label><span style={{fontWeight: "bold"}}>Launched?: </span>{project.launched ? "Yes":"No"}</label><br/>
                    {project.successful != null ? <label><span style={{fontWeight: "bold"}}>Successful?: </span>{project.successful ? "Yes":"No"}</label> : <></> }
                  </button>
                  {project.launched ? <br/> : <button style={edit_button} onClick={() => handle_button_edit(project.name)}>Edit</button> }
                </div>
              )
              inner.push(entry)
            }
            inner.push(<div style={{height: 10}}/>)
            setEntries(inner)
          }
        }
      })

      let msg2 = {}
      msg2["email"] = current_user
      let data2 = { 'body': JSON.stringify(msg2) }

      instance.post('/designerViewActivity', data2).then((response) =>{
        if (response != null) {
          let inner2 = [], inner3 = [], pledges = response.data.pledges, supports = response.data.directSupports
          for (let i = 0; i < supports.length; i++) {
            const entry = ( 
              <div id="support_box" style={activity_box}>
                <label style={{fontWeight: "bold", fontSize: "20pt"}}>${supports[i].amount}</label><br/>
                <label style={{fontWeight: "bold"}}>Project: {supports[i].project}</label><br/>
                <label><i>{supports[i].email}</i></label>
              </div>
            )
            inner2.push(entry)
          }
          inner2.push(<div style={{height: 10}}/>)
          setEntries2(inner2)

          for (let i = 0; i < pledges.length; i++) {
            for (let j = 0; j < pledges[i].pledgers.length; j++) {
              const entry = ( 
                <div id="pledge_box" style={activity_box}>
                  <label style={{fontWeight: "bold", fontSize: "20pt"}}>${pledges[i].amount}</label><br/>
                  <label style={{fontWeight: "bold"}}>Project: {pledges[i].projectName}</label><br/>
                  <label>{pledges[i].pledgeName}</label><br/>
                  <label><i>{pledges[i].pledgers[j]}</i></label>
                </div>
              )
              inner3.push(entry)
            }
          }
          inner3.push(<div style={{height: 10}}/>)
          setEntries3(inner3)
          setRetrieving(false)
        }
      })
    }

    function handle_button_view(name_param) {
      setCurrentProject(name_param)
      setCurrentName("DesignerViewProject")
      forceRedraw(redraw + 1)
    }

    function handle_button_create() {
      setCurrentName("DesignerCreateProject")
      forceRedraw(redraw + 1)
    }

    function handle_button_edit(name_param) {
      setCurrentProject(name_param)
      setCurrentName("DesignerEditProject")
      forceRedraw(redraw + 1)
    }

    if (entries === undefined || entries2 === undefined || entries3 === undefined) {
      retrieve()
      return
    }

    return (
      <div id="DesignerListProjects" className="DesignerListProjects">
        <label style={page_label}>Your Projects</label>
        <div style={projects_box}>{entries}</div>
        <button style={create_button} onClick={handle_button_create}>+</button>

        <label style={activity_label}>Pledge Activity&emsp;&emsp;&emsp;&nbsp;Direct Support</label>
        <div style={activity_box_1}>{entries3}</div>
        <div style={activity_box_2}>{entries2}</div>
      </div>
    )
  }

  function DesignerCreateProject() {
    const info_box = { position: "absolute", width: 800, height: 550, background: "thistle", textAlign: "center", top: 120, left: 50, display: "inline-block" }
    const project_name = { position: "relative", fontSize: "30pt", fontWeight: "bold", textAlign: "center", top: 20 }

    const type_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 100, left: 20 }
    const type_label = { position: "absolute", fontWeight: "bold", width: 370, fontSize: "12pt", top: 30, left: 0}

    const goal_box = { position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 100, right: 20 }
    const goal_label = { position: "absolute", fontWeight: "bold", width: 370, fontSize: "12pt", top: 10, left: 0 }
    const deadline_label = { position: "absolute", fontWeight: "bold", width: 370, fontSize: "12pt", top: 50, left: 0 }

    const description_box = { position: "absolute", padding: 10, width: 738, height: 275, textAlign: "left", top: 205, left: 20 }
    const designer_label = { position: "absolute", fontSize: "14pt", fontWeight: "bold", top: 510, right: 20 }

    const create_button = { position: "absolute", fontSize: "20pt", top: 700, left: 400 }

    let [input_name, setName] = useState("")
    let [input_description, setDescription] = useState("")
    let [input_goal, setGoal] = useState(0)
    let [input_deadline, setDeadline] = useState("")
    let [input_type, setType] = useState("")

    function handle_button_create() {
      if (input_name === "" || input_goal <= 0 || input_deadline === "") alert("Fill out all required fields with valid data before creating a new project.")
      else {
        let msg = {}
        msg["name"] = input_name
        msg["story"] = input_description
        msg["designerEmail"] = current_user
        msg["type"] = input_type
        msg["goal"] = input_goal
        msg["deadline"] = input_deadline
        msg["successful"] = null
        msg["launched"] = 0
        let data = { 'body': JSON.stringify(msg) }

        instance.post('/createProject', data).then((response) => {
          if (response.data.statusCode === 400) alert("Cannot create a project with the same name as another project.")
          else {
            setCurrentProject(input_name)
            setCurrentName("DesignerEditProject")
            forceRedraw(redraw + 1)
          }
        })
      }
    }

    return (
      <div id="DesignerCreateProject" className="DesignerCreateProject">
        <div style={info_box}>
          <input style={project_name} type="text" value={input_name} onChange={e => setName(e.target.value)} placeholder="project name" />
          
          <div style={type_box}>
            <label style={type_label}>Project Type: <input name="project_type" type="text" value={input_type} onChange={e => setType(e.target.value)} style={{width: 150}} /></label>
          </div>
          
          <div style={goal_box}>
            <label style={goal_label}>Project Goal: $<input name="project_goal" type="number" value={input_goal} onChange={e => setGoal(e.target.value)} style={{width: 150}} min="1" /></label>
            <label style={deadline_label}>Project Deadline: <input name="project_deadline" type="date" value={input_deadline} onChange={e => setDeadline(e.target.value)} style={{width: 130}} /></label>
          </div>

          <textarea wrap="soft" type="text" value={input_description} onChange={e => setDescription(e.target.value)} placeholder="project description" style={description_box} />
          <label style={designer_label}><i>Designer: {current_user}</i></label>
        </div>

        <button style={create_button} onClick={handle_button_create}>Create</button>
      </div>
    )
  }

  function DesignerCreatePledge() {
    const create_box = { position: "absolute", width: 500, height: 290, background: "thistle", textAlign: "center", top: "50%", left: "50%", marginLeft: -250, marginTop: -130 }
    const create_title = { position: "absolute", fontSize: "30pt", fontWeight: "bold", width: 500, top: 20, left: 0, textAlign: "center" }

    const amount_label = { position: "absolute", fontWeight: "bold", top: 100, left: 42, textAlign: "center" }
    const amount_input = { position: "absolute", width: 100, background: "white", top: 100, left: 250, textAlign: "left" }

    const reward_label = { position: "absolute", fontWeight: "bold", top: 140, left: 42, textAlign: "center" }
    const reward_input = { position: "absolute", width: 200, background: "white", top: 140, left: 250, textAlign: "left" }

    const max_label = { position: "absolute", fontWeight: "bold", top: 180, left: 42, textAlign: "center" }
    const max_input = { position: "absolute", width: 100, background: "white", top: 180, left: 250, textAlign: "left" }

    const create_button = { position: "relative", fontSize: "16pt", top: 230, width: 200 }

    let [input_amount, setAmount] = useState(0)
    let [input_reward, setReward] = useState("")
    let [input_max, setMax] = useState(null)

    function handle_button_create() {
      if (parseInt(input_amount) <= 0 || input_reward === "" || (input_max !== "" && input_max !== null && parseInt(input_max) <= 0)) alert("Fill out all required fields with valid data before creating a new pledge.")
      else {
        let msg = {}
        msg["amount"] = parseInt(input_amount)
        msg["descriptionReward"] = input_reward
        msg["maxSupporters"] = (input_max === null || input_max === "") ? -1 : parseInt(input_max)
        msg["projectName"] = current_project
        let data = { 'body': JSON.stringify(msg) }

        instance.post('/createPledge', data).then((response) => {
          if (response.data.statusCode === 400) alert("Cannot create a pledge with the same description as another pledge.")
          else {
            setCurrentName("DesignerEditProject")
            forceRedraw(redraw + 1)
          }
        })
      }
    }

    return (
      <div id="DesignerCreatePledge" className="DesignerCreatePledge">
        <div style={create_box}>
          <label style={create_title}>Create a New Pledge</label>
          <label style={amount_label}>Amount:&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;$</label>
          <input style={amount_input} type="number" value={input_amount} onChange={e => setAmount(e.target.value)} min="1"/>
          <label style={reward_label}>Description of Reward:</label>
          <input style={reward_input} type="text" value={input_reward} onChange={e => setReward(e.target.value)} />
          <label style={max_label}>Max Supporters <span style={{fontWeight:"normal"}}>(optional)</span>:</label>
          <input style={max_input} type="number" value={input_max} onChange={e => setMax(e.target.value)} min="1" />
          <button style={create_button} onClick={handle_button_create}>Create Pledge</button>
        </div>
      </div>
    )
  }

  function DesignerEditProject() {
    const info_box = { position: "absolute", width: 800, height: 550, background: "thistle", textAlign: "center", top: 120, left: 50, display: "inline-block" }
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
    const all_pledges_box = { position: "absolute", width: 540, height: 520, background: "thistle", textAlign: "center", top: 150, left: 900, display: "inline-block", overflowY: "scroll" }
    const pledge_box = { position: "relative", width: 480, background: "white", outline: "1px solid black", textAlign: "left", left: 10, top: 10, padding: 10 }
    const pledge_amount = { fontWeight: "bold" }
    const pledge_delete_button = { position: "absolute", top: 10, right: 10 }
    const pledge_create_button = { position: "absolute", fontSize: "40pt", paddingLeft: 16, paddingRight: 16, top: 690, left: 1120 }

    let [input_description, setDescription] = useState("")
    let [input_goal, setGoal] = useState(0)
    let [input_deadline, setDeadline] = useState("")
    let [input_type, setType] = useState("")

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
        if (response !== null) {
          inner1.name = response.data.name
          inner1.story = response.data.story
          inner1.designerEmail = response.data.designerEmail
          inner1.type = response.data.type
          inner1.goal = response.data.goal
          inner1.deadline = response.data.deadline
          inner1.activePledges = response.data.activePledges

          setDescription(inner1.story)
          setGoal(inner1.goal)
          setDeadline(inner1.deadline)
          setType(inner1.type)
        }
        setEntries(inner1)

        if (inner1.activePledges !== null) {
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
      if (input_goal <= 0 || input_deadline === "") alert("Fill out all required fields with valid data before saving the project.")
      else {
        let msg = {}
        msg["name"] = entries.name
        msg["story"] = input_description
        msg["type"] = input_type
        msg["goal"] = input_goal
        msg["deadline"] = input_deadline
        let data = { 'body': JSON.stringify(msg) }

        instance.post('/editProject', data).then((response) => {
          setCurrentName("DesignerViewProject")
          forceRedraw(redraw + 1)
        })
      }
    }

    function handle_button_delete() {
      msg["name"] = entries.name
      let data = { 'body': JSON.stringify(msg) }

      instance.post('/designerDeleteProject', data).then((response) => {
        setCurrentProject(null)
        setCurrentName("DesignerListProjects")
        forceRedraw(redraw + 1)
      })
    }

    function handle_button_launch() {
      if (input_goal <= 0 || input_deadline === "") alert("Fill out all required fields with valid data before launching the project.")
      else {
        let msg = {}
        msg["name"] = entries.name
        let data = { 'body': JSON.stringify(msg) }

        instance.post('/launchProject', data).then((response) => {
          setCurrentProject(null)
          setCurrentName("DesignerListProjects")
          forceRedraw(redraw + 1)
        })
      }
    }

    function handle_button_create_pledge() {
      setCurrentName("DesignerCreatePledge")
      forceRedraw(redraw + 1)
    }

    function handle_button_delete_pledge(reward_param) {
      msg["descriptionReward"] = reward_param
      let data = { 'body': JSON.stringify(msg) }

      instance.post('/designerDeletePledge', data).then((response) => {
        setCurrentName("DesignerEditProject")
        forceRedraw(redraw + 1)
      })
    }

    if (entries === undefined) {
      retrieve()
      return
    }

    return (
      <div id="DesignerEditProject" className="DesignerEditProject">
        <div style={info_box}>
          <label style={project_name}>{entries.name}</label><br />
          
          <div style={type_box}><label style={type_label}>Project Type: <input type="text" value={input_type} onChange={e => setType(e.target.value)} style={{width: 150}} /></label></div>
          
          <div style={goal_box}>
            <label style={goal_label}>Project Goal: $<input type="number" value={input_goal} onChange={e => setGoal(e.target.value)} style={{width: 150}} min="1" /></label>
            <label style={deadline_label}>Project Deadline: <input type="date" value={input_deadline} onChange={e => setDeadline(e.target.value)} style={{width: 130}} /></label>
          </div>
          
          <textarea wrap="soft" type="text" value={input_description} onChange={e => setDescription(e.target.value)} style={description_box} />
          <label style={designer_label}><i>Designer: {entries.designerEmail}</i></label>
        </div>

        <button style={save_button} onClick={handle_button_save}>Save</button>
        <button style={launch_button} onClick={handle_button_launch}>Launch</button>
        <button style={delete_button} onClick={handle_button_delete}>Delete</button>

        <label style={all_pledges_label}>All Pledges</label>
        <button style={pledge_create_button} onClick={handle_button_create_pledge}>+</button>
        <div style={all_pledges_box}>{pledges}</div>
      </div>
    )
  }

  function DesignerViewProject() {
    const info_box = { position: "absolute", width: 800, height: 635, background: "thistle", textAlign: "center", top: 120, left: 50, display: "inline-block" }
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
    const type_label = { position: "absolute", fontSize: "14pt", fontWeight: "bold", top: 550, left: 20 } 
    
    const active_label = { position: "absolute", fontSize: "20pt", fontWeight: "bold", top: 110, left: 1070 }
    const active_pledges_box = { position: "absolute", width: 540, height: 605, background: "thistle", textAlign: "center", top: 150, left: 900, display: "inline-block", overflowY: "scroll" }
    const pledge_box = { position: "relative", width: 480, background: "white", outline: "1px solid black", textAlign: "left", left: 10, top: 10, padding: 10, marginBottom: 10 }
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
        if (response !== null) {
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
          inner1.amountRaised = response.data.amountRaised
        }
        setEntries(inner1)
  
        if (inner1.activePledges !== null) {
          let inner2 = []
          for (let i = 0; i < inner1.activePledges.length; i++) {
            let pledge = inner1.activePledges[i]
            let entry = (
              <div style={pledge_box}>
                <label style={pledge_amount}>Amount: ${pledge.amount}</label><br/>
                <label>{pledge.description}</label><br/>
                <label><b>Supporters:</b> {pledge.currentSupporters.join(", ")}</label>
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
      <div id="DesignerViewProject" className="DesignerViewProject">
        <div style={info_box}>
          <label style={project_name}>{entries.name}</label>

          <div style={deadline_box}>
            <label style={deadline_label}>Project Deadline: {entries.deadline}</label>
            <label style={days_label}>{days_from_deadline()} DAYS LEFT</label>
          </div>

          <div style={goal_box}>
            <label style={goal_label}>Project Goal: ${entries.goal}</label>
            <label style={raised_label}>${entries.amountRaised} RAISED</label>
          </div>

          <div style={description_box}>
            <label style={description_label}>{entries.story}</label>
          </div>

          <label style={type_label}><i>Project Type: {entries.type}</i></label>
          <label style={designer_label}><i>Designer: {entries.designerEmail}</i></label>
        </div>

        <label style={active_label}>Active Pledges</label>
        <div style={active_pledges_box}>{pledges}</div>
      </div>
    );
  }

  function AdministratorListProjects() {
    const page_label = { position: "absolute", fontSize: "30pt", fontWeight: "bold", textAlign: "center", width: 800, left: 20, top: 90 }
    const projects_box = { position: "absolute", background: "thistle", width: 800, height: 607, overflowY: "scroll", top: 150, left: 50 }
    const project_button = { width: 700, textAlign: "left", margin: 10, marginBottom: 0 }
    const delete_button = { position: "relative", top: -10, width: 55 }

    const activity_label = { position: "absolute", fontSize: "20pt", fontWeight: "bold", top: 110, left: 1092 }
    const activity_box = { position: "absolute", width: 540, height: 350, background: "thistle", textAlign: "center", top: 150, left: 900 }

    const activity_projects_box = { position: "absolute", width: 500, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 20, left: 20 }
    const activity_projects_label = { position: "absolute", width: 500, fontSize: "12pt", top: 10, left: 0 }
    const activity_projects_number = { position: "absolute", width: 500, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }

    const activity_funded_box = { position: "absolute", width: 500, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 130, right: 20 }
    const activity_funded_label = { position: "absolute", width: 500, fontSize: "12pt", top: 10, left: 0 }
    const activity_funded_number = { position: "absolute", width: 500, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }

    const activity_pledges_box = { position: "absolute", width: 500, height: 85, background: "white", outline: "1px solid black", textAlign: "center", top: 240, right: 20 }
    const activity_pledges_label = { position: "absolute", width: 500, fontSize: "12pt", top: 10, left: 0 }
    const activity_pledges_number = { position: "absolute", width: 500, fontSize: "20pt", fontWeight: "bold", top: 40, left: 0 }
    
    const reap_box = { position: "absolute", width: 540, height: 76, background: "thistle", textAlign: "center", top: 530, left: 900 }
    const reap_button = { position: "relative", fontSize: "20pt", fontWeight: "bold", top: 20 }

    let [entries, setEntries] = React.useState(undefined)
    let [retrieving, setRetrieving] = React.useState(false)
    let [total_projects, setProjects] = React.useState(0)
    let [total_funded, setFunded] = React.useState(0)
    let [total_pledges, setPledges] = React.useState(0)

    function retrieve() {
      if (retrieving) return
      setRetrieving(true)

      instance.post('/adminList').then((response) => {
        if (response !== null) {
          let allProjects = response.data.result
          setProjects(response.data.projectCount)
          setFunded(response.data.totalAmountRaised)
          setPledges(response.data.pledgeCount)
          if (allProjects !== undefined) {
            let inner = []
            for (let i = 0; i < allProjects.length; i++) {
              let project = allProjects[i]
              const entry = (
                <div id="project_box">
                  <button style={project_button} onClick={() => handle_button_view(project.name)}>
                    <label style={{fontSize: "18pt", fontWeight: "bold"}}>{project.name}</label><br/>
                    <label><span style={{fontWeight: "bold"}}>Description: </span>{project.description}</label><br/>
                    <label><span style={{fontWeight: "bold"}}>Deadline: </span>{project.deadline}</label><br/>
                    <label><span style={{fontWeight: "bold"}}>Type: </span>{project.type}</label><br/>
                    <label><span style={{fontWeight: "bold"}}>Goal: </span>${project.goal}</label><br/>
                    <label><span style={{fontWeight: "bold"}}>Designer: </span>{project.entrepreneur}</label><br/>
                    <label><span style={{fontWeight: "bold"}}>Launched?: </span>{project.launched ? "Yes":"No"}</label><br/>
                    {project.successful != null ? <label><span style={{fontWeight: "bold"}}>Successful?: </span>{project.successful ? "Yes":"No"}</label> : <></> }
                  </button>
                  <button style={delete_button} onClick={() => handle_button_delete(project.name)}>Delete</button>
                </div>
              )
              inner.push(entry)
            }
            inner.push(<div style={{height: 10}}/>)
            setEntries(inner)
            setRetrieving(false)
          }
        }
      })

      let msg2 = {}
      msg2["supporterEmail"] = current_user
      let data2 = { 'body': JSON.stringify(msg2) }

      instance.post('/supporterViewProject', data2).then((response) => {
        if (response != null) {
        }
        setRetrieving(false)
      })
    }

    function handle_button_view(name_param) {
      setCurrentProject(name_param)
      setCurrentName("AdministratorViewProject")
      forceRedraw(redraw + 1)
    }

    function handle_button_delete(name_param) {
      let msg = {}
      msg["name"] = name_param
      let data = { 'body': JSON.stringify(msg) }

      instance.post('/designerDeleteProject', data).then((response) => {
        setCurrentName("AdministratorListProjects")
        forceRedraw(redraw + 1)
      })
    }

    function handle_button_reap() {
      instance.get('/adminReap').then((response) => {
        forceRedraw(redraw + 1)
      })
    }

    if (entries === undefined) {
      retrieve()
      return
    }

    return (
      <div id="AdministratorListProjects" className="AdministratorListProjects">
        <label style={page_label}>All Projects</label>
        <div style={projects_box}>{entries}</div>

        <label style={activity_label}>Site Activity</label>
        <div style={activity_box}>
          <div style={activity_projects_box}>
            <label style={activity_projects_label}>TOTAL PROJECTS:</label>
            <label style={activity_projects_number}>{total_projects}</label>
          </div>

          <div style={activity_funded_box}>
            <label style={activity_funded_label}>TOTAL FUNDED:</label>
            <label style={activity_funded_number}>${total_funded}</label>
          </div>

          <div style={activity_pledges_box}>
            <label style={activity_pledges_label}>TOTAL PLEDGES:</label>
            <label style={activity_pledges_number}>{total_pledges}</label>
          </div>
        </div>

        <div style={reap_box}><button style={reap_button} onClick={handle_button_reap}>Reap Projects</button></div>
      </div>
    )
  }

  function AdministratorViewProject() {
    const info_box = { position: "absolute", width: 800, height: 635, background: "thistle", textAlign: "center", top: 120, left: 50, display: "inline-block" }
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
    const type_label = { position: "absolute", fontSize: "14pt", fontWeight: "bold", top: 550, left: 20 } 
    
    const active_label = { position: "absolute", fontSize: "20pt", fontWeight: "bold", top: 110, left: 1070 }
    const active_pledges_box = { position: "absolute", width: 540, height: 605, background: "thistle", textAlign: "center", top: 150, left: 900, display: "inline-block", overflowY: "scroll" }
    const pledge_box = { position: "relative", width: 480, background: "white", outline: "1px solid black", textAlign: "left", left: 10, top: 10, padding: 10, marginBottom: 10 }
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
        if (response !== null) {
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
          inner1.amountRaised = response.data.amountRaised
        }
        setEntries(inner1)
  
        if (inner1.activePledges !== null) {
          let inner2 = []
          for (let i = 0; i < inner1.activePledges.length; i++) {
            let pledge = inner1.activePledges[i]
            let entry = (
              <div style={pledge_box}>
                <label style={pledge_amount}>Amount: ${pledge.amount}</label><br/>
                <label>{pledge.description}</label><br/>
                <label><b>Supporters:</b> {pledge.currentSupporters.join(", ")}</label>
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
      <div id="AdministratorViewProject" className="AdministratorViewProject">
        <div style={info_box}>
          <label style={project_name}>{entries.name}</label>

          <div style={deadline_box}>
            <label style={deadline_label}>Project Deadline: {entries.deadline}</label>
            <label style={days_label}>{days_from_deadline()} DAYS LEFT</label>
          </div>

          <div style={goal_box}>
            <label style={goal_label}>Project Goal: ${entries.goal}</label>
            <label style={raised_label}>${entries.amountRaised} RAISED</label>
          </div>

          <div style={description_box}>
            <label style={description_label}>{entries.story}</label>
          </div>

          <label style={type_label}><i>Project Type: {entries.type}</i></label>
          <label style={designer_label}><i>Designer: {entries.designerEmail}</i></label>
        </div>

        <label style={active_label}>Active Pledges</label>
        <div style={active_pledges_box}>{pledges}</div>
      </div>
    );
  }

  return (
    <div>
      <Header/>
      {current_page}
    </div>
  );
}

export default App;
