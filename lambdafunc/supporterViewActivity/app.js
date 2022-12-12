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
    
    let getPledgers = (info) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Pledger WHERE supporterEmail=?", [info.name], (error, rows) => {
                if(error) { return reject(error); }
                
                if(rows){
                    return resolve(rows);
                } else {
                    return reject("no pledges for supporter: '"+info.name+ "'");
                }
            });
        });
    }
    
    let getPledges = (pledger) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Pledge WHERE descriptionReward=?", [pledger.description], (error, rows) => {
                console.log("INPUT: " + pledger.description)
                if(error) { return reject(error); }
                
                if(rows){
                    console.log(resolve(rows))
                    return resolve(rows);
                } else {
                    return reject("no pledges for supporter: '"+info.name+ "'");
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
        // let foundProject = await SupporterViewProject(info);
        
        // if(foundProject){
            
            //GETTING PLEDGES HERE
            let pledgers = await getPledgers(info);
            let activePledgers = [];
            let activePledges = [];
            
            if(pledgers) {
                console.log("pledger info: " + JSON.stringify(pledgers));
                
                for (let i = 0; i < pledgers.length; i++) {
                    let pledger = pledgers[i];
                    activePledgers[i] = {
                        description:  pledger.descriptionReward,
                    };
                
                for (let i=0; i<activePledgers.length; i++){
                    let pledge = await getPledges(activePledgers[i])
                    // pledge = JSON.stringify(pledge)
                    console.log("PLEDGE: " +pledge.descriptionReward)
                    activePledges[i] = {
                        description:  pledge.descriptionReward,
                        amount: pledge.amount,
                        maxSupporters: pledge.maxSupporters
                    };
                }
                };
                response.statusCode = 200;
                response.pledges = activePledges;
            }else {
                response.error = "No pledges";
            }
            
            
            response.statusCode = 200;
            // response.pledges = activePledges;
            console.log("RESPONSE: " + JSON.stringify(response))
        
        
        
    } catch (error) {
        console.log("ERROR: " + error);
        response.statusCode = 400;
        response.error = error;
    }

    return response
};
