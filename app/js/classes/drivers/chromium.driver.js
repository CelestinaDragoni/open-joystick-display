const Clone 		= require('clone');
const OJD 			= window.OJD;

class ChromiumDriver {

	constructor(handler) {

		// Joystick Properties
		this.joystickConnected = false;
		this.joystickInfo = '';

		this.ready = true;
		this.handler = handler;

		// Load Event Listeners
		window.addEventListener("gamepadconnected", this.connectJoystick.bind(this));
		window.addEventListener("gamepaddisconnected", this.disconnectJoystick.bind(this));

	}

	setActive() {
		// Do nothing.
	}

	setInactive() {
		// Do nothing.
	}

	connectJoystick(e) {
		if (!this.joystickConnected) {
			const joystick = navigator.getGamepads()[e.gamepad.index];
			this.joystickConnected = true;
			this.joystickIndex = e.gamepad.index;
			this.joystickInfo = `${joystick.id}: ${joystick.buttons.length} Buttons, ${joystick.axes.length} Axes.`;
		}
	}

	disconnectJoystick() {
		this.joystickIndex = false;
		this.joystickConnected = false;
		this.joystickInfo = '';
	}

	isConnected() {
		return this.joystickConnected;
	}

	getJoystick() {
		if (this.joystickConnected) {
			return navigator.getGamepads()[this.joystickIndex];
		}
		return false;
	}

	getInformation() {
		if (this.joystickConnected) {
			return this.joystickInfo;
		} else {
			return 'No joystick connected. Please connect a joystick and press a button to activate.';
		}
	}

	async initPorts() {
		return true;
	}

	getPorts() {
		return false;
	}

	getDevices() {
		return false;
	}

}

module.exports.ChromiumDriver = ChromiumDriver;