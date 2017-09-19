const Promise = require("bluebird");
const mysql = require('mysql');
const _ = require("lodash");


/** Generic class for output. */
class Output {

	/**
	 * Calls the (child's) write method 	
	 * @return {Promise}      Signals the completion of output's write method
	 */
    writeContents(){
        return this.write();
    }
}

/**

 * Class that outputs results to a SQL Table
 * @extends {Output}
 */

class SQLWrite extends Output{
	constructor(content, table, database){
		super();
		
		this.link = Promise.promisifyAll(
            mysql.createConnection({
                connectionLimit : 100, 
                host: "localhost",
                port: "3306",
                user: database.user,
                password: database.password,
                database: database.db,
            })
        );
        this.table = table;
        this.content = content;
        this.headers = this.content.shift();
	}

	write(){
		return this.createTable()
					.then(this.insertContents.bind(this))
					.then(this.endLink.bind(this));
	}
	createTable(){
		const createQuery = `CREATE TABLE ${this.table} (${this.headers[0]} VARCHAR(12),${this.headers[1]} INT)`;
		return this.link.queryAsync(`DROP TABLE IF EXISTS ${this.table}`)
					.then(this.link.queryAsync(createQuery).bind(this));
	}
	insertContents(){
		const fields = `(${_.join(this.headers,",")})`;

		const insertQuery = `INSERT INTO ${this.table} ${fields} VALUES ?`;

		return this.link.queryAsync(insertQuery, [this.content]).catch(err=>{throw Error(err)});
	}
	endLink(){
        this.link.end();
    }
}
module.exports = SQLWrite;

