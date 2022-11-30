import React from 'react';

const info_box = {
  position: "absolute", width: 800, height: 700, background: "lightgrey", textAlign: "center",
  top: 50, left: 50, display: "inline-block"
}
const project_name = {
  position: "relative", fontSize: "40pt", fontWeight: "bold",
  top: 40
}

const deadline_box = {
  position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center",
  top: 150, left: 20
}
const deadline_label = {
  position: "absolute", width: 370, fontSize: "12pt",
  top: 10, left: 0
}
const days_label = {
  position: "absolute", width: 370, fontSize: "20pt", fontWeight: "bold",
  top: 40, left: 0
}

const goal_box = {
  position: "absolute", width: 370, height: 85, background: "white", outline: "1px solid black", textAlign: "center",
  top: 150, right: 20
}
const goal_label = {
  position: "absolute", width: 370, fontSize: "12pt",
  top: 10, left: 0
}
const raised_label = {
  position: "absolute", width: 370, fontSize: "20pt", fontWeight: "bold",
  top: 40, left: 0
}

const description_box = {
  position: "absolute", width: 760, height: 340, background: "white", outline: "1px solid black", textAlign: "center",
  top: 255, left: 20
}
const description_label = {
  position: "absolute", width: 740, height: 320, textAlign: "left",
  top: 10, left: 10
}
const designer_label = {
  position: "absolute", fontSize: "14pt", fontWeight: "bold",
  bottom: 70, right: 20
}

const active_label = {
  position: "absolute", width: 540, fontSize: "20pt", fontWeight: "bold",
  top: -45, left: 0
}
const active_pledges_box = {
  position: "absolute", width: 540, height: 650, background: "lightgrey", textAlign: "center",
  top: 100, right: 50, display: "inline-block"
}

const pledge_box = {
  position: "relative", width: 500, height: 100, background: "white", outline: "1px solid black", textAlign: "left",
  left: 10, top: 10, padding: 10
}
const pledge_name = {
  position: "absolute", fontWeight: "bold"
}
const pledge_amount = {
  position: "absolute",
  top: 35
}
const pledge_description = {
  position: "absolute",
  top: 60
}

const DesignerViewProject = () => {

  /*let entries = ''
  for (let pledge of pledges) {
    let entry = (
      <div>
        <label></label>
      </div>
    )
    
    entries = entries + entry



    <div id="all">
          {entries}
        </div>
  }*/

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
  };
    
  export default DesignerViewProject;