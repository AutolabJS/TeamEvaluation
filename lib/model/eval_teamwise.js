const Promise = require("bluebird");
const Input = require("./input");
const Output = require("./output");
const _ = require("lodash");


/**
 * Computes the scores of each team
 *
 * @author Chaitanya Mukka
 * @param  {Object} args   File/Database configs
 * @param  {Wintson.logger} [logger=console] Logger to redirects logs. Defaults to console   
 * @return {Promise}        Exits the pregram when the promise resolves
 */
var computeTeamResults = function(args, logger = console) {

    var databseConfig = args.sqlConfig;
    var readScores = new Input(args.scores, databseConfig)
    var readTeams = new Input(args.teams, databseConfig)    

    var promiseMarks = readScores.readContents();
    var promiseTeam = readTeams.readContents();

    return Promise.all([promiseMarks, promiseTeam]).then(function(res) {
        // res contains the returns of all the promises in the order of as in the input array of promises
        const marks = res[0]; // [[team,score]]
        const teams = res[1]; // [[studentID,team]]
        
        /**  teamView is an object which maps teams and students
        *   @type {Object.<teamID, studentIDs>}
        */
        var teamView = _.transform(teams, function(result, team) {
            (result[team[1]] || (result[team[1]] = [])).push(team[0])
        }, {});


        marks.map(function(tup) {
            tup[1] = parseInt(tup[1]);
        });

        /**  marksView is an object which maps team submissions to their score
        *   @type {Object.<teamID, score>}
        */
        var marksView = _.fromPairs(marks);

        
        /**
         * Stores the projected scores.
         * @type {Array}
         */
        var finalMarks = [["studentID", "score"]];
        /* eslint no-unused-vars : "off" */
        _.forIn(teamView, function(members, team) {
            // pick the objects corresponding to the team members from marksView, and get the scores in array;
            // find the max of the array if scores are submitted else 0
            var maxScore = marksView[team] || 0

            // zip together the student id and the maxScore; type: [[id,score]]
            var updatedScores = _.zip(
                members,
                _.fill(Array(members.length), maxScore)
            );

            // for each of the member push them onto finalMarks
            _.forEach(updatedScores, tup => finalMarks.push(tup));
        });

        // log members those who don't have any assigned teams
        // var illegalInputs = _.omit(marksView, _.flatten(_.values(teamView)));
        // logger.info("Illegal inputs\n", illegalInputs);

        /**
         * @default "./teamScores.csv"
         */
        var writeUpdatedScore = new Output(finalMarks, args.teamScores, databseConfig);
        return writeUpdatedScore.writeContents();
    }).catch(err => { logger.error(err)});
}

module.exports = {
    writeResult: computeTeamResults
};

