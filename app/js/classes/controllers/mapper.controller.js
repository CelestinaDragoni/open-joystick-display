const FS = require('fs');
const OJD = window.OJD;

/*
	MapperController
	Handles the mapper sidebar view and allows for custom user mappings.
*/
class MapperController {

	constructor(rootController) {
		this.rootId = '#ojd-mapper';
		this.objectIds = {
			name:'#ojd-mapper-name',
			buttonsCount:'#ojd-mapper-buttons-count',
			axesCount:'#ojd-mapper-axes-count',
			triggersCount:'#ojd-mapper-triggers-count',
			buttonsGroup:'#ojd-buttons-group',
			directionalsGroup:'#ojd-directionals-group',
			triggerGroup:'#ojd-triggers-group',
			triggerFixedGroup:'#ojd-triggers-fixed-group'

		};
		this.templateIds = {
			button:'#ojd-mapper-button-template',
			directional:'#ojd-mapper-directional-template',
			trigger:'#ojd-mapper-trigger-template',
			triggerFixed:'#ojd-mapper-trigger-fixed-template',
			buttonsSelect:'#ojd-mapper-button-options-template',
            invertSelect:'#ojd-mapper-invert-options-template'
		}
		this.rootController = rootController;

		this.mappings = rootController.mappings;
		this.profiles = rootController.profiles;

	}

	/*
	 * bindActions()
	 * @return NULL
	 * Binds actions on render
	 */
	bindActions() {
		$(`${this.rootId} select`).unbind('change');
		$(`${this.rootId} input`).unbind('change');
		$(`${this.rootId} input`).unbind('keyup');
		$(`${this.rootId} .ojd-button-toggle`).unbind('click');
		$(`${this.rootId} .ojd-button-add`).unbind('click');
		$(`${this.rootId} .ojd-button-delete`).unbind('click');

		$(`${this.rootId} select`).bind('change', this.onUpdate.bind(this));
		$(`${this.rootId} input`).bind('change', this.onUpdate.bind(this));
		$(`${this.rootId} input`).bind('keyup', this.onUpdate.bind(this));
		$(`${this.rootId} .ojd-button-toggle`).bind('click', this.onUpdate.bind(this));
		$(`${this.rootId} .ojd-button-add`).bind('click', this.onAdd.bind(this));
		$(`${this.rootId} .ojd-button-delete`).bind('click', this.onDelete.bind(this));
	}

	/*
	 * onUpdate(e)
	 * @param event e
	 * @return NULL
	 * Updates the mapping and renders the mapper and current profile
	 */
	onUpdate(e) {

		const $target = $(e.currentTarget);
		const mapid = this.profiles.getCurrentProfileMap();
		const mapping = this.profiles.getCurrentProfileMapping();
		const group = $target.attr('ojd-map-group');
		const field = $target.attr('ojd-map-field');
		const index = parseInt($target.attr('ojd-map-index'));

		let doRender = true;
		let value = '';

		if (group == 'button') {
			if (field === 'button') {
				mapping.button[index].button = OJD.escapeText($target.val());
			}
			if (field === 'index') {
				value = parseInt($target.val());
				mapping.button[index].index = value;
				doRender=false;
			}
		}

		if (group == 'directional') {
			if (field === 'axisX') {
				value = parseInt($target.val(), 10);
				mapping.directional[index].axes[0] = value;
				doRender=false;
			}
			if (field === 'axisY') {
				value = parseInt($target.val(), 10);
				mapping.directional[index].axes[1] = value;
				doRender=false;
			}
			if (field === 'deadzone') {
				value = parseFloat($target.val(), 0);
				mapping.directional[index].deadzone = value;
				doRender=false;
			}
			if (field === 'dpad') {
				if (!$target.hasClass("ojd-button-active")) {
					mapping.directional[index].dpad = true;
				} else {
					mapping.directional[index].dpad = false;
				}
			}
			if (field === 'cpad') {
				if (!$target.hasClass("ojd-button-active")) {
					mapping.directional[index].cpad = true;
				} else {
					mapping.directional[index].cpad = false;
				}
			}
			if (field === 'infinity') {
				if (!$target.hasClass("ojd-button-active")) {
					mapping.directional[index].infinity = true;
				} else {
					mapping.directional[index].infinity = false;
				}
			}
		} 

		if (group == 'trigger') {
			if (field === 'axis') {
				value = parseInt($target.val(), 10);
				mapping.trigger[index].axis = value;
				doRender=false;
			}
			if (field === 'min') {
				value = parseFloat($target.val());
				mapping.trigger[index].range[0] = value;
				doRender=false;
			}
			if (field === 'max') {
				value = parseFloat($target.val());
				mapping.trigger[index].range[1] = value;
				doRender=false;
			}
            if (field === 'degrees') {
                value = parseInt($target.val());
                mapping.trigger[index].degrees = value;
                doRender=false;
            }
            if (field === 'invert') {
                value = parseInt($target.val());
                mapping.trigger[index].invert = value;
                doRender=false;
            }
			if (field === 'button') {
				if ($target.val() === '') {
					mapping.trigger[index].button = false;
				} else {
					mapping.trigger[index].button = OJD.escapeText($target.val());
				}
			}
		}

		if (group == 'trigger-fixed') {
			if (field === 'axis') {
				value = parseInt($target.val(), 10);
				mapping.triggerFixed[index].axis = value;
				doRender=false;
			}
			if (field === 'val') {
				value = parseFloat($target.val());
				mapping.triggerFixed[index].val = value;
				doRender=false;
			}
			if (field === 'button1') {
				if ($target.val() === '') {
					mapping.triggerFixed[index].button1 = false;
				} else {
					mapping.triggerFixed[index].button1 = OJD.escapeText($target.val());
				}
			}
			if (field === 'button2') {
				if ($target.val() === '') {
					mapping.triggerFixed[index].button2 = false;
				} else {
					mapping.triggerFixed[index].button2 = OJD.escapeText($target.val());
				}
			}
		}

		if (group == 'global') {
			if (field === 'name') {
				mapping.name = OJD.escapeText($target.val());
			}
		} 

		this.mappings.update(mapid, mapping);
		this.mappings.reset();
		this.rootController.reloadProfile();

		if (doRender) {
			this.render();
		}

	}

