const FS = require('fs');
const OJD = window.OJD;

/*
	Class ProfileController
	Renders and binds events to the profile sidebar.
*/
class ProfileController {

	constructor(rootController) {
		this.rootId = '#ojd-profile';
		this.objectIds = {
			profileMenu:'#ojd-profile-current',
			profileCreate:'#ojd-profile-create',
			profileClone:'#ojd-profile-clone',
			profileDelete:'#ojd-profile-delete',
			themeFolder:'#ojd-profile-theme-folder',
			themeFolderLabel:'#ojd-profile-folder-label',
			mapCreate:'#ojd-profile-map-create',
			mapClone:'#ojd-profile-map-clone',
			mapDelete:'#ojd-profile-map-delete'
		};
		this.rootController = rootController;
		this.profiles 		= rootController.profiles;
		this.themes 		= rootController.themes;
		this.mappings 		= rootController.mappings;
	}

	/*
		Rebinds events on render.
	*/
	bindEvents() {

		// Input Events
		$(`${this.rootId} *[ojd-profile-event-input]`).unbind('keyup');
		$(`${this.rootId} *[ojd-profile-event-input]`).unbind('change');
		$(`${this.rootId} *[ojd-profile-event-slider]`).unbind('input');
		$(`${this.rootId} *[ojd-profile-event-select]`).unbind('change');
		$(`${this.rootId} *[ojd-profile-event-toggle]`).unbind('click');
		

		$(`${this.rootId} *[ojd-profile-event-input]`).bind('keyup', this.onInput.bind(this));
		$(`${this.rootId} *[ojd-profile-event-input]`).bind('change', this.onInput.bind(this));
		$(`${this.rootId} *[ojd-profile-event-slider]`).bind('input', this.onInput.bind(this));
		$(`${this.rootId} *[ojd-profile-event-select]`).bind('change', this.onSelect.bind(this));
		$(`${this.rootId} *[ojd-profile-event-toggle]`).bind('click', this.onToggle.bind(this));

		// Static Events
		$(`${this.rootId} ${this.objectIds.profileMenu}`).unbind('change');
		$(`${this.rootId} ${this.objectIds.profileCreate}`).unbind('click');
		$(`${this.rootId} ${this.objectIds.profileClone}`).unbind('click');
		$(`${this.rootId} ${this.objectIds.profileDelete}`).unbind('click');
		$(`${this.rootId} ${this.objectIds.themeFolder}`).unbind('click');
		$(`${this.rootId} ${this.objectIds.mapCreate}`).unbind('click');
		$(`${this.rootId} ${this.objectIds.mapClone}`).unbind('click');
		$(`${this.rootId} ${this.objectIds.mapDelete}`).unbind('click');

		$(`${this.rootId} ${this.objectIds.profileMenu}`).bind('change', this.onChangeProfile.bind(this));
		$(`${this.rootId} ${this.objectIds.profileCreate}`).bind('click', this.onCreateProfile.bind(this));
		$(`${this.rootId} ${this.objectIds.profileClone}`).bind('click', this.onCloneProfile.bind(this));
		$(`${this.rootId} ${this.objectIds.profileDelete}`).bind('click', this.onDeleteProfile.bind(this));
		$(`${this.rootId} ${this.objectIds.themeFolder}`).bind('click', this.onSelectThemeFolder.bind(this));
		$(`${this.rootId} ${this.objectIds.mapCreate}`).bind('click', this.onCreateMap.bind(this));
		$(`${this.rootId} ${this.objectIds.mapClone}`).bind('click', this.onCloneMap.bind(this));
		$(`${this.rootId} ${this.objectIds.mapDelete}`).bind('click', this.onDeleteMap.bind(this));

	}

	/*
	 * onInput(e)
	 * @param event e
	 * @return NULL
	 * When a input field in the sidebar is edited it will update the profile and render the changes.
	 */
	onInput(e) {

		const profile = this.profiles.getCurrentProfile(); //@todo, use getter instead
		const $e = $(e.target);
		const key = $e.attr('ojd-profile-data');
		const value = $e.val();

		if (key.includes('bounds')) {
			const bounds = profile.bounds; //@todo, use getter instead
			const boundsKey = key.replace('bounds.', '');

			if (boundsKey === 'x' || boundsKey === 'y') {
				bounds[boundsKey]=parseInt(value, 10);
				if (isNaN(bounds[boundsKey])) {
					return;
				}
			} else {
				bounds[boundsKey]=Math.abs(parseInt(value, 10));
				if (isNaN(bounds[boundsKey])) {
					return;
				}
			}
		
			this.profiles.setProfileBounds(bounds);
		} else if (key === 'chromaColor'){
			this.profiles.setProfileChromaColor(value);
		} else if (key === 'zoom'){
			this.profiles.setProfileZoom(value);
		} else if (key === 'poll'){
			this.profiles.setProfilePoll(value);
		} else if (key === 'name'){
			this.profiles.setProfileName(value);
		} else {
			return;
		}

		this.render();

	}

