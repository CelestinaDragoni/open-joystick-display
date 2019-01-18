const FS = require('fs');
const { remote, shell } = require('electron');
const dialog = remote.require('electron').dialog;
const OJD = window.OJD;

const {MapperController} 	= require(OJD.appendCwdPath('app/js/classes/controllers/mapper.controller.js'));
const {ProfileController} 	= require(OJD.appendCwdPath('app/js/classes/controllers/profile.controller.js'));
const {TesterController} 	= require(OJD.appendCwdPath('app/js/classes/controllers/tester.controller.js'));
const {ThemeController} 	= require(OJD.appendCwdPath('app/js/classes/controllers/theme.controller.js'));
const {ToolbarController} 	= require(OJD.appendCwdPath('app/js/classes/controllers/toolbar.controller.js'));

class RootController {

	constructor(config, themes, mappings, joystick, profiles) {

		this.electron = {
			shell: shell,
			dialog: dialog,
			remote: remote,
			window: remote.getCurrentWindow()
		};

		this.config 	= config;
		this.joystick 	= joystick;
		this.profiles 	= profiles;
		this.themes 	= themes;
		this.mappings  	= mappings;
		
		this.controllers = {
			main:this,
			mapper:new MapperController(this),
			profile:new ProfileController(this),
			tester:new TesterController(this),
			theme:new ThemeController(this),
			toolbar:new ToolbarController(this)
		};

		this.electron.window.setTitle("Open Joystick Display - ESC to Toggle Broadcast Mode");
		this.electron.window.setMenu(null);

		this.renderInitial();

	}

	renderInitial() {
		this.controllers.toolbar.renderInitial();
		this.controllers.profile.renderInitial();
		this.controllers.mapper.renderInitial();
		this.controllers.tester.renderInitial();
		this.controllers.theme.renderInitial();
	}

}


module.exports.RootController = RootController;