	/*
	 * onAdd(e)
	 * @param event e
	 * @return NULL
	 * Adds a button, directional, or trigger and renders.
	 */	
	onAdd(e) {
		const $target = $(e.currentTarget);
		const mapid = this.profiles.getCurrentProfileMap();
		const mapping = this.profiles.getCurrentProfileMapping();
		const group = $target.attr('ojd-map-group');
		const field = $target.attr('ojd-map-field');

		if (group == 'button') {
			mapping.button.push({button:"A", index:0});
		} else if (group == 'directional') {
			mapping.directional.push({axes:[0,1], deadzone:.25, dpad:false, cpad:false});
		} else if (group == 'trigger') {
			mapping.trigger.push({axis:0, range:[-1,1], button:false});
		} else if (group == 'trigger-fixed') {
			mapping.triggerFixed.push({axis:0, val:0, button1:false, button2:false});
		}

		this.mappings.update(mapid, mapping);
		this.mappings.reset();
		this.rootController.reloadProfile();
		this.render();

	}

	/*
	 * onDelete(e)
	 * @param event e
	 * @return NULL
	 * Deletes a button, directional, or trigger and renders.
	 */
	onDelete(e) {

		const $target = $(e.currentTarget);
		const mapid = this.profiles.getCurrentProfileMap();
		const mapping = this.profiles.getCurrentProfileMapping();
		const group = $target.attr('ojd-map-group');
		const field = $target.attr('ojd-map-field');
		const index = parseInt($target.attr('ojd-map-index'));

		if (group == 'button') {
			mapping.button.splice(index, 1);;
		} else if (group == 'directional') {
			mapping.directional.splice(index, 1);
		} else if (group == 'trigger') {
			mapping.trigger.splice(index, 1);
		} else if (group == 'trigger-fixed') {
			mapping.triggerFixed.splice(index, 1);
		}

		this.mappings.update(mapid, mapping);
		this.mappings.reset();
		this.rootController.reloadProfile();
		this.render();

	}

	/*
	 * renderInformation()
	 * @return NULL
	 * Renders the information at the top of the mapper.
	 */
	renderInformation() {
		const mapping = this.profiles.getCurrentProfileMapping();
		$(this.objectIds.name).val(mapping.name);
		$(this.objectIds.buttonsCount).html(mapping.button.length);
		$(this.objectIds.axesCount).html(mapping.directional.length);
		$(this.objectIds.triggersCount).html(mapping.trigger.length);
	}

	/*
	 * renderButtons()
	 * @return NULL
	 * Renders the mapping buttons
	 */
	renderButtons() {
		const mapping = this.profiles.getCurrentProfileMapping();
		const wrapper = $(this.objectIds.buttonsGroup);
		const template = $(this.templateIds.button).html();
		const selectTemplate = $(this.templateIds.buttonsSelect).html();

		$(wrapper).html('');
		for(const i in mapping.button) {
			const button = mapping.button[i];
			let t = template;
			t = t.replace(/\$\{select\}/g, selectTemplate);
			t = t.replace(/\$\{index\}/g, button.index);
			t = t.replace(/\$\{i\}/g, i);
			$(wrapper).append(t);
			$(`*[ojd-map-index='${i}'] select`, wrapper).val(button.button);
		}
	}

