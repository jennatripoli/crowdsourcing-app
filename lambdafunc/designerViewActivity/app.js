// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
const mysql = require('mysql');

var config = require('./config.json');

var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

function query(conx, sql, params) {
    return new Promise((resolve, reject) => {
        conx.query(sql, params, function(err, rows) {
            if (err) {
                // reject because there was an error
                reject(err);
            } else {
                // resolve because we have result(s) from the query. it may be an empty rowset or contain multiple values
                resolve(rows);
            }
        });
    });
}

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    
    context.callbackWaitsForEmptyEventLoop = false;

   // ready to go for CORS. To make this a completed HTTP response, you only need to add a statusCode and a body.
    let response = {
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*", // Allow from anywhere
            "Access-Control-Allow-Methods": "POST" // Allow POST request
        }
    }; // response


    let actual_event = event.body;
    let info = JSON.parse(actual_event);
    console.log("info:" + JSON.stringify(info)); //  info.arg1 and info.arg2
    
    let getDesignerProjects = (info) => {
    return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Project WHERE designerEmail=?", [info.email], (error, rows) => {
                    if (error) { return reject(error); }
                    if (rows) {
                        return resolve(rows);
                    } else {
                        return reject("there are no projects");
                    }
                });
            });

    };
    
        
    
    let getPledges = (name) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Pledge WHERE projectName=?", [name], (error, rows) => {
                if(error) { return reject(error); }
                
                if(rows){
                    return resolve(rows);
                } else {
                    return reject("no pledges for project with name "+ name);
                }
            });
        });
    };
    
    
    let getPledgers = (desciptionReward) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Pledger WHERE descriptionReward=?", [desciptionReward], (error, rows) => {
                    if (error) { return reject(error); }
                    if (rows) {
                        return resolve(rows);
                    } else {
                        return reject("pledgers not found with name '" + info.descriptionReward + "'");
                    }            
            });
        });
    };
    
    let getDirectSupport = (name) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM DirectSupport WHERE projectName=?", [name], (error, rows) => {
                    if (error) { return reject(error); }
                    if (rows) {
                        return resolve(rows);
                    } else {
                        return reject("pledgers not found with name '" + info.descriptionReward + "'");
                    }            
            });
        });
    };

    
    
    try {
        let projectList = [];
        let projects = await getDesignerProjects(info);
        let directSupportList = [];
        
        if(projects) {
            
            console.log("projects "+projects);
            
            for(let i = 0; i < projects.length; i++) {
                let project = projects[i];
                let activePledges = [];
                let pledges = await getPledges(project.name);
                
                //GETTING PLEDGES
                if(pledges){
                    console.log("pledges found");
                    
                    for (let j = 0; j < pledges.length; j++) {
                        let currentPledgers = [];
                        let pledge = pledges[j];
                        let pledgers = await getPledgers(pledge.descriptionReward);
                        
                        if (pledgers) {
                            for (let k = 0; k < pledgers.length; k ++) {
                                let pledger = pledgers[k];
                                currentPledgers.push(pledger.supporterEmail);
                            }
                        }
                        activePledges[j] = {
                            name: pledge.descriptionReward,
                            amount: pledge.amount,
                            pledgers: currentPledgers
                        };
                    }
                    //GETTING DIRECT SUPPORT
                    
                    let directSupports = await getDirectSupport(project.name);
                    
                    if(directSupports) {
                        for (let j = 0; j < directSupports.length; j++){
                            let directSupporter = directSupports[j];
                            directSupportList[j] = {
                              amount: directSupporter.amount,
                              email: directSupporter.email
                            };
                        }
                        
                    }
                    
                }
                //GETTING
                
                projectList[i] = {
                    name: project.name,
                    pledges: activePledges
                };
            };
        
            //TODO !!!!!!!!!!!!!
            response.statusCode = 200;
            response.pledges = projectList;
            response.directSupports = directSupportList;
        }
        else {
            response.statusCode = 400;
            response.error = "Couldn't find projects";
        }
        
        
        
    } catch (error) {
        console.log("ERROR: " + error);
        response.statusCode = 400;
        response.error = error;
    }

    return response
};
