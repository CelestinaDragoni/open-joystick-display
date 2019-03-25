const Clone 			= require('clone');
const OJD 				= window.OJD;

// Handles OJD server requests from another PC.
class NetworkDriver {

	constructor(handler) {

		// Joystick Properties
		this.driverActive = false;
		this.joystickDefault = {connected:false, axes:[], buttons:[]};
		this.joystick = Clone(this.joystickDefault);
		this.joystickConnected = false;
		this.joystickInfo = '';

		this.ready 		= true;
		this.handler 	= handler;
		this.uri 		= null;

		this.serverInterval = null;

	}

	setActive(port, device, uri) {
		this.uri = `http://${uri}`;
		this.driverActive = true;
		this.checkJoystick(this);
	}

	setInactive() {
		this.driverActive = false;
		this.joystick = Clone(this.joystickDefault);
		this.joystickConnected = false;
		this.joystickInfo = '';
		this.uri = null;
	}

	async checkJoystick() {
		const response = await this.doRequest("GET", this.uri);
		if (response && response.connected) {
			this.joystick = response;
			if (!this.joystickConnected) {
				this.joystickConnected = true;
				this.joystickInfo = `${this.joystick.id}: ${this.joystick.buttons.length} Buttons, ${this.joystick.axes.length} Axes.`;
			}
		} else {
			this.joystick = Clone(this.joystickDefault);
			this.joystickConnected = false;
			this.joystickInfo = '';
		}
		await this.doSleep(10); // Gets a bit CPU heavy
		this.checkJoystick();
	}

	doSleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	doRequest(method, url) {
		return fetch(url).then(function(response) {
			return response.json();
		});
	}

	isConnected() {
		return this.joystickConnected;
	}

	getJoystick() {
		if (this.joystickConnected) {
			return this.joystick;
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
		return false;
	}

	getDevices() {
		return false;
	}


}

module.exports.NetworkDriver = NetworkDriver;