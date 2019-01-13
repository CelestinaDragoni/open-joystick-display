const Store = require('electron-store');
const Clone = require('clone');

class Profiles {

	constructor(config) {
		this.config = config;
		this.profiles = this.store.get('profiles');
	}

	/*
		Getters
	*/
	getCurrentProfile() {
		return this.profile;
	}

	getCurrentProfileId() {
		return this.config.getProfile();
	}

	getCurrentProfileMapping() {
		return this.mappings.getMapping(this.config.getProfile());
	}

	getCurrentProfileMap() {
		return this.profile.map;
	}

	getCurrentProfileTheme() {

	}

	getCurrentProfileAlwaysOnTop() {

	}

	getCurrentProfileChroma() {

	}

	getCurrentProfileChromaColor() {

	}

	getCurrentProfileZoom() {

	}

	getProfile(id) {
		id = parseInt(id, 10);
		return this.profiles[id];
	}

	/* 
	 	Setters
	*/

	setCurrentProfile(id) {
		id = this.config.setProfile(id);
		this.profile = this.profiles[id];
		return this.profile;
	}

	setProfileMap(id) {

	}

	setProfileTheme(id) {

	}

	setProfileThemeStyle(id) {

	}

	setProfileAlwaysOnTop(id) {

	}

	setProfileChroma(id) {

	}

	setProfileChromaColor(id) {

	}

	setProfileZoom(id) {

	}

	/*
		Operators
	*/
	create() {
		const id = this.profiles.length; // Will always be one ahead. Thanks zero index;
		const profile = require('../../../src/js/data/profile.json');
		this.profiles.push(profile);
		this.setCurrentProfile(id);
		this.save();
	}

	clone(id) {
		const id = this.profiles.length;
		const profile = Clone(this.getProfile(id));

		this.profiles.push(profile);
		this.setCurrentProfile(id);
		this.save();
	}

	remove(id) {
		this.profiles.splice(id, 1);
		this.setCurrentProfile(0);
		this.save();
	}

	save() {
		this.store.set('profiles', this.profiles);
	}

}

module.exports.Profiles = Profiles;