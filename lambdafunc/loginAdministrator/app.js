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
    
    //RYAN
    let getAllProjects = () => {
    return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Project", (error, rows) => {
                    if (error) { return reject(error); }
                    if (rows) {
                        return resolve(rows);
                    } else {
                        return reject("there are no projects");
                    }
                });
            });

    };
    
    //MIKAELA
    let GetValidUser = (email) => {
    return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Admin WHERE email=?", [email], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length == 1)) {
                        return resolve(rows[0].email);
                    } else {
                        return reject("unable to locate user '" + email + "'");
                    }

                });
            });
    };


    try {
        // DATABASE STUFF HERE
        
        // receive a POST    
        // {“type” : “administrator”, “email” : “xxx@gmail.com”,  “password” : “xxx”} 
        // have to add database stuff here
        // return on 200 list of all projects ever
        
        // {“projects” : [{"name” : “project1”, “description” : “this project is”,  

        // “entrepreneur” : “xxx@gmail.com”, “type” : “film”, “goal” : 1000,  

        // “deadline” : “12-01-2022", “active-pledges” : [{...}, …]. “direct-supports” : [{...}, ...],  

        // “successful” : false, “launched” : false}, …]} 
        
        // const ret = await axios(url);
        
        //RYAN
        /* let projects = getAllProjects();
        //let list = [];
        
        for (let i = 0; i<projects.length; i++) {
            let project = projects[i];
            list[i] = {
                name: project.name,
                description: project.story,
                entrepreneur: project.designerEmail,
                type: project.type,
                goal: project.goal,
                deadline: project.deadline,
                successful: project.successful,
                launched: project.launched
            };
        };
        
        response.statusCode = 200;
        
        response.body  = JSON.stringify({
            list,
        });
        */
        
        //MIKAELA
        const arg1_value = await GetValidUser(info.arg1);
        
        // If either is NaN then there is an error
        response.statusCode = 200;
        let result = arg1_value;
        response.result = result.toString();

        
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
