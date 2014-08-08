/**
 * documentor.js
 * 
 * Plugin to generate project documentation for an Alloy based project using JSDuck
 * version: 1.0.1
 * 
 * This is a port of my duckandcover alloy.jmk project to a TiStudio plugin
 * 
 * Copyright 2014 SpiralArm Consulting Limited. All Rights Reserved
 * July 2014
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.

 * @author Steve Rogers (@sarmcon)
 */

//change this to specify where the docs will be generated
var doc_output_dir = './docs';

/**
 * Hooks for TiStudio
 */
exports.cliVersion = '>=3.X';
exports.init = function (logger, config, cli, appc) {	
		
	// generate jsduck config PRE compile
	cli.addHook('build.pre.compile', {

        priority: 10,

        post: function (build, finished) {
        	
        	var fs = require('fs');

			// Create our JSDuck config file
			var data = {
				"--":["app"],
				"--no-source": true,
				"--title": "Project: " + build.tiapp.name + " (" +  build.tiapp.id + ") - version: " + build.tiapp.version,		
				"--footer": "Copyright " + build.tiapp.copyright + " ( built using Ti SDK:" + build.tiapp['sdk-version'] + ")",
				"--output": doc_output_dir,
				"--ignore-global": true,
    			"--external": [
        			"Alloy",
        			"Backbone.*",
        			"Moment",
        			"Controller",
        			"Ti.*",
        			"Titanium.*",
        			"Point",
        			"Dimension"
    			]		
			};
			
			logger.info("----- DUCKANDCOVER PREPARATION -----");
			
			// If README.md exists use as index page for documentation
			if(fs.existsSync('./README.md')){
				logger.info("Including README.md as welcome page");
				data["--welcome"] = "./README.md";
			}

			// If guides are required include here
			if(fs.existsSync('./jsduck-guides.json')){
				logger.info("Adding jsduck-guides.json");
				data["--guides"] = "jsduck-guides.json";
			}
			
			// If categories defined include them here
			if(fs.existsSync('./jsduck-categories.json')){
				logger.info("Adding jsduck-categories.json");
				data["--categories"] = "jsduck-categories.json";
			}

			// now create the jsduck config file
			logger.info("Creating jsduck.json config file");
			fs.writeFileSync("jsduck.json", JSON.stringify(data));
           	finished();
           	
        }

    });

	// run documentor POST compile
	cli.addHook('build.post.compile', {
		
		priority: 10,
		post: function(build, finished){
			
			// Run JS DUCK on source
			logger.info("----- DOCUMENTING PROJECT -----");
			var exec = require("child_process").exec;
			exec("jsduck");
			logger.info("- Project Documentation has been generated in the " + doc_output_dir + ' directory.');
			finished();
			
		}
	});

};
