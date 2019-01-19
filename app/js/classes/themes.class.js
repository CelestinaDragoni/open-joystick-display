const FS = require('fs');
const Sanitize = require('sanitize-html');
const OJD = window.OJD;
const Clone = require('clone');

class Themes {

	constructor(config, profiles) {

		this.config = config;
		this.profiles = profiles;
		this.themes = {};

		// HTML Sanitization Configuration
		this.sanitize = require(OJD.appendCwdPath('/app/js/data/sanitize.json'));
		this.sanitizeTags = this.sanitize.tags;
		this.sanitizeAttributes = [];
		for (const attr of this.sanitizeTags) {
			this.sanitizeAttributes[attr] = this.sanitize.attributes;
		}

		this.load();
	}

	load() {

		this.themes = {};
		const directories = FS.readdirSync(OJD.appendCwdPath('/app/themes'));
		for (const dir of directories) {
			try {
				this.themes[dir] = require(OJD.appendCwdPath(`/app/themes/${dir}/theme.json`));
				this.themes[dir].directory = OJD.appendCwdPath(`/app/themes/${dir}/`);
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

	getThemeThemeId() {
		return 'ojd-gc';
	}

	getTheme(id) {

		console.log(this.themes[id]);

		const theme = Clone(this.themes[id]);
		if (!theme) {
			return false;
		}

		theme.html = '';
		try {
			const file = FS.openSync(`${theme.directory}theme.html`, 'r');
			theme.html = FS.readFileSync(file, 'UTF-8');
			FS.closeSync(file);
			theme.html = Sanitize(theme.html, {
				allowedTags:this.sanitizeTags,
				allowedAttributes:this.sanitizeAttributes
			});
		} catch(e) {
			console.error(e);
			return false;
		}

		theme.html = theme.html.replace(/%DIRECTORY%/g, theme.directory);

		return theme;

	}

	setUserThemeDirectory(directory) {
		this.config.setUserThemeDirectory(directory);
		this.load();
	}

	getUserThemeDirectory() {
		return this.config.getUserThemeDirectory();
	}

	getThemes() {
		return this.themes;
	}

}
module.exports.Themes = Themes;