const FS = require('fs');
const { remote } = require('electron');
const dialog = remote.require('electron').dialog;

class InterfaceMapper {

	constructor(config, joystick, themes, mappings) {

		this.config = config;
		this.joystick = joystick;
		this.themes = themes;
		this.mappings = mappings;

		this.mapping = this.mappings.getCurrentMapping();
		this.mappingIndex = this.mappings.getCurrentMappingIndex();

	}

	escape(text) {
		return $("<div>").text(text).html();
	}

	bindInterfaceActions() {
		$("#ojd-select-mapping").bind('change', this.actionLoadMapping.bind(this));
		$("#ojd-map-new").bind('click', this.actionNew.bind(this));
		$("#ojd-map-clone").bind('click', this.actionClone.bind(this));
		$("#ojd-map-delete").bind('click', this.actionDelete.bind(this));
	}

	bindActions() {
		this.unbindActions();
		$("#ojd-interface-map select").bind('change', this.actionUpdateField.bind(this));
		$("#ojd-interface-map input").bind('change', this.actionUpdateField.bind(this));
		$("#ojd-interface-map input").bind('keyup', this.actionUpdateField.bind(this));
		$("#ojd-interface-map #ojd-add-button").bind('click', this.actionAddButton.bind(this));
		$("#ojd-interface-map #ojd-add-directional").bind('click', this.actionAddDirectional.bind(this));
		$("#ojd-interface-map #ojd-add-trigger").bind('click', this.actionAddTrigger.bind(this));

		$("#ojd-interface-map .ojd-delete-button").bind('click', this.actionDeleteButton.bind(this));
		$("#ojd-interface-map .ojd-delete-directional").bind('click', this.actionDeleteDirectional.bind(this));
		$("#ojd-interface-map .ojd-delete-trigger").bind('click', this.actionDeleteTrigger.bind(this));
	}

	unbindActions() {

		// Inputs
		$("#ojd-interface-map select").unbind('change');
		$("#ojd-interface-map input").unbind('change');
		$("#ojd-interface-map input").unbind('keyup');

		// Buttons
		$("#ojd-interface-map #ojd-add-button").unbind('click');
		$("#ojd-interface-map #ojd-add-directional").unbind('click');
		$("#ojd-interface-map #ojd-add-trigger").unbind('click');

		$("#ojd-interface-map .ojd-delete-button").unbind('click');
		$("#ojd-interface-map .ojd-delete-directional").unbind('click');
		$("#ojd-interface-map .ojd-delete-trigger").unbind('click');
	}


	actionNew(e) {
		this.mappings.createNewMapping();
		this.mapping = this.mappings.getCurrentMapping();
		this.mappingIndex = this.mappings.getCurrentMappingIndex();
		this.renderContents();
	}

	actionClone(e) {
		this.mappings.cloneCurrentMapping();
		this.mapping = this.mappings.getCurrentMapping();
		this.mappingIndex = this.mappings.getCurrentMappingIndex();
		this.renderContents();
	}

	actionDelete(e) {
		const mappingsCount = this.mappings.getMappings().length;

		if (mappingsCount === 1) {
			alert("You cannot delete your last mapping. Make a new one and try again.");
			return false;
		}

		if (confirm(`Do you wish to delete mapping: \n${this.mapping.name}\nThis action cannot be undone.`)) {
			this.mappings.deleteCurrentMapping();
		}

		this.mapping = this.mappings.getCurrentMapping();
		this.mappingIndex = this.mappings.getCurrentMappingIndex();
		this.renderContents();
	}

	actionLoadMapping(e) {

		const id = parseInt($(e.target).val());

		this.mappings.setMapping(id);
		this.mapping = this.mappings.getCurrentMapping();
		this.mappingIndex = this.mappings.getCurrentMappingIndex();

		this.renderContents();

	}

	actionUpdateField(e) {

		const $target = $(e.target);
		const mapping = this.mapping;
		const group = $target.attr('ojd-group');
		const field = $target.attr('ojd-field');
		const index = parseInt($target.attr('ojd-map-index'));

		if (group == 'button') {
			if (field === 'button') {
				mapping.button[index].button = $target.val();
			}
			if (field === 'index') {
				mapping.button[index].index = parseInt($target.val());
			}
		}

		if (group == 'directional') {
			if (field === 'axisX') {
				mapping.directional[index].axes[0] = parseInt($target.val());
			}
			if (field === 'axisY') {
				mapping.directional[index].axes[1] = parseInt($target.val());
			}
			if (field === 'deadzone') {
				mapping.directional[index].index = parseFloat($target.val());
			}
			if (field === 'dpad') {
				if ($target.is(":checked")) {
					mapping.directional[index].dpad = true;
				} else {
					mapping.directional[index].dpad = false;
				}
			}
			if (field === 'cpad') {
				if ($target.is(":checked")) {
					mapping.directional[index].cpad = true;
				} else {
					mapping.directional[index].cpad = false;
				}
			}
		} 

		if (group == 'trigger') {
			if (field === 'axis') {
				mapping.trigger[index].axis = parseInt($target.val());
			}
			if (field === 'min') {
				mapping.trigger[index].range[0] = parseFloat($target.val());
			}
			if (field === 'max') {
				mapping.trigger[index].range[1] = parseFloat($target.val());
			}
			if (field === 'button') {
				if ($target.val() === '') {
					mapping.trigger[index].button = false;
				} else {
					mapping.trigger[index].button = $target.val();
				}
			}
		}

		if (group == 'global') {
			if (field === 'name') {
				mapping.name = this.escape($target.val());
			}
		} 

		this.mappings.updateCurrentMap(mapping);
		this.mapping = this.mappings.getCurrentMapping();

		this.renderInterfaceMenu();

	}

