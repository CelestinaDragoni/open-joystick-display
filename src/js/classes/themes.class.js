const FS = require('fs');
const Sanitize = require('sanitize-html');

class Themes {

	constructor(config) {
		this.config = config;
		this.allowedTags = [
			'div',
			'main',
			'header',
			'section',
			'footer', 
			'small',
			'span', 
			'svg', 
			'rect',
			'polygon',
			'ellipse',
			'star',
			'circle',
			'text',
			'button', 
			'b', 
			'i', 
			'u',
			'em',
			'sup',
			'strong', 
			'img', 
			'br', 
			'p', 
			'label', 
			'strike'
		];
		this.allowedAttributes = {};
		for (const attr of this.allowedTags) {
			this.allowedAttributes[attr] = [
				'ojd-directional', 
				'ojd-button',
				'ojd-trigger-scale',
				'ojd-trigger-scale-inverted',
				'ojd-trigger-move',
				'ojd-trigger-move-inverted',
				'class',
				'style',
				'id',
				'src',
				'height',
				'width',
				'cx',
				'cy',
				'r',
				'stroke',
				'stroke-width',
				'fill',
				'x',
				'y',
				'rx',
				'ry',
				'points',
				'defs',
				'linearGradient',
				'font-size',
				'font-family'
			];
		}
		this.themes = {};
		this.refresh();
	}

	refresh() {

		this.themes = {};
		if (process.platform === "win32") {
			const paths = FS.readdirSync(`${window.cwd}\\src\\themes`);
			for (const dir of paths) {
				this.themes[dir] = require(`${window.cwd}\\src\\themes\\${dir}\\theme.json`);
				this.themes[dir].directory = `${window.cwd}\\src\\themes/${dir}/`;
				this.themes[dir].cssDirectory = `${window.cwd}/src/themes/${dir}/`;
				this.themes[dir].user = false;
			}
		} else {
			const paths = FS.readdirSync(`${window.cwd}/src/themes`);
			for (const dir of paths) {
				this.themes[dir] = require(`${window.cwd}/src/themes/${dir}/theme.json`);
				this.themes[dir].directory = `${window.cwd}/src/themes/${dir}/`;
				this.themes[dir].cssDirectory = `${window.cwd}/src/themes/${dir}/`;
				this.themes[dir].user = false;
			}
		}

		const userDirectory = this.config.getUserThemeDirectory();
		if (userDirectory) {
			try {
				const paths = FS.readdirSync(userDirectory);
				for (const dir of paths) {
					if (process.platform === "win32") {
						if (FS.lstatSync(`${userDirectory}\\${dir}`).isDirectory() && FS.existsSync(`${userDirectory}\\${dir}\\theme.json`)) {
							try {
								this.themes[dir] = require(`${userDirectory}\\${dir}\\theme.json`);
								this.themes[dir].cssDirectory = this.themes[dir].directory = `${userDirectory}/${dir}/`;
								this.themes[dir].user = true;
							} catch {
								console.error(`Could not load theme from directory: ${dir}`);
							}
						}
					} else {
						if (FS.lstatSync(`${userDirectory}/${dir}`).isDirectory() && FS.existsSync(`${userDirectory}/${dir}/theme.json`)) {
							try {
								this.themes[dir] = require(`${userDirectory}/${dir}/theme.json`);
								this.themes[dir].cssDirectory = this.themes[dir].directory = `${userDirectory}/${dir}/`;
								this.themes[dir].user = true;
							} catch {
								console.error(`Could not load theme from directory: ${dir}`);
							}
						}
					}
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