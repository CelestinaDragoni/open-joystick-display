window.$ = window.jQuery = require('jquery');

if (process.platform === "win32") {
	window.cwd = __dirname.replace('src\\views', '');
} else {
	window.cwd = __dirname.replace('src/views', '');
}
console.log(window.cwd);
console.log(process.platform);

$(function() {
	const {Config} 		= require("../../src/js/classes/config.class.js");
	const {Joystick} 	= require("../../src/js/classes/joystick.class.js");
	const {Themes} 		= require("../../src/js/classes/themes.class.js");
	const {Mappings} 	= require("../../src/js/classes/mappings.class.js");
	const {Interface} 	= require("../../src/js/classes/interface.class.js");

	const config = new Config();
	const joystick = new Joystick(config);
	const mappings = new Mappings(config);
	const themes = new Themes(config);
	const interface = new Interface(config, joystick, themes, mappings);

	window.config = config;
});