	/*
	 * renderDirectionals()
	 * @return NULL
	 * Renders the mapping directionals
	 */
	renderDirectionals() {
		const mapping = this.profiles.getCurrentProfileMapping();
		const wrapper = $(this.objectIds.directionalsGroup);
		const template = $(this.templateIds.directional).html();

		$(wrapper).html('');
		for(const i in mapping.directional) {
			const directional = mapping.directional[i];
			let t = template;
			t = t.replace(/\$\{x\}/g, directional.axes[0]);
			t = t.replace(/\$\{y\}/g, directional.axes[1]);
			t = t.replace(/\$\{deadzone\}/g, directional.deadzone);
			t = t.replace(/\$\{dpad\}/g, directional.dpad ? 'ojd-button-active' : '');
			t = t.replace(/\$\{cpad\}/g, directional.cpad ? 'ojd-button-active' : '');
			t = t.replace(/\$\{infinity\}/g, directional.infinity ? 'ojd-button-active' : '');
			t = t.replace(/\$\{i\}/g, i);
			$(wrapper).append(t);
		}
	}

	/*
	 * renderTriggers()
	 * @return NULL
	 * Renders the mapping triggers
	 */
	renderTriggers() {
		const mapping = this.profiles.getCurrentProfileMapping();
		const wrapper = $(this.objectIds.triggerGroup);
		const template = $(this.templateIds.trigger).html();
		const selectTemplate = $(this.templateIds.buttonsSelect).html();
        const selectInvertTemplate = $(this.templateIds.invertSelect).html();

		$(wrapper).html('');
		for(const i in mapping.trigger) {
			const trigger = mapping.trigger[i];
            const degrees = (trigger.degrees) ? parseInt(trigger.degrees) : '180';
			
            let t = template;
			t = t.replace(/\$\{axis\}/g, trigger.axis);
			t = t.replace(/\$\{min\}/g, trigger.range[0]);
			t = t.replace(/\$\{max\}/g, trigger.range[1]);
            t = t.replace(/\$\{degrees\}/g, degrees);
			t = t.replace(/\$\{select\}/g, selectTemplate);
            t = t.replace(/\$\{selectInvert\}/g, selectInvertTemplate);
			t = t.replace(/\$\{i\}/g, i);
			$(wrapper).append(t);
			if (trigger.button) {
				$(`*[ojd-map-index='${i}'] select.ojd-trgger-select-button`, wrapper).val(trigger.button);
			}
            if (trigger.invert) {
                $(`*[ojd-map-index='${i}'] select.ojd-trigger-select-invert`, wrapper).val(trigger.invert);
            }
		}
	}

	/*
	 * renderFixedTriggers()
	 * @return NULL
	 * Renders the mapping triggers
	 */
	renderFixedTriggers() {

		const mapping = this.profiles.getCurrentProfileMapping();
		const wrapper = $(this.objectIds.triggerFixedGroup);
		const template = $(this.templateIds.triggerFixed).html();
		const selectTemplate = $(this.templateIds.buttonsSelect).html();

		$(wrapper).html('');

		for(const i in mapping.triggerFixed) {
			const trigger = mapping.triggerFixed[i];
			let t = template;
			t = t.replace(/\$\{axis\}/g, trigger.axis);
			t = t.replace(/\$\{val\}/g, trigger.val);
			t = t.replace(/\$\{button1\}/g, trigger.button1);
			t = t.replace(/\$\{button2\}/g, trigger.button2);
			t = t.replace(/\$\{select\}/g, selectTemplate);
			t = t.replace(/\$\{i\}/g, i);
			$(wrapper).append(t);
			if (trigger.button1) {
				$(`*[ojd-map-index='${i}'] select[ojd-map-field=button1]`, wrapper).val(trigger.button1);
			}
			if (trigger.button2) {
				$(`*[ojd-map-index='${i}'] select[ojd-map-field=button2]`, wrapper).val(trigger.button2);
			}
		}

	}

	/*
	 * render()
	 * @return NULL
	 * General renderer
	 */	
	render() {
		this.renderInformation();
		this.renderButtons();
		this.renderDirectionals();
		this.renderTriggers();
		this.renderFixedTriggers();
		this.bindActions();
	}

	/*
	 * renderInitial()
	 * @return NULL
	 * Initial render called by rootController
	 */	
	renderInitial() {

		const files = [
			FS.openSync(OJD.appendCwdPath('app/views/components/mapper.view.html'), 'r')
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


module.exports.MapperController = MapperController;
