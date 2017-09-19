// import the required functionality
const eval_teamwise = require("../model/eval_teamwise");

module.exports = function() {
	// this here is seneca

	// add commands to seneca
	this.add("role:evaluate, cmd:team", function(config, done) {
		eval_teamwise
			.writeResult(config)
			.then(() => done(null, {status: "suceess"}))
			.catch(err => done(Object.assign({}, {status: "failure"}, err)));
	});
};
