const FS = require('fs');

class Themes {

	constructor(config) {
		this.config = config;
		this.themes = {};
		this.refresh();
	}

	refresh() {
		this.themes = {};
		const paths = FS.readdirSync('./src/themes/');
		for (const dir of paths) {
			this.themes[dir] = require(`../../../src/themes/${dir}/theme.json`);
			this.themes[dir].directory = `./src/themes/${dir}/`;
			this.themes[dir].cssDirectory = `../../src/themes/${dir}/`;
			this.themes[dir].user = false;
		}

		const userDirectory = this.config.getUserThemeDirectory();
		if (userDirectory) {
			try {
				const paths = FS.readdirSync(userDirectory);
				for (const dir of paths) {
					this.themes[dir] = require(`${userDirectory}/${dir}/theme.json`);
					this.themes[dir].cssDirectory = this.themes[dir].directory = `${userDirectory}/${dir}/`;
					this.themes[dir].user = true;
				}
			} catch {
				console.error("Could not load user themes.");
			}
		}

	}

	render() {

		const currentTheme = this.getCurrentTheme();
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
			FS.closeSync(file);
		} catch {
			alert("Controller theme not found. Perhaps it was moved or deleted?");
			FS.closeSync(file);
			return;
		}

		// For User Content, Replace the Directory Variable
		if (theme.user) {
			html= html.replace(/%DIRECTORY%/g, theme.directory);
		}
		$('#ojd-theme-contents').html(html);


		$('#ojd-theme-contents').show();

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