	/*
	 * onSelect(e)
	 * @param event e
	 * @return NULL
	 * When a select field in the sidebar is edited it will update the profile and render the changes.
	 */
	onSelect(e) {

		const $e = $(e.target);
		const key = $e.attr('ojd-profile-data');
		const value = $e.val();

		if (key === 'theme') {
			if (value !== '') {
				this.profiles.setProfileTheme(value);
				this.profiles.setProfileThemeStyle(0);
			}
			// @todo add theme.render();
		} else if (key === 'themeStyle') {
			if (value !== '') {
				this.profiles.setProfileThemeStyle(value);
			}
			// @todo add theme.render();
		} else if (key === 'map') {
			this.profiles.setProfileMap(value);
		} else {
			return;
		}

		this.render();
	}

	/*
	 * onToggle(e)
	 * @param event e
	 * @return NULL
	 * When a toggle button in the sidebar is edited it will update the profile and render the changes.
	 */
	onToggle(e) {

		const $e = $(e.target);
		const key = $e.attr('ojd-profile-data');
		const value = $e.val();

		if (key === 'boundsLock') {
			this.profiles.toggleProfileBoundsLock();
		} else if (key === 'chroma') {
			this.profiles.toggleProfileChroma();
		} else if (key === 'alwaysOnTop') {
			this.profiles.toggleProfileAlwaysOnTop();
		} else {
			return;
		}

		this.render();

	}

	/*
	 * onChangeProfile(e)
	 * @param event e
	 * @return NULL
	 * Update current profile
	 */
	onChangeProfile(e) {
		const id = e.target.value;
		this.profiles.setCurrentProfile(id);
		this.render();
	}

	/*
	 * onCreateProfile(e)
	 * @param event e
	 * @return NULL
	 * Update new profile
	 */
	onCreateProfile(e) {
		this.profiles.create();
		this.render();
	}

	/*
	 * onCloneProfile(e)
	 * @param event e
	 * @return NULL
	 * Clone current profile
	 */
	onCloneProfile(e) {
		this.profiles.clone(this.profiles.getCurrentProfileId());
		this.render();
	}

	/*
	 * onDeleteProfile(e)
	 * @param event e
	 * @return NULL
	 * Delete current profile
	 */
	onDeleteProfile(e) {
		if (confirm("Do you wish to delete this profile? This action cannot be undone.")) {
			this.profiles.remove(this.profiles.getCurrentProfileId());
			this.render();
		}
	}

	/*
	 * onCreateMap(e)
	 * @param event e
	 * @return NULL
	 * Create a new mapping
	 */
	onCreateMap(e) {
		const id = this.mappings.create();
		this.profiles.setProfileMap(id);
		this.render();
	}

	/*
	 * onCloneMap(e)
	 * @param event e
	 * @return NULL
	 * Clone current mapping
	 */
	onCloneMap(e) {
		const id = this.mappings.clone(this.profiles.getCurrentProfileMap());
		this.profiles.setProfileMap(id);
		this.render();
	}

	/*
	 * onDeleteMap(e)
	 * @param event e
	 * @return NULL
	 * Delete current mapping
	 */
	onDeleteMap(e) {
		const id = this.mappings.remove(this.profiles.getCurrentProfileMap());
		this.profiles.setProfileMap(id);
		this.render();
	}

	/*
	 * onSelectThemeFolder(e)
	 * @param event e
	 * @return NULL
	 * Updates the user theme folder.
	 */
	onSelectThemeFolder(e) {
		const folder = this.rootController.openDirectoryDialog();
		if (folder !== false) {
			this.themes.setUserThemeDirectory(folder);
			this.render();
		}
	}




	renderCSSOverrides() {

		let css="";

		if (this.profiles.getCurrentProfileChroma()) {
			const chromaColor = this.profiles.getCurrentProfileChromaColor();
			console.log(chromaColor);
			css += `body{background:${chromaColor} !important;}`;
		}

		const zoom = this.profiles.getCurrentProfileZoom();
		if (zoom != 1) {
			css += `#ojd-theme-contents{transform: scale(${zoom/100});}`;
		}

		$("#ojd-profile-css-overrides").html(css);

	}



