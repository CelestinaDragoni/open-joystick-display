const FS = require('fs');
const Sanitize = require('sanitize-html');
const OJD = window.OJD;

class Themes {

	constructor(config, profiles) {

		this.config = config;
		this.profiles = profiles;
		this.themes = {};

		// HTML Sanitization Configuration
		this.sanitize = require('../../../src/js/data/sanitize.json');
		this.sanitizeTags = this.sanitize.tags;
		this.sanitizeAttributes = [];
		for (const attr of this.sanitizeTags) {
			this.sanitizeAttributes[attr] = this.sanitize.attributes;
		}

		this.load();
	}

	load() {

		this.themes = {};
		const directories = FS.readdirSync(OJD.appendCwdPath('/src/themes'));
		for (const dir of directories) {
			try {
				this.themes[dir] = require(OJD.appendCwdPath(`/src/themes/${dir}/theme.json`));
				this.themes[dir].directory = OJD.appendCwdPath(`/src/themes/${dir}/`);
			} catch {
				console.log('Error Loading');
			}
		}

		const userDirectory = this.config.getUserThemeDirectory();
		if (userDirectory) {
			try {
				const paths = FS.readdirSync(userDirectory);
				for (const dir of paths) {
					try {
						this.themes[dir] = require(OJD.getEnvPath(`${userDirectory}/${dir}/theme.json`));
						this.themes[dir].directory = OJD.getEnvPath(`${userDirectory}/${dir}/`);
						this.themes[dir].user = true;
					} catch {
						console.error(`Could not load theme from directory: ${dir}`);
					}
				}
			} catch {
				console.error("Could not load user themes.");
			}

		}

	}

	render() {

		/*const currentTheme = this.getCurrentTheme();
		const theme = this.themes[currentTheme];

		// Invalid theme on load
		if (!theme) {
			this.setDefaultTheme();
			this.render();
			return;
		}

		$('#ojd-theme-contents').hide();
	
		// Get Theme CSS
		$("#theme-stylesheet").remove();
		$('head').append(`<link id="theme-stylesheet" rel="stylesheet" href="${theme.cssDirectory}/theme.css" type="text/css" />`);

		// Get Theme Data
		let html = "";
		try {
			const file = FS.openSync(`${theme.directory}/theme.html`, 'r');
			html = FS.readFileSync(file, 'UTF-8');
			html = Sanitize(html, {
				allowedTags:this.allowedTags,
				allowedAttributes:this.allowedAttributes
			});
			FS.closeSync(file);
		} catch {
			alert("Theme not found. Perhaps it was moved or deleted?");
			FS.closeSync(file);
			return;
		}

		// For User Content, Replace the Directory Variable
		if (theme.user) {
			html= html.replace(/%DIRECTORY%/g, theme.directory);
		}
		$('#ojd-theme-contents').html(html);


		$('#ojd-theme-contents').show();*/

	}

	setUserThemeDirectory(directory) {
		this.config.setUserThemeDirectory(directory);
		this.setDefaultTheme();
	}

	getUserThemeDirectory() {
		return this.config.getUserThemeDirectory();
	}

	setDefaultTheme() {
		this.setTheme('sfc');
	}

	getThemes() {
		return this.themes;
	}

	getCurrentTheme() {
		return this.config.getTheme();
	}

	setTheme(themeIndex) {
		this.config.setTheme(themeIndex);
		this.render();
	}

}
module.exports.Themes = Themes;