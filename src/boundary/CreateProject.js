import React from 'react';

const Create = () => {
    return (
        <div className="CreateProject">
        {/* 
          email address text box
          password text box
          account type user select
          login or create new account button
        */}

        <form onSubmit={this.handleCreate}>
            <label>
                Project Name:
                <input name="projectName" type="text" value={this.state.value} onChange={this.handleInputChange} />
            </label>
            <br />
            <label>
                Project Description:
                <input name="projectDesciptuon" type="text" value={this.state.value} onChange={this.handleInputChange} />
            </label>
            <br />
            <label>
                Goal: $
                <input name="projectGoal" type="number" value={this.state.value} onChange={this.handleInputChange} />
            </label>
            <br />
            <label>
                Deadline (MMDDYYYY):
                <input name="projectDeadline" maxLength={8} type="number" value={this.state.value} onChange={this.handleInputChange} />
            </label>
            <br />
            <label>
                Deadline (MMDDYYYY):
                <input name="projectDeadline" maxLength={8} type="number" value={this.state.value} onChange={this.handleInputChange} />
            </label>
            <input type="submit" value="Create Project" />
        </form>
            
      </div>
    );
  };
    
  export default Create;