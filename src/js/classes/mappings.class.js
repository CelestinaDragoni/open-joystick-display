const Clone = require('clone');

class Mappings {

	constructor(config) {
		this.config = config;
	}

	createNewMapping() {
		this.config.config.mappings.push({"name":"", "button":[], "directional":[], "trigger":[]});
		this.config.save();
		const index = this.config.config.mappings.length - 1;
		this.setMapping(index);
		return index;
	}

	cloneCurrentMapping() {
		const mapping = Clone(this.getCurrentMapping());
		mapping.name = mapping.name + " (Cloned)";
		this.config.config.mappings.push(mapping);
		const index = this.config.config.mappings.length - 1;
		this.config.save();
		this.setMapping(index);
		return index;
	}

	deleteCurrentMapping() {
		const map = this.getCurrentMappingIndex();
		this.config.config.mappings.splice(map, 1);
		this.config.save();
		this.setMapping(0);
		return true;
	}

	updateCurrentMap(mapping) {
		const map = this.getCurrentMappingIndex();
		this.config.config.mappings[map] = mapping;
		this.config.save();
		this.reset();
	}

	getCurrentMapping() {
		const map = this.getCurrentMappingIndex();
		return this.config.config.mappings[map];
	}

	getCurrentMappingIndex() {
		return this.config.config.map;
	}

	getMappings() {
		return this.config.config.mappings;
	}

	setMapping(mappingIndex) {
		this.config.loadMapping(mappingIndex);
		this.reset();
	}

	reset() {
		$(`*[ojd-directional]`).css('top',``);
		$(`*[ojd-directional]`).css('left',``);
		$(`*[ojd-directional]`).removeClass('active');
		$(`*[ojd-button]`).removeClass('active');
		$(`*[ojd-trigger-scale]`).css('height', '');
		$(`*[ojd-trigger-scale-inverted]`).css('height', '');
		$(`*[ojd-trigger]`).removeClass('trigger-active');
		$(`*[ojd-trigger-move]`).css('top', ``);
		$(`*[ojd-trigger-move-inverted]`).css('top', ``);

	}

}
module.exports.Mappings = Mappings;