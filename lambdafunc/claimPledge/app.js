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
    
    let getMaxSupporters = (info) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Pledge WHERE descriptionReward=?", [info.descriptionReward], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && rows.length==1) {
                        console.log("MAX ALLOWED UPPORTERS: " + JSON.stringify(rows[0].maxSupporters))
                        return resolve(rows[0].maxSupporters)
                    } else {
                        return reject("no pledge exist with description: '" + info.descriptionReward + "'");
                    }            
            });
        });
    }
    
    let getCurrentSupporters =(info) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT count(*) AS CNT FROM Pledger WHERE supporterEmail=?", [info.supporterEmail], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && rows.length==1) {
                        console.log("CURRENT SUPPORTERS: " + JSON.stringify(rows[0].CNT))
                        return resolve(rows[0].CNT)
                    } else {
                        return reject("no supporters exist with email: '" + info.supporterEmail + "'");
                    }            
            });
        });
    }

    
    let addPledger = (info) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO Pledger (supporterEmail, descriptionReward) VALUES(?, ?)", 
            [info.supporterEmail, info.descriptionReward], (error, rows) => {
                    if (error) { return reject(error); }
                    if (rows.affectedRows > 0) {
                        console.log("INSERT:" + JSON.stringify(rows));
                        return resolve(true);
                    } else {
                        return reject("pledger already exists with description '" + info.descriptionReward + "'");
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
                        return resolve(JSON.stringify(rows[0].availableFunds));
                    } else {
                        return reject("supporter not found with email '" + info.supporterEmail + "'");
                    }            
            });
    });
    }
    
    let getPledgeAmount = (info) => {
        return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Pledge WHERE descriptionReward=?", [info.descriptionReward], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) {
                    console.log("PLEDGE COST:" + JSON.stringify(rows[0].amount))
                    return resolve(JSON.stringify(rows[0].amount));
                } else {
                    return reject("pledge not found with description '" + info.descriptionReward + "'");
                }            
        });
    });
    }
    
    let setNewFunds = (info, newFunds) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Supporter SET availableFunds=? WHERE email=?", [newFunds, info.supporterEmail], (error, rows) => {
                    if (error) { return reject(error); }
                    if (rows.affectedRows == 1) {
                        console.log("TEST2:" + JSON.stringify(JSON.stringify(rows[0])));
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
                    return resolve(JSON.stringify(rows[0].amountRaised));
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
    
    // let getCurrentFunds = (info) => {
    //     return new Promise((resolve, reject) => {
    //         pool.query("SELECT * FROM Supporter WHERE email=?", [info.supporterEmail], (error, rows) => {
    //                 if (error) { return reject(error); }
    //                 //console.log("INSERT:" + JSON.stringify(rows));
                    
    //                 if ((rows) && (rows.length == 1)) {
    //                     console.log("HERE:" + JSON.stringify(rows))
    //                     console.log("AVAILABLE FUNDS:" + JSON.stringify(rows[0].availableFunds))
    //                     return resolve(JSON.stringify(rows[0].availableFunds));
    //                 } else {
    //                     return reject("project not found with name '" + info.name + "'");
    //                 }            
    //         });
    //     });
    // }
    
    // let getPledgeAmount = (info) => {
    //     return new Promise((resolve, reject) => {
    //         pool.query("SELECT * FROM Pledge WHERE descriptionReward=?", [info.descriptionReward], (error, rows) => {
    //                 if (error) { return reject(error); }
    //                 //console.log("INSERT:" + JSON.stringify(rows));
                    
    //                 if ((rows) && (rows.length == 1)) {
    //                     return resolve(rows[0].amount);
    //                 } else {
    //                     return reject("pledge not found with description '" + info.descriptionReward + "'");
    //                 }            
    //         });
    //     });
    // }
    
    // let updateFunds = (newFunds, info) => {
    //     return new Promise((resolve, reject) => {
    //         pool.query("UPDATE Supporter SET availableFunds=? WHERE email=?", [newFunds, info.supporterEmail], (error, rows) => {
    //                 if (error) { return reject(error); }
    //                 console.log("TEST:" + JSON.stringify(rows));
                    
    //                 if (rows.affectedRows == 1) {
    //                     console.log("TEST2:" + JSON.stringify(JSON.stringify(rows[0])));
    //                     return resolve(true);
    //                 } else {
    //                     return reject("supporter not found with name '" + info.supporterEmail + "'");
    //                 }            
    //         });
    //     });
    // }
    
    // let availableFunds = (info) => {
    //     return new Promise((resolve, reject) => {
    //         pool.query("SELECT * FROM Supporter WHERE email=?", [info.supporterEmail], (error, rows) => {
    //                 if (error) { return reject(error); }
    //                 console.log("TEST:" + JSON.stringify(rows));
                    
    //                 if ((rows) && (rows.length == 1)) {
    //                     console.log("TEST2:" + JSON.stringify(JSON.stringify(rows[0])));
    //                     return resolve(rows[0].availableFunds);
    //                 } else {
    //                     return reject("supporter not found with name '" + info.supporterEmail + "'");
    //                 }            
    //         });
    //     });
    // }
    
    try {
        
        
        let maxSupporters = await getMaxSupporters(info)
        console.log("E1")
        let currentSupporters = await getCurrentSupporters(info)
        console.log("E2")
        if(maxSupporters == -1){
            let currentFunds = await getSupporterCurrentFunds(info)
            console.log("E3")
            let pledgeCost = await getPledgeAmount(info)
            console.log("E4")
            let newSupporterFunds = currentFunds - pledgeCost
            console.log("NEW FUNDS: " + newSupporterFunds)
            if (newSupporterFunds > 0) {
                let claimPledge = await addPledger(info)
                let updateFunds = await setNewFunds(info, newSupporterFunds)
                let newFunds = await getSupporterCurrentFunds(info)
                if (claimPledge){
                    let currentProjectTotal = await getProjectTotal(info)
                    console.log("E6")
                    let newProjectTotal = currentProjectTotal + pledgeCost
                    console.log(currentProjectTotal)
                    console.log(pledgeCost)
                    console.log("NEW TOTAL: " + newProjectTotal)
                    let setNewTotal = await setProjectTotal(info, newProjectTotal)
                    
                    response.statusCode = 200
                    response.supporterFunds = newFunds
                    response.projectTotal = newProjectTotal
                    console.log("E5")
                }
        }
        else if (currentSupporters < maxSupporters){
            let currentFunds = await getSupporterCurrentFunds(info)
            console.log("E3")
            let pledgeCost = await getPledgeAmount(info)
            console.log("E4")
            let newSupporterFunds = currentFunds - pledgeCost
            console.log("NEW FUNDS: " + newSupporterFunds)
            if (newSupporterFunds > 0) {
                let claimPledge = await addPledger(info)
                let updateFunds = await setNewFunds(info, newSupporterFunds)
                let newFunds = await getSupporterCurrentFunds(info)
                if (claimPledge){
                    let spotsLeft = maxSupporters - currentSupporters -1
                    let currentProjectTotal = await getProjectTotal(info)
                    console.log("E6")
                    let newProjectTotal = currentProjectTotal + pledgeCost
                    console.log(currentProjectTotal)
                    console.log(pledgeCost)
                    console.log("NEW TOTAL: " + newProjectTotal)
                    let setNewTotal = await setProjectTotal(info, newProjectTotal)
                    
                    
                    response.statusCode = 200
                    response.supporterFunds = newFunds
                    response.pledgeCapacity = spotsLeft
                    response.projectTotal = newProjectTotal
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
            response.error = JSON.stringify("supporters maxed")
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