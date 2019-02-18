const Clone = require('clone');

/*
	RetroSpyDevice_MD
	Parses the input from a master system or mega drive controller and parses it into an chromium gamepad response.

	Original implementation:
	Original NintendoSpy implementation by Jeremy Burns (jaburns). https://github.com/jaburns/NintendoSpy
	RetroSpy fork by Christopher J. Mallery (zoggins). https://github.com/zoggins/RetroSpy

	RetroSpy Copyright 2018 Christopher J. Mallery <http://www.zoggins.net> NintendoSpy Copyright (c) 2014 Jeremy Burns
	LICENSE: https://github.com/zoggins/RetroSpy/blob/master/LICENSE
	
	Open Joystick Display implementation:
	Port by Anthony 'Dragoni' Mattera (RetroWeeb) https://github.com/RetroWeeb
	Copyright 2019 Open Joystick Display Project, Anthony 'Dragoni' Mattera (RetroWeeb)
	LICENSE: https://ojdproject.com/license
	
*/
class RetroSpyDevice_MD {

	constructor(profile) {
		this.resetJoystick();
		this.joystickInfo = "RetroSpy Ardunio Sega Master System / Mega Drive (Genesis). 13 Buttons, 0 Axes";
	}

	resetJoystick() {
		// Emulates Chromium Gamepad Model
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