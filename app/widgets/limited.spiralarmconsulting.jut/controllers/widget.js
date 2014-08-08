/**
 * JUT - a Jasmine Unit Test Widget for Alloy Projects
 * 
 * @author: Steve Rogers (www.spiralarm.co.uk)
 * see http://www.spiralarm.co.uk/jut/ ‎ for more info.
 *
 * This widget is based on the code created by Bill Dawson (http://billdawson.com) for his 
 * TiJasmine CommonJS module
 *
 * Unless required by applicable law or agreed to in writing, this software
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
 * either express or implied.
 *
 * @class widgets.limited.spiralarmconsulting.jut
 */


var jasmine = require(WPATH('jasmine')).jasmine;
var reporter = require(WPATH('JUTRep'));


/**
 * Logger Class
 * This is used to generate and display the output from the Reporter to the widget 'console'
 * 
 * @type {Object} defines the console logger for our reporter
 */
var logger={

	log: function(txt,color, background,weight){
		var line = Ti.UI.createLabel({
			text: txt,
			color: color||'#333333',
			backgroundColor: background|| 'transparent',
			font: { fontSize: 14, fontFamily: 'arial', fontWeight: weight||'normal'},
			left: '5dp',
			right: '5dp',
			textAlign: 'left'			
		});
		$.jutConsole.add(line);	
	},
	
	time: function(txt){
		$.jutTimeTaken.text = txt;	
	},
	
	error: function(txt){
		this.log(txt, '#C3716B');
	},

	passed: function(txt){
		this.log(txt, '#4D6C16');
	},

	testerror: function(txt){
		this.log(txt, '#C3716B');
	},

	testpassed: function(txt){
		this.log(txt, '#333');
	},
	warning: function(txt){
		this.log(txt, '#FF8000');
	},

	info: function(txt){
		this.log(txt, '#EAEAEA','#4D6C16',true);
	},	

	infoerror: function(txt){
		this.log(txt, '#EAEAEA','#C3716B',true);
	}	

	
};

/**
 * Our Widget Constructor
 * 
 * @param {Object} args The arguments passed to the widget
 * @method init
 * @constructor
 * @private
 */
(function init(args){

	// the Jasmine env
	var env = jasmine.getEnv();

	/*
 	 * Our Jasmine functions
 	 */
	describe = function(description, specDefinitions) {
		return env.describe(description, specDefinitions);
	};

	xdescribe = function(description, specDefinitions) {
		return env.xdescribe(description, specDefinitions);
	};

	it = function(desc, func) {
		return env.it(desc, func);
	};

	xit = function(desc, func) {
		return env.xit(desc, func);
	};

	beforeEach = function(beforeEachFunction) {
		return env.beforeEach(beforeEachFunction);
	};

	afterEach = function(afterEachFunction) {
		return env.afterEach(afterEachFunction);
	};

	expect = function(actual) {
		return env.currentSpec.expect(actual);
	};

	addMatchers = function(matchers) {
		return env.addMatchers(matchers);
	};

	spyOn = function(obj, methodName) {
		return env.currentSpec.spyOn(obj, methodName);
	};

	runs = function(func) {
		return env.currentSpec.runs(func);
	};

	waitsFor = function(latchFunction, optional_timeoutMessage, optional_timeout) {
		return env.currentSpec.waitsFor(latchFunction, optional_timeoutMessage, optional_timeout);
	};

	// display the version of Jasmine being used
	$.jasmineVersion.text = String.format('Jasmine %s', env.versionString());
	
	//add our Reporter
	env.addReporter(new reporter(logger));

	// load our specs
	if(args.spec){
		var specs = args.spec.split(',');
		specs.forEach(function(path){
			require('/spec/'+ path);	
		});	
	}

	// run the tests
	env.execute();

})(arguments[0]||{});


