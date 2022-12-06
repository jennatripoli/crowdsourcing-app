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
    
    
    
    let editProject = (info) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Project SET story=?, type=?, goal=?, deadline=? WHERE name=?", 
            [info.story, info.type, info.goal, info.deadline, info.name], (error, rows) => {
                    if (error) { return reject(error); }
                    console.log("INSERT:" + JSON.stringify(rows));
                    
                    if ((rows) && (rows.affectedRows === 1)) {
                        return resolve(true);
                    } else {
                        return reject("project name already taken for '" + info.name + "'");
                    }            
        });
    });
    }
    
    let returnProject = (info) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Project WHERE name=?", [info.name], (error, rows) => {
                    if (error) { return reject(error); }
                    console.log("INSERT:" + JSON.stringify(rows));
                    
                    if ((rows) && (rows.length === 1)) {
                        return resolve(rows[0]);
                    } else {
                        return reject("project name already taken for '" + info.name + "'");
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
        console.log("E1")
        const changed = await editProject(info);
        const editedProject = await returnProject(info)
        console.log("E2")
        let name = (info.name);
        let story = (info.story);
        let designerEmail = (editedProject.designerEmail);
        let type = (info.type);
        let goal = (info.goal);
        let deadline = (info.deadline);
        let successful = (editedProject.successful);
        let launched = (editedProject.launched)
        response.statusCode = 200;
        response.name = name.toString();
        response.story = story;
        response.designerEmail = designerEmail;
        response.type = type;
        response.goal = goal;
        response.deadline = deadline;
        response.successful = successful;
        response.launched = launched;
        
        
    } catch (error) {
        console.log("ERROR: " + error);
        response.statusCode = 400;
        response.error = error;
    }

    return response
};

