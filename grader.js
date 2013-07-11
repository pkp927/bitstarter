#!/usr/bin/env node
/*
Automatically grades files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio . Teaches command line application development
and basic DOM parsing.
*/


var fs = require('fs');  
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile){
    var instr = infile.toString();
    if(!fs.existsSync(instr)){
	console.log("%s does not exist. Exiting ",instr);
	process.exit(1);
    }
    return instr;
};

var cheerioHtmlFile = function(htmlFile){
    return cheerio.load(fs.readFileSync(htmlFile));
};

var loadsChecks = function(checksFile){
    return JSON.parse(fs.readFileSync(checksFile));
};

var checkHtmlFile = function(htmlFile, checksFile){
    $ = cheerioHtmlFile(htmlFile);
    var checks = loadsChecks(checksFile).sort(); 
    var out = {};
    for(var ii in checks){
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    } 
    return out;
};

var clone = function(fn){
    return fn.bind({});
};

if(require.main == module){
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists),CHECKSFILE_DEFAULT)
        .option('-f --file <html_file>','Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .parse(process.argv);
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
}else{
    exports.checkHtmlFile = checkHtmlFile;
}