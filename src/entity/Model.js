export class Supporter {
    constructor(email, password, budget) {
        this.email = email
        this.password = password
        this.budget = budget
        this.pledges = []
        this.supports = []
    }
}

export class Administrator {
    constructor(email, password, allProjects) {
        this.email = email
        this.password = password
        this.allProjects = allProjects
    }
}

export class Designer {
    constructor(email, password, projects) {
        this.email = email
        this.password = password
        this.projects = projects
    }
}

export class Pledge {
    constructor(name, amount, description, maxSupporters) {
        this.name = name
        this.amount = amount
        this.description = description
        this.maxSupporters = maxSupporters
        this.supporters = []
        this.successful = null
    }
}

export class Support {
    constructor(amount, supporter) {
        this.amount = amount
        this.supporter = supporter
        this.successful = null
    }
}

export class Project {
    constructor(name, story, designer, type, goal, deadline) {
        this.name = name
        this.story = story
        this.designer = designer
        this.type = type
        this.goal = goal
        this.deadline = deadline
        this.activePledges = []
        this.directSupports = []
        this.successful = null
        this.launched = false
    }
}

export class Model {
    constructor() {
        this.currentUser = null
    }

    setCurrentUser(email, password, type){
        this.currentUser = new Designer(email, password)
        console.log("made it here")
    }
}