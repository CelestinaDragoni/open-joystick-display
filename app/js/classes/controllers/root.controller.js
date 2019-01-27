const FS = require('fs');
const { remote, shell } = require('electron');
const dialog = remote.require('electron').dialog;
const OJD = window.OJD;
const Clone = require('clone');

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

		// Broadcast should be off on load.
		this.config.config.broadcast = false;
		this.config.save();
		
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
		this.electron.window.setBounds(this.config.getBounds());

		this.renderInitial();
   		this.windowChangeTimeout = false;

   		remote.getCurrentWindow().on('resize', this.onWindowChange.bind(this));
    	remote.getCurrentWindow().on('move', this.onWindowChange.bind(this));

	}

	onExternalLink(e) {
		e.preventDefault();
		const $element = $(e.target);
		shell.openExternal($element.attr('href'));
	}

	onWindowChange(e) {
		clearTimeout(this.windowChangeTimeout)
		this.windowChangeTimeout = setTimeout(function(self) {
			const broadcast = self.config.getBroadcast();
			const bounds 	= Clone(remote.getCurrentWindow().getBounds());
			if (broadcast) {
				self.profiles.setProfileBounds(bounds);
			} else {
				self.config.setBounds(bounds);
			}
		}, 100, this);
	}

	onToggleBroadcast(e) {
		if(e.key === "Escape") {
			if (this.controllers.toolbar.aboutDialog) {
				this.controllers.toolbar.onAbout();
			} else {
				this.config.toggleBroadcast();
		 		this.renderBroadcast();
		 	}
		}
	}

	renderBroadcast() {
		const broadcast = this.config.getBroadcast();
		const bounds = remote.getCurrentWindow().getBounds();
		if (broadcast) {
			$("*[ojd-broadcast]").addClass('ojd-broadcast-mode');
			remote.getCurrentWindow().setBounds(this.profiles.getCurrentProfileBounds());
			if (this.profiles.getCurrentProfileBoundsLock()) {
				remote.getCurrentWindow().setResizable(false);
			}
			if (this.profiles.getCurrentProfileAlwaysOnTop()) {
				remote.getCurrentWindow().setAlwaysOnTop(true);
			}
		} else {
			$("*[ojd-broadcast]").removeClass('ojd-broadcast-mode');
			remote.getCurrentWindow().setBounds(this.config.getBounds());	
			remote.getCurrentWindow().setResizable(true);
			remote.getCurrentWindow().setAlwaysOnTop(false);
			this.reloadProfile();
		}
	}

	openDirectoryDialog() {
		const path = dialog.showOpenDialog({
		    properties: ['openDirectory']
		});

		if (path === undefined) {
			return false;
		}

		return path[0];
	}

	reloadTheme() {
		this.controllers.theme.render();
	}

	reloadMapper() {
		this.controllers.mapper.render();
	}

	reloadProfile() {
		this.controllers.profile.render();
	}

	renderInitial() {
		this.controllers.toolbar.renderInitial();
		this.controllers.profile.renderInitial();
		this.controllers.mapper.renderInitial();
		this.controllers.tester.renderInitial();
		this.controllers.theme.renderInitial();
		$(window).bind('keyup', this.onToggleBroadcast.bind(this));
		$(".ojd-external-link").bind('click', this.onExternalLink.bind(this));
	}

}


module.exports.RootController = RootController;
