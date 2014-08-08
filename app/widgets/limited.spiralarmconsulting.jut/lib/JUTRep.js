/**
 * JUT Widget Jasmine Reporter
 * 
 * Reporter class for the Alloy JUT widger
 * 
 * @author: Steve Rogers (www.spiralarm.co.uk)
 * 
 * @class widgets.limited.spiralarmconsulting.jut.JUTRep
 */


/**
 * Create a new JUTReporter
 * 
 * @method JUTReporter
 * @constructor
 * @param {Object} out Our Reporter
 * @param {Function} endCallback optional callback run after tests are completed
 */
function JUTReporter(out,endCallback){
	
	var self = this;
	self.results = [];
    self.started = false, self.finished = false,self.start_time=0,self.passCount = 0,self.failedCount = 0;


	// We have started Testing
    self.reportRunnerStarting = function(runner) {
    	
    	self.started = true;
		self.start_time = (new Date()).getTime();
    	self.passedCount = 0;
    	self.failedCount = 0;

		// create our result  array
  		var suites = runner.suites();
  		for (var i = 0; i < suites.length; i++) {
    		var suite = suites[i];
    		self.results[suite.id] = {name: suite.description, pid: (suite.parentSuite)?suite.parentSuite.id:-1, specs: []};
		}
  		
		out.info("Testing Started");	

    };
	
	// We have finished Testing
	self.reportRunnerResults = function(runner){
		
		// Invoke our end callback if defined
		var finished = (new Date()).getTime();
		var elapsed = (finished - self.start_time);
		if (endCallback) {
			endCallback({
				results: self.results,
				failed: self.failedCount,
				passed: self.passedCount,
				elapsed: elapsed
			});
		}
		
		// If a failure detected display test results - currently only 2 deep should really recurse
		var timeTaken = 'finished in ' + (elapsed/1000) + 's';
		if (self.failedCount) {
			out.infoerror('Passed ' + self.passedCount + ' specs. Failed ' + self.failedCount + ' specs.');
			out.time(timeTaken);	
		} else {
			out.info('Passing ' + self.passedCount + ' specs.');	
			out.time(timeTaken);	
		}
			
			
		// diplay our report
		RecursiveReporter(-1);
						
	};
	
	/**
	 * Descend our results and display them
	 * 
	 * @method RecursiveReporter
 	 * @param {Object} id
 	 * @param {Object} level
	 */
	function RecursiveReporter(id,level){
			
		var level = level||1;
		var indent  = Array(level*2).join(" ");
			
		self.results.forEach(function(result, idx){
			
			Ti.API.info(result);
				
			// only use the level we are interested in
			if(result.pid == id){	
				
				
				// did we pass or fail	
				(result.result=='failed')?out.testerror(indent + result.name):out.testpassed(indent+ result.name);
				
				// dump each spec
				result.specs.forEach(function(spec){
					(spec.passed)?out.passed(indent + indent + ' - ' + spec.description):out.error(indent + indent+ ' - ' +  spec.description);
					if(spec.items){
						spec.items.forEach(function(msg){
							out.warning(indent + indent + indent + msg);
							out.log();
						});
					}
				});
				out.log();
					
				// now see if we have children
				RecursiveReporter(idx,level*=2);

			}
			
					
		});
	}
	
	// Record some Results for Reporting
    self.reportSuiteResults = function(suite){
   		var results = suite.results();
  		var status = results.passed() ? 'passed' : 'failed';
  		self.results[suite.id].result = status;
  	};
    
    // We are running a test Suite
    self.reportSpecStarting = function(spec){
		out.log(' * Running ' + spec.suite.description + ' [' + spec.description + ']');    	
    };
    
    // We have the results of a spec 
    self.reportSpecResults = function(spec){	
		var results = spec.results();
		
		var msgs = [];
		if (results.items_) {
			results.items_.forEach(function(item) {
				if(!item.passed_ && item.message){
					msgs.push(item.message);
				}
			});
		}

		self.passedCount += results.passedCount;
		self.failedCount += results.failedCount;
		self.results[spec.suite.id].specs.push({description: spec.description, passed: (results.failedCount===0), items: msgs});
    };
    
    // ?
    self.log = function(){
    	out.log('>> ??log function invoked?? - should not see this');
    };
	
	
	
}

// get it exported
module.exports = JUTReporter;
