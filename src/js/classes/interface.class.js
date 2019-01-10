const FS = require('fs');
const { remote, shell } = require('electron');
const dialog = remote.require('electron').dialog;

const {InterfaceMapper} = require("../../../src/js/classes/interfaceMapper.class.js");
const {InterfaceTester} = require("../../../src/js/classes/interfaceTester.class.js");

class Interface {

	constructor(config, joystick, themes, mappings) {

		this.config = config;
		this.joystick = joystick;
		this.themes = themes;
		this.mappings = mappings;
		this.about = false;
		this.interfaceMapper = new InterfaceMapper(config, joystick, themes, mappings);
		this.interfaceTester = new InterfaceTester(config, joystick, themes, mappings);

		this.browserWindow = remote.getCurrentWindow();
		this.browserWindow.setTitle("Open Joystick Display - ESC to Toggle Broadcast Mode");
		this.browserWindow.setMenu(null);

		this.zoomMin = .25;
		this.zoomMax = 3;
		this.zoomInc = .25;

		this.renderCSSOverrides();
		this.render();

	}

	bindActions() {

		// Top Toolbar
		$("#ojd-select-theme").bind('change', this.actionSelectTheme.bind(this));
		$("#ojd-select-theme-folder").bind('click', this.actionSelectThemeFolder.bind(this));

		// Bottom Toolbar
		$("#ojd-top-toggle").bind('click', this.actionToggleAlwaysOnTop.bind(this));
		$("#ojd-chroma-toggle").bind('click', this.actionToggleChroma.bind(this));
		$("#ojd-chroma-color").bind('keyup', this.actionSetChomaColor.bind(this));
		$("#ojd-zoom-in").bind('click', this.actionZoomIn.bind(this));
		$("#ojd-zoom-out").bind('click', this.actionZoomOut.bind(this));

		// Dev Tools
		$("#ojd-dev-toggle").bind('click', this.actionToggleDevTools.bind(this));
		$("#ojd-reload-toggle").bind('click', this.actionReload.bind(this));
		$("#ojd-reset-toggle").bind('click', this.actionReset.bind(this));

		// About
		$(".ojd-about-toggle").bind('click', this.actionToggleAbout.bind(this));

		// External Links
		$(".ojd-external-link").bind('click', this.actionToggleExternalLinks.bind(this));

		// Window Events
		$(window).bind('keyup', this.actionToggleMenu.bind(this));

	}

	actionReset(e) {
		if (confirm("Are you should you want to reset your config?\nAll settings and mappings will be lost.")) {
			this.config.reset();
			this.actionReload();
		}
	}

	actionToggleExternalLinks(e) {
		const $element = $(e.target);
		shell.openExternal($element.attr('href'));
	}

	actionToggleAbout(e) {
		this.about = !this.about;
		this.renderCSSOverrides();
	}

	actionToggleDevTools(e) {

		this.browserWindow.toggleDevTools();
		
		// Needs a timeout response unfortunately to toggle in application
		setTimeout((function() {
			const devToolsOpened = this.browserWindow.isDevToolsOpened();
			if (devToolsOpened) {
				$("#ojd-dev-toggle").addClass("ojd-active");
			} else {
				$("#ojd-dev-toggle").removeClass("ojd-active");
			}
		}).bind(this), 250);

	}

	actionReload(e) {
		location.reload();
	}

	actionSelectThemeFolder(e) {
		const path = dialog.showOpenDialog({
		    properties: ['openDirectory']
		});

		if (path === undefined) {
			return;
		}

		this.themes.setUserThemeDirectory(path[0]);
		location.reload();
	}


	actionZoomIn(e) {
		const zoom = this.config.getZoom();
		if (zoom < this.zoomMax) {
			this.config.setZoom(zoom+this.zoomInc);
		}
		this.renderZoomPercentage();
		this.renderCSSOverrides();
	}

	actionZoomOut(e) {
		const zoom = this.config.getZoom();
		if (zoom > this.zoomMin) {
			this.config.setZoom(zoom-this.zoomInc);
		}
		this.renderZoomPercentage();
		this.renderCSSOverrides();
	}

	actionSetChomaColor(e) {
		const value = $(e.target).val();
		this.config.setChromaColor(value);
		this.renderCSSOverrides();
	}

	actionToggleAlwaysOnTop(e) {
		const alwaysOnTop = this.config.toggleAlwaysOnTop();
		if (alwaysOnTop) {
			$("#ojd-top-toggle").addClass("ojd-active");
		} else {
			$("#ojd-top-toggle").removeClass("ojd-active");
		}
		this.browserWindow.setAlwaysOnTop(alwaysOnTop);
	}

