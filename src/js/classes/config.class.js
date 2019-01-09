const Store = require('electron-store');
const Clone = require('clone');

class Config {

	constructor() {

		this.config = {};
		this.configDefault = require('../../../src/js/config.json');
		this.currentMapping = {};

		this.store = new Store();

		if (typeof this.store.get('config') === 'undefined') {
			console.warn('Loading Default Config');
			this.store.set('config', this.configDefault);
			this.config = Clone(this.configDefault);
		} else {
			this.config = this.store.get('config');
		}
		
		this.config = this.store.get('config');
		this.loadMapping(this.config.map);

	}

	toggleMapInterface() {
		this.config.mapInterface = !this.config.mapInterface;
		this.save();
		return  this.config.mapInterface;
	}

	getMapInterface() {
		return this.config.mapInterface;
	}

	setUserThemeDirectory(directory) {
		this.config.themeUserDirectory = directory;
		this.save();
	}

	getUserThemeDirectory() {
		return this.config.themeUserDirectory;
	}

	getAlwaysOnTop() {
		return this.config.alwaysOnTop;
	}

	toggleAlwaysOnTop() {
		this.config.alwaysOnTop = !this.config.alwaysOnTop;
		this.save();
		return  this.config.alwaysOnTop;
	}

	getZoom() {
		return this.config.zoom;
	}

	setZoom(zoom) {
		this.config.zoom = parseFloat(zoom);
		this.save();
		return this.config.zoom;
	}

	toggleInterface() {
		this.config.interface = !this.config.interface;
		this.save();
		return  this.config.interface;
	}

	getInterface() {
		return this.config.interface;
	}

	toggleChroma() {
		this.config.chroma = !this.config.chroma;
		this.save();
		return  this.config.chroma;
	}

	getChroma() {
		return this.config.chroma;
	}

	getChromaColor() {
		return this.config.chromaColor;
	}

	setChromaColor(value) {
		this.config.chromaColor = value;
		this.save();
		return  this.config.chromaColor;
	}

	getTheme() {
		return this.config.theme;
	}

	setTheme(id) {
		this.config.theme = id;
		this.save();
	}

	loadMapping(id) {

		// To prevent bad things from happening
		if (typeof this.config.mappings[0] === 'undefined') {
			console.warn('Something went wrong, no mappings were found. Loading default configuration.');
			this.reset();
		}

		// Switch current mapping.
		if (typeof this.config.mappings[id] !== 'undefined') {
			this.config.map = id;
			this.currentMapping = this.config.mappings[id];
		} else {
			this.config.map = 0;
			this.currentMapping = this.config.mappings[0];
		}

		// Save for Sanity
		this.save();

	}

	getMappingIndex() {
		return this.config.map;
	}

	getMapping() {
		return this.currentMapping;
	}

	save() {
		this.store.set('config', this.config);
	}

	reset() {
		this.store.set('config', Clone(this.configDefault));
	}

}

module.exports.Config = Config;