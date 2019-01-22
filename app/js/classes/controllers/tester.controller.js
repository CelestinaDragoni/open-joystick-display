const FS = require('fs');
const OJD = window.OJD;

/*
	TesterController
	Handles the tester sidebar view and renders the currently connected joystick.
*/
class TesterController {

	constructor(rootController) {
		this.rootId = '#ojd-tester';
		this.objectIds = {
			information:'#ojd-tester-information',
			connected:'#ojd-tester-connected',
			buttons:'#ojd-tester-buttons',
			dimensional:'#ojd-tester-dimensional-axes',
			linear:'#ojd-tester-linear-axes'
		};
		this.templateIds = {
			buttons:'#ojd-tester-buttons-template',
			dimensional:'#ojd-tester-dimensional-axis-template',
			linear:'#ojd-tester-linear-axis-template'
		};

		this.rootController = rootController;
		this.config = rootController.config;
		this.joystick = rootController.joystick;
		
		this.joystickConnected = 
		this.intervalCheckJoystick = false;
	}

	/*
	 * bindEvents()
	 * @return NULL
	 * Binds events, also sets the interval to check for new joysticks.
	 */
	bindEvents() {
		if (!this.intervalCheckJoystick) {
			this.intervalCheckJoystick = setInterval(this.checkController.bind(this), 250);
		}
	}

	/*
	 * checkController()
	 * @return NULL
	 * Checks to see if a controller is connected on interval. Could be simplified in the future
	 */
	checkController() {
		if (this.joystickConnected != this.joystick.joystickConnected) {
			if (this.joystick.joystickConnected) {
				this.joystickConnected = true;
			} else {
				this.joystickConnected = false;
			}
			this.render();
		}
	}

	/*
	 * renderInformation()
	 * @returns NULL
	 * Renders the joystick information currently connected
	 */
	renderInformation() {

		if (!this.joystickConnected) {
			$(this.objectIds.connected).hide();
			$(this.objectIds.information).html('No joystick connected. Please connect a joystick and press a button to activate.');
		} else {
			$(this.objectIds.connected).show();
			$(this.objectIds.information).html(this.joystick.joystickInfo);
		}

	}

	/*
	 * renderButtons()
	 * @returns NULL
	 * Renders the joystick buttons currently connected
	 */
	renderButtons() {
		const wrapper = $(this.objectIds.buttons);
		const template = $(this.templateIds.buttons).html();
		$(wrapper).html('');

		if (!this.joystickConnected) {
			return;
		}

		let html = '';
		const joystick = this.joystick.getJoystick();

		for (const i in joystick.buttons) {
			html += template.replace(/\$\{index\}/g, i);
		}

		$(wrapper).html(html);

	}

	/*
	 * renderDimensional()
	 * @returns NULL
	 * Renders the joystick two dimensional axes currently connected
	 */
	renderDimensional() {
		const wrapper = $(this.objectIds.dimensional);
		const template = $(this.templateIds.dimensional).html();
		$(wrapper).html('');

		if (!this.joystickConnected) {
			return;
		}

		let html = '';
		const joystick = this.joystick.getJoystick();
		const directionalCount = joystick.axes.length/2;
		for (let i=0;i<directionalCount;i++) {
			html += template.replace(/\$\{index\}/g, i);
		}

		$(wrapper).html(html);

	}

	/*
	 * renderLinear()
	 * @returns NULL
	 * Renders the joystick one dimensional axes currently connected
	 */
	renderLinear() {
		const wrapper = $(this.objectIds.linear);
		const template = $(this.templateIds.linear).html();
		$(wrapper).html('');

		if (!this.joystickConnected) {
			return;
		}

		let html = '';
		const joystick = this.joystick.getJoystick();

		for (const i in joystick.axes) {
			html += template.replace(/\$\{index\}/g, i);
		}

		$(wrapper).html(html);
	}

	/*
	 * renderCSSOverrides()
	 * @returns NULL
	 * Renders CSS overrides for the interface based upon if the joystick is connected or not.
	 */
	renderCSSOverrides() {

		let css="";

		if (!this.joystickConnected) {
			css += `#ojd-tester-wrapper{flex: 0 0 95px !important;}`;
		}

		$("#ojd-tester-css-overrides").html(css);

	}

	/*
	 * render()
	 * @return NULL
	 * General renderer
	 */	
	render() {
		this.renderButtons();
		this.renderDimensional();
		this.renderLinear();
		this.renderInformation();
		this.renderCSSOverrides();
		this.bindEvents();
	}

	/*
	 * renderInitial()
	 * @return NULL
	 * Initial render called by rootController
	 */	
	renderInitial() {

		const files = [
			FS.openSync(OJD.appendCwdPath('app/views/components/tester.view.html'), 'r')
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


module.exports.TesterController = TesterController;