	renderFields() {

		const profile = this.profiles.getCurrentProfile();
		const $inputs = $(`${this.rootId} *[ojd-profile-event-input]`);
		const $sliders = $(`${this.rootId} *[ojd-profile-event-slider]`)
		const $fields = [...$inputs, ...$sliders];

		// Input Fields
		for(const field of $fields) {
			const $field = $(field);
			const key = $field.attr('ojd-profile-data');
			if (key.includes('bounds')) {
				const keyBounds = key.replace('bounds.', '');
				$field.val(OJD.escapeText(profile.bounds[keyBounds]));
			} else {
				$field.val(OJD.escapeText(profile[key]));
				const label = $field.attr('ojd-profile-data-label');
				if (label) {
					$(`${this.rootId} #ojd-profile-label-${label}`).html(OJD.escapeText(profile[key]));
				}
			}
		}

		// Toggles
		const $toggles = $(`${this.rootId} *[ojd-profile-event-toggle]`);
		for(const toggle of $toggles) {
			const $toggle = $(toggle);
			const key = $($toggle).attr('ojd-profile-data');
			if (profile[key]) {
				$toggle.addClass('ojd-button-active');
			} else {
				$toggle.removeClass('ojd-button-active');
			}
		}

	}

	renderProfilesMenu() {
		const profiles = this.profiles.getProfiles();
		const $menu = $(`${this.rootId} ${this.objectIds.profileMenu}`);
		$menu.html('');
		for (const key in profiles) {
			const profile = profiles[key];
			$menu.append($('<option/>').val(OJD.escapeText(key)).html(OJD.escapeText(profile.name)));
		}
		$menu.val(this.profiles.getCurrentProfileId());
	}

	renderThemesMenu() {

		const profile = this.profiles.getCurrentProfile();
		const themes = this.themes.getThemes();
		const $menu = $(`${this.rootId} select[ojd-profile-data='theme']`);
		const $menuStyle = $(`${this.rootId} select[ojd-profile-data='themeStyle']`);
		$menu.html('');
		$menuStyle.html('');

		/*
			Render Theme Menu
		*/
		$menu.append($('<option/>').val('').html('System Themes:').addClass('ojd-option-header'));
		for (const key in themes) {
			const theme = themes[key];
			if (!theme.user) {
				$menu.append($('<option/>').val(OJD.escapeText(theme.id)).html(OJD.escapeText(theme.name)));
			}
		}
		$menu.append($('<option/>').val('').html('User Themes:').addClass('ojd-option-header'));
		for (const key in themes) {
			const theme = themes[key];
			if (theme.user) {
				$menu.append($('<option/>').val(OJD.escapeText(theme.id)).html(OJD.escapeText(theme.name)));
			}
		}
		$menu.val(profile.theme);

		/*
			Render Theme Styles
		*/
		try {
			const theme = themes[profile.theme];
			if (theme.styles && theme.styles.length !== 0) {
				$menuStyle.parent().show();
				for (const key in theme.styles) {
					const style = theme.styles[key];
					$menuStyle.append($('<option/>').val(key).html(OJD.escapeText(style.name)));
				}
				$menuStyle.val(profile.themeStyle);
			} else {
				$menuStyle.parent().hide();
			}
		} catch {
			console.error("Couldn't load theme style list");
		}

		/* Themes Directory */
		let themeDir = this.themes.getUserThemeDirectory();
		if (themeDir === false) {
			themeDir = 'Currently Not Set';
		}

		$(`${this.rootId} ${this.objectIds.themeFolderLabel}`).html(OJD.escapeText(themeDir));
		
	}

	renderMappingsMenu() {

		const profile = this.profiles.getCurrentProfile();
		const mapppings = this.mappings.getMappings();
		const $menu = $(`${this.rootId} select[ojd-profile-data='map']`);
		$menu.html('');

		for (const key in mapppings) {
			const map = mapppings[key];
			$menu.append($('<option/>').val(key).html(map.name));
		}
		
		$menu.val(profile.map);

	}

	
	render() {
		this.renderProfilesMenu();
		this.renderThemesMenu();
		this.renderMappingsMenu();
		this.renderFields();
		this.renderCSSOverrides();
		this.rootController.reloadTheme();
		this.bindEvents();
	}

	renderInitial() {

		const files = [
			FS.openSync(OJD.appendCwdPath('app/views/components/profile.view.html'), 'r')
		];

		$(this.rootId).html("");
		
		for (const file of files) {
			const html = FS.readFileSync(file, 'UTF-8');
			$(this.rootId).append(html);
			FS.closeSync(file);
		}

		this.render();

	}
}


module.exports.ProfileController = ProfileController;