	actionToggleChroma(e) {
		const chroma = this.config.toggleChroma();
		if (chroma) {
			$("#ojd-chroma-toggle").addClass("ojd-active");
		} else {
			$("#ojd-chroma-toggle").removeClass("ojd-active");
		}
		this.renderCSSOverrides();
	}

	actionSelectTheme(e) {
		const id = $(e.target).val();
		if (id === '') {
			const theme = this.config.getTheme();
			$("#ojd-select-theme").val(theme);
			return false;
		} else {
			this.themes.setTheme(id);
		}
	}

	actionToggleMenu(e) {
		 if(e.key === "Escape") {
		 	if (this.about) {
		 		this.actionToggleAbout();
		 	} else {
		 		this.config.toggleInterface();
		 	}
		 	this.renderCSSOverrides();
		 }
	}

	populateChroma() {
		$("#ojd-chroma-color").val(this.config.getChromaColor());
	}

	populateThemesMenu() {

		// Fetch Stuff
		const $element = $("#ojd-select-theme");
		const themes = this.themes.getThemes();

		// Clear Element
		$element.html('');

		// Create Options

		// Included Themes
		$element.append($('<option/>').val('').html('System Themes:').addClass('ojd-option-header'));
		for (const key in this.themes.themes) {
			const theme = this.themes.themes[key];
			if (!theme.user) {
				$element.append($('<option/>').val(theme.id).html(theme.name));
			}
		}

		// User Themes
		$element.append($('<option/>').val('').html('User Themes:').addClass('ojd-option-header'));
		for (const key in this.themes.themes) {
			const theme = this.themes.themes[key];
			if (theme.user) {
				$element.append($('<option/>').val(theme.id).html(theme.name));
			}
		}
		

		// Set Current Theme Selected
		$element.val(this.config.getTheme());

	}

	renderCSSOverrides() {

		let css="";

		if (this.about) {
			css += "#ojd-about{display:block;}";
		}

		if (this.config.getInterface()) {
			css += "#ojd-theme{padding-top:50px; padding-right:300px; padding-left:300px;}";
		} else {
			css += "#ojd-interface{display:none;} #ojd-interface-map{display:none} #ojd-interface-tester{display:none}";
		}

		if (this.config.getChroma()) {
			const chromaColor = this.config.getChromaColor()
			css += `body{background:${chromaColor};}`;
		} else {
			css += `#ojd-chroma{display:none}`;
		}

		const zoom = this.config.getZoom();
		if (zoom != 1) {
			css += `#ojd-theme-contents{transform: scale(${zoom});}`;
		}

		$("#ojd-css-overrides").html(css);

	}

	renderZoomPercentage() {
		const zoom = this.config.getZoom()*100;
		$("#ojd-zoom-percent").html(zoom);
	}

	render() {

		const files = [
			FS.openSync(`${window.cwd}/src/views/interface.view.html`, 'r'),
			FS.openSync(`${window.cwd}/src/views/theme.view.html`, 'r'),
			FS.openSync(`${window.cwd}/src/views/about.view.html`, 'r')
		];

		$("body").html("");

		for (const file of files) {
			const html = FS.readFileSync(file, 'UTF-8');
			$("body").append(html);
			FS.closeSync(file);
		}

		const chroma = this.config.getChroma();
		const chromaColor = this.config.getChromaColor();
		if (chroma) {
			$("#ojd-chroma-toggle").addClass("ojd-active");
		} else {
			$("#ojd-chroma-toggle").removeClass("ojd-active");
		}

		const alwaysOnTop = this.config.getAlwaysOnTop();
		if (alwaysOnTop) {
			$("#ojd-top-toggle").addClass("ojd-active");
		} else {
			$("#ojd-top-toggle").removeClass("ojd-active");
		}
		this.browserWindow.setAlwaysOnTop(alwaysOnTop);

		const devToolsOpened = this.browserWindow.isDevToolsOpened();
		if (devToolsOpened) {
			$("#ojd-dev-toggle").addClass("ojd-active");
		} else {
			$("#ojd-dev-toggle").removeClass("ojd-active");
		}

		this.populateThemesMenu();
		this.populateChroma();

		this.renderZoomPercentage();

		this.themes.render();
		this.bindActions();

		this.interfaceMapper.render();
		this.interfaceTester.render();

	}

	



}

module.exports.Interface = Interface;

