const input = require("../lib/model/input");
const Promise = require("bluebird");

const mocha = require("mocha");
const expect = require("chai").expect;

describe("Input", function() {
	var testConfig = {
			db: "eval",
			user: "root"
		}

	it("should return proper parsed data", function(done) {
		
		var table = "teams";
		var testRead = new input(table, testConfig);
		testRead.readContents().then(function(res) {	
			const expectedResults = [
				["2012A7PS001G", "1"],
				["2012A7PS005G", "1"],
				["2011B1A7001G", "4"],
				["2012A7PS003G", "4"],
				["student1", "3"],
				["student2", "4"],
				["student3", "3"]
			];

			expect(res).to.eql(expectedResults);
		}).then(done);
	});
});
