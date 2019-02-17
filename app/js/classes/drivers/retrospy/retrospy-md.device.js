const Clone = require('clone');
class RetroSpyDevice_MD {

	constructor(profile) {
		this.resetJoystick();
		this.joystickInfo = "RetroSpy Ardunio Sega Master System / Mega Drive (Genesis). 13 Buttons, 0 Axes";
	}

	resetJoystick() {
		// Emulates Chromium Gamepad Modal
		this.joystick = Clone({
			axes:[],
			buttons: [
				{pressed:false, value:0},
				{pressed:false, value:0},
				{pressed:false, value:0},
				{pressed:false, value:0},
				{pressed:false, value:0},
				{pressed:false, value:0},
				{pressed:false, value:0},
				{pressed:false, value:0},
				{pressed:false, value:0},
				{pressed:false, value:0},
				{pressed:false, value:0},
				{pressed:false, value:0},
				{pressed:false, value:0}
			]
		});
	}

	getJoystick() {
		return this.joystick;
	}

	getInformation() {
		return this.joystickInfo;
	}

	read(line) {
		const b = [...line];
		for (const i in b) {
			if (this.joystick.buttons[i]) {
				if (b[i] === '1') {
					this.joystick.buttons[i] = {pressed:true, value:1};
				} else {
					this.joystick.buttons[i] = {pressed:false, value:0};
				}
			}
		}
	}


}

module.exports.RetroSpyDevice_MD = RetroSpyDevice_MD;