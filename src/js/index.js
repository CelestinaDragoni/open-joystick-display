/*
	Magic Starts Here
*/

// Load jQuery Globally
window.$ = window.jQuery = require('jquery');

// Load Tools Globally
const {OJD} = require("../../src/js/ojd.js");
window.$OJD = new OJD(__dirname);

// Load Application
$(function() {
	const {Config} 		= require("../../src/js/classes/config.class.js");
	const {Mappings} 	= require("../../src/js/classes/mappings.class.js");
	const {Profiles} 	= require("../../src/js/classes/profiles.class.js");
	const {Joystick} 	= require("../../src/js/classes/joystick.class.js");
	const {Themes} 		= require("../../src/js/classes/themes.class.js");
	const {Interface} 	= require("../../src/js/classes/interface.class.js");

	const config 	= new Config();
	//const mappings 	= new Mappings(config);
	//const profiles 	= new Profiles(config, mappings);
	//const joystick 	= new Joystick(config, profiles);
	//const themes 	= new Themes(config, profiles);
	//const interface = new Interface(config, joystick, profiles);

});

