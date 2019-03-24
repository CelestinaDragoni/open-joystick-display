const Clone 		= require('clone');
const OJD 			= window.OJD;
const NET 			= require('net');
const JSONSocket 	= require('json-socket');

// Handles OJD server requests from another PC.
class NetworkDriver {

	constructor(handler) {

		// Joystick Properties
		this.joystickConnected = false;
		this.joystickInfo = '';

		this.ready 		= true;
		this.handler 	= handler;
		this.uri 		= null;

		// Load Ports
		this.initPorts();

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

	getPorts() {
		return this.ports;
	}

	getDevices() {
		return false;
	}

	initPorts() {

	}

}

module.exports.NetworkDriver = NetworkDriver;