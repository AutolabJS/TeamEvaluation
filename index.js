/* eslint no-unused-vars : "off" */
const Promise = require("bluebird");

const seneca = require("seneca")();

/** Config is expected to be of this form@
*   @example
* 
*   {
*       role: "evaluate",
*       cmd: "team",
*       [sqlConfig : {
*           db : Name of the user MySQL database
*           user : Name of the user
*           password : Password of the above user
*       }],
*       teams : teams table name 
*       scores : scores table name 
*       teamScores: final ouput table  
*   }
*/

// post the request (config) at http://localhost:PORT/act

/* eslint no-process-env: "off"*/
/* eslint no-undef : "off"*/

seneca
    .use("lib/controller") // equivalent to saying require("./senecaAPI")
    .listen({
        type: "http", // communicate via http
        port: process.env.PORT || "8260", // listen at this port
        pin: "role:evaluate" // listen only this pin pattern
    });
