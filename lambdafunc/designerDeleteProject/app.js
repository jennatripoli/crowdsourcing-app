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
    
    let DesignerDeleteProject = (info) => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM Project WHERE name=?", [info.name], (error, rows) => {
                    if (error) { return reject(error); }
                    console.log("DELETE:" + JSON.stringify(rows));
                    
                    if ((rows.affectedRows > 0)) {
                        return resolve(true);
                    } else {
                        return reject("project not found with name '" + info.name + "'");
                    }            
            });
        });
    }
    
    let DeleteAssociatedPledges = (info) => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM Pledge WHERE projectName=?", [info.name], (error, rows) => {
                if(error) { return reject(error); }
                
                if(rows){
                    return resolve(rows);
                } else {
                    return reject("no pledges for project with name "+info.name);
                }
            });
        });
    }
    
    let DeleteAssociatedPledgers = (info, descriptionReward) => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM Pledger WHERE descriptionReward=?", [descriptionReward], (error, rows) => {
                if(error) { return reject(error); }
                
                if(rows){
                    return resolve(rows);
                } else {
                    return reject("no pledges for project with name "+info.name);
                }
            });
        });
    }
    
    let getPledges = (info) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Pledge WHERE projectName=?", [info.name], (error, rows) => {
                if(error) { return reject(error); }
                
                if(rows){
                    console.log(JSON.stringify(rows))
                    return resolve(rows);
                } else {
                    return reject("no pledges for project with name "+info.name);
                }
            });
        });
    }
    
    
    try {
        
        // 1. Query RDS for the first constant value to see if it exists!
        //   1.1. If doesn't exist then ADD
        //   1.2  If it DOES exist, then I need to replace
        // ----> These have to be done asynchronously in series, and you wait for earlier 
        // ----> request to complete before beginning the next one
        //console.log("E1")
        let allPledges = await getPledges(info)
        for (let i=0; i<allPledges.length; i++){
            console.log("HERE")
            let thisDescription = allPledges[i].descriptionReward;
            let deletedPledger = await DeleteAssociatedPledgers(info, thisDescription)
        }
        // let deletedPledgers = await 

        let deletedPledges = await DeleteAssociatedPledges(info);
        let deletedProject = await DesignerDeleteProject(info);
        
        if(deletedProject){
            console.log("project was deleted");

            response.statusCode = 200;

            console.log("RESPONSE: " + JSON.stringify(response))
        } else {
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
