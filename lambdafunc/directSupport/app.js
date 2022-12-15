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
    
    let checkIfAlreadySupported = (info) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Supporter WHERE email=?", [info.supporterEmail], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length == 1)) {
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }            
            });
    });
    }
    
    let addDirectSupport = (info) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO DirectSupport (projectName, amount, supporterEmail) VALUES(?, ?, ?)", 
            [info.projectName, info.amount, info.supporterEmail], (error, rows) => {
                    if (error) { return reject(error); }
                    if (rows.affectedRows > 0) {
                        console.log("INSERT:" + JSON.stringify(rows));
                        return resolve(true);
                    } else {
                        return reject("direct support could not be added for project '" + info.projectName + "'");
                    }            
            });
        });
    }
    
    let getSupporterCurrentFunds = (info) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Supporter WHERE email=?", [info.supporterEmail], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length == 1)) {
                        console.log("AVAILABLE FUNDS:" + JSON.stringify(rows[0].availableFunds))
                        return resolve(rows[0].availableFunds);
                    } else {
                        return reject("supporter not found with email '" + info.supporterEmail + "'");
                    }            
            });
    });
    }
    
    let setNewFunds = (info, newFunds) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Supporter SET availableFunds=? WHERE email=?", [newFunds, info.supporterEmail], (error, rows) => {
                    if (error) { return reject(error); }
                    if (rows.affectedRows == 1) {
                        console.log("TEST2:" + JSON.stringify(rows[0]));
                        return resolve(true);
                    } else {
                        return reject("supporter not found with name '" + info.supporterEmail + "'");
                    }            
            });
    });
    }
    
    let getProjectTotal = (info) => {
        return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Project WHERE name=?", [info.projectName], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) {
                    console.log("PROJECT TOTAL:" + JSON.stringify(rows[0].amountRaised))
                    return resolve(rows[0].amountRaised);
                } else {
                    return reject("project not found with name '" + info.projectName + "'");
                }            
        });
    });
    }
    
    let setProjectTotal = (info, newTotal) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Project SET amountRaised=? WHERE name=?", [newTotal, info.projectName], (error, rows) => {
                    if (error) { return reject(error); }
                    if (rows.affectedRows == 1) {
                        return resolve(true);
                    } else {
                        return reject("project not found with name '" + info.projectName + "'");
                    }            
            });
    });
    }
    
    let getDirectSupportAmount = (info) => {
        return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM DirectSupport WHERE supporterEmail=?", [info.supporterEmail], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) {
                    console.log("PROJECT TOTAL:" + JSON.stringify(rows[0].amountRaised))
                    return resolve(rows[0].amountRaised);
                } else {
                    return reject("project not found with name '" + info.projectName + "'");
                }            
        });
    });
    }
    
    let updateDirectSupport = (info, newAmount) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE DirectSupport SET amount=? WHERE (supporterEmail=? AND projectName=?)", [newAmount, info.supporterEmail, info.projectName], (error, rows) => {
                    if (error) { return reject(error); }
                    if (rows.affectedRows == 1) {
                        return resolve(true);
                    } else {
                        return reject("couldnt update direct support");
                    }            
            });
    });
    }
    
    
    try {
        
        const alreadySupported = await checkIfAlreadySupported(info)
        const addedSupport = false;
        
        if(alreadySupported){
            let currentAmount = await getDirectSupportAmount(info)
            let newAmount = parseInt(info.amount) + parseInt(currentAmount);
            addedSupport = await updateDirectSupport(info, newAmount);
            
        }else{
            addedSupport = await addDirectSupport(info);
        }
        
        if(addedSupport){
            let currentFunds = await getSupporterCurrentFunds(info);
            let newSupporterFunds = parseInt(currentFunds, 10) - parseInt(info.amount, 10);
            console.log("NEW FUNDS: " + newSupporterFunds)
            if (newSupporterFunds > 0) {
                let updateFunds = await setNewFunds(info, newSupporterFunds);
                let newFunds = await getSupporterCurrentFunds(info)
                if (newFunds){
                    let currentProjectTotal = await getProjectTotal(info)
                    currentProjectTotal = parseInt(currentProjectTotal)
                    //console.log("E6")
                    let newProjectTotal = parseInt(currentProjectTotal, 10) + parseInt(info.amount,10)
                    console.log(currentProjectTotal)
                    console.log(newFunds)
                    console.log("NEW TOTAL: " + JSON.stringify(newProjectTotal))
                    let setNewTotal = await setProjectTotal(info, newProjectTotal)
                    
                    response.statusCode = 200
                    response.supporterFunds = parseInt(newFunds, 10)
                    response.projectTotal = parseInt(newProjectTotal)
                    console.log("E5")
                }
            }
        
            else {
                response.statusCode = 400;
                response.error = JSON.stringify("insufficient funds")
            }
        }
        else {
            response.statusCode = 400;
            response.error = JSON.stringify("unable to add direct support to project")
        }
            
        
        
        // 1. Query RDS for the first constant value to see if it exists!
        //   1.1. If doesn't exist then ADD
        //   1.2  If it DOES exist, then I need to replace
        // ----> These have to be done asynchronously in series, and you wait for earlier 
        // ----> request to complete before beginning the next one
        //console.log("E1")
        
        
    } catch (error) {
        console.log("ERROR: " + error);
        response.statusCode = 400;
        response.error = error;
    }

    return response
};