/*
	Magic Starts Here
*/

// Load jQuery Globally
window.$ 	= window.jQuery = require('jquery');
const {OJD} = require("../../app/js/ojd.js");

// Load Tools Globally
window.OJD 	= new OJD(__dirname);

// Load Application
$(function() {
	const {Config} 			= require(window.OJD.appendCwdPath("app/js/classes/config.class.js"));
	const {Mappings} 		= require(window.OJD.appendCwdPath("app/js/classes/mappings.class.js"));
	const {Profiles} 		= require(window.OJD.appendCwdPath("app/js/classes/profiles.class.js"));
	const {Joystick} 		= require(window.OJD.appendCwdPath("app/js/classes/joystick.class.js"));
	const {Themes} 			= require(window.OJD.appendCwdPath("app/js/classes/themes.class.js"));
	const {RootController} 	= require(window.OJD.appendCwdPath("app/js/classes/controllers/root.controller.js"));

	const config 			= new Config();
		window.OJD.setConfig(config);
	const mappings  		= new Mappings(config);
	const profiles  		= new Profiles(config, mappings);
	const joystick  		= new Joystick(config, profiles);
	const themes 			= new Themes(config, profiles);
	const rootController 	= new RootController(config, themes, mappings, joystick, profiles);
	
});

