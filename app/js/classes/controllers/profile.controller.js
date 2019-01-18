const FS = require('fs');
const OJD = window.OJD;

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
			mapDelete:'#ojd-profile-map-delete',
			profileZoomLabel:'#ojd-profile-zoom-label',
			profilePollLabel:'#ojd-profile-poll-label'
		};
		this.rootController = rootController;
		this.profiles = rootController.profiles;
	}

	bindEvents() {
		$(`${this.rootId} *[ojd-profile-event-input]`).unbind('keyup');
		$(`${this.rootId} *[ojd-profile-event-input]`).unbind('change');
		$(`${this.rootId} *[ojd-profile-event-select]`).unbind('change');
		$(`${this.rootId} *[ojd-profile-event-toggle]`).unbind('click');

		$(`${this.rootId} *[ojd-profile-event-input]`).bind('keyup', this.onInput.bind(this));
		$(`${this.rootId} *[ojd-profile-event-input]`).bind('change', this.onInput.bind(this));
		$(`${this.rootId} *[ojd-profile-event-select]`).bind('change', this.onSelect.bind(this));
		$(`${this.rootId} *[ojd-profile-event-toggle]`).bind('click', this.onToggle.bind(this));
	}

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

	onSelect(e) {

		const $e = $(e.target);
		const key = $e.attr('ojd-profile-data');
		const value = $e.val();

		if (key === 'theme') {
			if (value !== '') {
				this.profiles.setProfileTheme(value);
				this.profiles.setProfileThemeStyle(0);
			}
		} else if (key === 'themeStyle') {
			if (value !== '') {
				this.profiles.setProfileThemeStyle(value);
			}
		} else if (key === 'map') {
			this.profiles.setProfileMap(value);
		} else {
			return;
		}

		this.render();
	}

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

	onChangeProfile() {

	}

	onCreateProfile() {

	}

	onCloneProfile() {

	}

	onDeleteProfile() {

	}

	onChangeMap() {

	}

	onCreateMap() {

	}

	onCloneMap() {

	}

	onDeleteMap() {

	}

	onSelectTheme() {

	}

	onSelectThemeStyle() {

	}

	onSelectThemeFolder() {

	}

	onColorPicker() {


	}




	renderFields() {

		const profile = this.profiles.getCurrentProfile();
		const $fields = $(`${this.rootId} *[ojd-profile-event-input]`);
	
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

	}

	renderThemesMenu() {

		const profile = this.profiles.getCurrentProfile();
		const themes = this.rootController.themes.getThemes();
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
	
	}

	renderMappingsMenu() {

		const profile = this.profiles.getCurrentProfile();
		const mapppings = this.rootController.mappings.getMappings();
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
