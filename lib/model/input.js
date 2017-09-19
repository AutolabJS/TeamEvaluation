const Promise = require("bluebird");    
const mysql = require('mysql');
const _ = require("lodash");

/** Generic class for Input */
class Input {
    
    readContents(args){
        return this.read(args);
    }
}


class SQLInput extends Input{
    constructor(table, database){
        super();
        this.link = Promise.promisifyAll(
            mysql.createConnection({
                connectionLimit : 100, 
                host: "localhost",
                port: "3306",
                user: database.user,
                password: database.password,
                database: database.db  
            })
        );
        this.table = table;
    }

    read(){
        return this.link.queryAsync(`SELECT * FROM ${this.table}`)
        .then(this.parse.bind(this))
        .then(this.endLink.bind(this))
        .then(() => this.content);
    }

    parse(rows){
        if(rows.length !== 0) {
            this.content = _.map(rows, function(row) {
                return _.values(row);
            });
        }
        else
            throw new Error("No contents in table " + this.table); 
    }
    endLink(){
        this.link.end();
    }
}


module.exports = SQLInput;
