const Store = require('electron-store');
const Clone = require('clone');

/*
	Class Config
	System wide config handler for objects.
*/
class Config {

	/*
	 * constructor(cwd)
	 * Config class constructor. 
	 */
	constructor() {

		// Electron Store
		this.store = new Store();

		// Class Variables
		this.config = {};
		this.currentMapping = {};

		// Make new config if one doesn't exist.
		this.init();
		
		// If config version 0, migrate.
		this.migrateConfigZero();

	}

	/*
	 * init()
	 * @param bool reset - Overloaded method for reseting regardless of current state. 
	 * @return bool
	 * Makes a new configuration if this is the first time it's being used. 
	 */
	init(reset=false) {

		if (typeof this.store.get('config') !== 'undefined') {
			if (!reset) {
				this.config = this.store.get('config');
				return false;
			}
		}

		const config = require('../../../src/js/data/config.json');
		const profile = require('../../../src/js/data/profile.json');
		const mappings = require('../../../src/js/data/mappings.json');

		this.store.set('mappings', mappings);
		this.store.set('profiles', [profile]);
		this.store.set('config', config);

		this.config = this.store.get('config');

		return true;
	}

	/*
	 * migrateConfigZero()
	 * @return bool
	 * Migrates config version 0 to version 1. Separates mappings and profile from core config for easy backups.
	 */
	migrateConfigZero() {

		if (this.config.version !== 0) {
			return false;
		}

		// Migrate to new profile system, will be removed in future releases.
		const profile = require('../../../src/js/data/profile.json');
		const mappings = Clone(this.config.mappings);

		profile.theme 			= this.config.theme;
		profile.map 			= this.config.map;
		profile.chroma 			= this.config.chroma;
		profile.chromaColor 	= this.config.chromaColor;
		profile.alwaysOnTop 	= this.config.alwaysOnTop;
		profile.zoom 			= this.config.zoom;

		// Remove, no longer in config store.
		delete this.config.theme;
		delete this.config.map;
		delete this.config.chroma;
		delete this.config.chromaColor;
		delete this.config.alwaysOnTop;
		delete this.config.zoom;
		delete this.config.mappings;

		this.config.version = 1;
		this.store.set('mappings', mappings);
		this.store.set('profiles', [profile]);
		this.store.set('config', this.config);

		// Reload
		this.config = this.store.get('config');

		return true;

	}

	/*
	 * setBounds(bounds)
	 * @param object bounds
	 * @return object
	 * Sets the current bounds of the window in non-broadcast mode. {x:, y:, height:, width:}. 
	 */
	setBounds(bounds) {
		this.config.bounds = Clone(bounds);
		this.save();
		return bounds;
	}

	/*
	 * getBounds()
	 * @return object
	 * Returns the current bounds of the window when in interface mode. {x:, y:, height:, width:}. Typically used during launch.
	 */
	getBounds() {
		return this.config.bounds;
	}

	/*
	 * toggleInterface()
	 * @return bool
	 * Toggles between interface and broadcast mode.
	 */
	toggleInterface() {
		this.config.interface = !this.config.interface;
		this.save();
		return this.config.interface;
	}

	/*
	 * getInterface()
	 * @return bool
	 * Determines if we're in interface or broadcast mode.
	 */
	getInterface() {
		return this.config.interface;
	}

	/*
	 * toggleInterface()
	 * @return bool
	 * Toggles between having dev tools on or off.
	 */
	toggleDevtools() {
		this.config.devTools = !this.config.devTools;
		this.save();
		return this.config.devTools;
	}

	/*
	 * getInterface()
	 * @return bool
	 * Determines if dev tools are opened.
	 */
	getDevTools() {
		return this.config.devTools;
	}

	/*
	 * setProfile(id)
	 * @param integer id
	 * @return integer
	 * Sets the profile currently being used in OJD
	 */
	setProfile(id) {
		this.config.profile = parseInt(id, 10);
		this.save();
		return this.config.profile;
	}

	/*
	 * getProfile()
	 * @return integer
	 * Returns the profile id set.
	 */
	getProfile() {
		return this.config.profile;
	}

	/*
	 * setUserThemeDirectory(id)
	 * @param string directory
	 * @return string
	 * Sets the custom theme directory.
	 */
	setUserThemeDirectory(directory) {
		this.config.themeUserDirectory = directory;
		this.save();
		return this.config.themeUserDirectory;
	}

	/*
	 * getUserThemeDirectory()
	 * @return string
	 * Returns the current custom theme directory.
	 */
	getUserThemeDirectory() {
		return this.config.themeUserDirectory;
	}

	/*
	 * save()
	 * @return NULL
	 * Saves config object
	 */
	save() {
		this.store.set('config', this.config);
	}

	/*
	 * reset()
	 * @return bool
	 * Alias of init.
	 */
	reset() {
		return this.init(true);
	}


}

module.exports.Config = Config;