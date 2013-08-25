/**
 * JUT Widget Jasmine Reporter
 * 
 * @author: Steve Rogers (www.spiralarm.co.uk)
 * 
 * 
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
  		
		out.info(">> Runner Started");	

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
		
		// Id a failure detected display test results - currently only 2 deep should really recurse
		if (self.failedCount) {
			out.infoerror('>> Runner Finished - Passed ' + self.passedCount + ' specs. Failed ' + self.failedCount + ' specs. Finished in ' + (elapsed/1000) + 's');	
		} else {
			out.info('>> Runner Finished - Passed ' + self.passedCount + ' specs. Failed ' + self.failedCount + ' specs. Finished in ' + (elapsed/1000) + 's');	
		}
			
			
		// diplay our report
		RecursiveReporter(-1);
						
	};
	
	/**
	 * Descend our results and display them
 	 * @param {Object} id
 	 * @param {Object} level
	 */
	function RecursiveReporter(id,level){
			
		var level = level||1;
		var indent  = Array(level*2).join(" ");
			
		self.results.forEach(function(result, idx){
				
			// only use the level we are interested in
			if(result.pid == id){	
					
				(result.result=='failed')?out.error(indent + result.name + ' - Failed'):out.passed(indent+ result.name + ' - Passed');
				result.specs.forEach(function(spec){
					(spec.passed)?out.passed(indent + indent + spec.description):out.error(indent + indent+ spec.description);
					if(spec.items){
						spec.items.forEach(function(msg){
							out.warning(indent + indent + ' --- ' + msg);
						});
					}
				});
				out.log('-');
					
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
		out.log('>> Running ' + spec.suite.description + ' ' + spec.description + '...');    	
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