	// Button Actions
	actionAddButton(e) {
		const mapping = this.mapping;
		mapping.button.push({button:"A", index:0});
		this.mappings.updateCurrentMap(mapping);
		this.mapping = this.mappings.getCurrentMapping();
		this.renderContents();
	}

	actionDeleteButton(e) {
		const mapping = this.mapping;
		const $target = $(e.currentTarget);
		const index = parseInt($target.attr('ojd-map-index'));
		mapping.button.splice(index, 1);
		this.mappings.updateCurrentMap(mapping);
		this.mapping = this.mappings.getCurrentMapping();
		this.renderContents();
	}

	// Directional Actions
	actionAddDirectional(e) {
		const mapping = this.mapping;
		mapping.directional.push({axes:[0,1], deadzone:.25, dpad:false, cpad:false});
		this.mappings.updateCurrentMap(mapping);
		this.mapping = this.mappings.getCurrentMapping();
		this.renderContents();
	}

	actionDeleteDirectional(e) {
		const mapping = this.mapping;
		const $target = $(e.currentTarget);
		const index = parseInt($target.attr('ojd-map-index'));
		mapping.directional.splice(index, 1);
		this.mappings.updateCurrentMap(mapping);
		this.mapping = this.mappings.getCurrentMapping();
		this.renderContents();
	}


	// Triggers
	actionAddTrigger(e) {
		const mapping = this.mapping;
		mapping.trigger.push({axis:0, range:[-1,1], button:false});
		this.mappings.updateCurrentMap(mapping);
		this.mapping = this.mappings.getCurrentMapping();
		this.renderContents();
	}

	actionDeleteTrigger(e) {
		const mapping = this.mapping;
		const $target = $(e.currentTarget);
		const index = parseInt($target.attr('ojd-map-index'));
		mapping.trigger.splice(index, 1);
		this.mappings.updateCurrentMap(mapping);
		this.mapping = this.mappings.getCurrentMapping();
		this.renderContents();
	}

	renderInterfaceMenu() {

		// Fetch Stuff
		const $element = $("#ojd-select-mapping");
		const mappings = this.mappings.getMappings();

		// Clear Element
		$element.html('');

		// Create Options
		for (const key in mappings) {
			const mapping = mappings[key];
			const name = mapping.name === '' ? 'Untitled Mapping' : mapping.name;
			$element.append($('<option/>').val(key).html(name));
		}

		// Set Current Mapping Selected.
		$element.val(this.mappingIndex);

	}

	renderContents() {

		const mapping = this.mapping;
		const buttonSelectHtml = $("#ojd-template-mapper-button-options").html();

		$("#ojd-mapper-name").val(mapping.name);
		$("#ojd-mapper-buttons-count").html(mapping.button.length);
		$("#ojd-mapper-directional-count").html(mapping.directional.length);
		$("#ojd-mapper-trigger-count").html(mapping.trigger.length);

		let $buttonsWrapper 		= $("#ojd-mapper-buttons");
		let $directionalsWrapper 	= $("#ojd-mapper-directionals");
		let $triggersWrapper 		= $("#ojd-mapper-triggers");

		$buttonsWrapper.html('');
		for(const i in mapping.button) {
			const button = mapping.button[i];
			let t = $("#ojd-template-mapper-button-row").html();
			t = t.replace(/\$\{select\}/g, buttonSelectHtml);
			t = t.replace(/\$\{index\}/g, button.index);
			t = t.replace(/\$\{i\}/g, i);
			$($buttonsWrapper).append(t);
			$(`*[ojd-map-index='${i}'] select`, $buttonsWrapper).val(button.button);
		}

		$directionalsWrapper.html('');
		for(const i in mapping.directional) {
			const directional = mapping.directional[i];
			let t = $("#ojd-template-mapper-directional-row").html();
			t = t.replace(/\$\{x\}/g, directional.axes[0]);
			t = t.replace(/\$\{y\}/g, directional.axes[1]);
			t = t.replace(/\$\{deadzone\}/g, directional.deadzone);
			t = t.replace(/\$\{dpad\}/g, directional.dpad ? 'checked' : '');
			t = t.replace(/\$\{cpad\}/g, directional.cpad ? 'checked' : '');
			t = t.replace(/\$\{i\}/g, i);
			$($directionalsWrapper).append(t);
		}

		$triggersWrapper.html('');
		for(const i in mapping.trigger) {
			const trigger = mapping.trigger[i];
			let t = $("#ojd-template-mapper-trigger-row").html();
			t = t.replace(/\$\{axis\}/g, trigger.axis);
			t = t.replace(/\$\{min\}/g, trigger.range[0]);
			t = t.replace(/\$\{max\}/g, trigger.range[1]);
			t = t.replace(/\$\{select\}/g, buttonSelectHtml);
			t = t.replace(/\$\{i\}/g, i);
			$($triggersWrapper).append(t);
		}

		this.bindActions();
		this.renderInterfaceMenu();

	}

	render() {

		const files = [
			FS.openSync(`${window.cwd}/src/views/interfaceMapper.view.html`, 'r')
		];

		for (const file of files) {
			const html = FS.readFileSync(file, 'UTF-8');
			$("body").append(html);
			FS.closeSync(file);
		}

		

		this.bindInterfaceActions();
		this.renderContents();


	}

}

module.exports.InterfaceMapper = InterfaceMapper;