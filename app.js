var exec = require('child_process').exec;
var Combinatorics = require('js-combinatorics');


var PHPSESSID = 'addPHPSESSID';
var token = 'addTOKEN';

// —---------------- create the data (patterns)

// all available "objects"
var arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// sequences which make no sense in a common way, but should be possible
var forbiddenseq = [
    '13',
    '16',
    '19',
    '18',
    '17',
    '27',
    '28',
    '29',
    '31',
    '34',
    '37',
    '38',
    '39',
    '43',
    '46',
    '49'
];
String.prototype.contains = function (it) {
    return this.indexOf(it) != -1;
};
forbiddenseq = forbiddenseq.concat('11','22','33','44','55','66','77','88','99').concat(forbiddenseq.map(function (seq) {
    // patterns in the reverse way, are also not common
    return seq[1] + seq[0]
}));
// sequencing done

/**
 * filter for forbidden sequences
 * @param elem
 * @returns {boolean}
 */
var filterByLogic = function (elem) {
    // false if pattern found
    return forbiddenseq.every(function (isForbidden) {
        return !(elem + '').contains(isForbidden)
    });
};
// do the permutation stuff
var cmb;
cmb = Combinatorics.permutation(arr, 6);

// join the permutation to strings and filter not common patterns
var generated = cmb.toArray().map(function (elem) { return elem.join(''); }).filter(filterByLogic);

// —---------------- execute the requests with windows cmd
var buildCMD = function (pattern) {
    return 'curl "http://www.galaxy-journey.ch/game/checkCode" -H "Origin: http://www.samsung.com" -H "Accept-Encoding: gzip, deflate" -H "Accept-Language: en-US,en;q=0.8," -H "User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36" -H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" -H "Accept: application/json, text/javascript, */*; q=0.01" -H "Referer: http://www.samsung.com/ch/microsite/galaxyjourney/" -H "Cookie: PHPSESSID=' + PHPSESSID + '" -H "Connection: keep-alive" —data "r_token=' + token + '&pattern=' + pattern + '&locale=en" —compressed';
};

// start the magic
generated.forEach(function (pattern) {
    exec(buildCMD(pattern), function (error, stdout, stderr) {
        // command output is in stdout
        if (stdout.correct) {
            console.log(pattern);
            console.log(stdout);
        } else {
            if (stdout.wrongToken) {
                console.log('wrongToken');
                throw 'wrongToken';
            }
        }

    });
});