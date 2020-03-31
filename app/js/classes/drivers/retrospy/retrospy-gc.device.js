const Clone = require('clone')

/*
	RetroSpyDevice_GC
	Parses the input from a gamecube controller and parses it into an chromium gamepad response.

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
class RetroSpyDevice_GC {
    constructor(profile) {
        this.buttonMap 			= [3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15]
        this.axisMap 			= [0, 8, 16, 24, 32, 40]

        // For some reason y axis are inverted in value. I could update the arduino firmware, but to remain compatible with zoggins work...
        this.axisMapInverted	= [false, true, false, true, false, false]
        this.axisMapOffset 		= 16
        this.axisMapByteLength 	= 8

        this.resetJoystick()
        this.joystickInfo = 'RetroSpy Ardunio Nintendo Gamecube. 12 Buttons, 6 Axes'
    }

    resetJoystick() {
        // Emulates Chromium Gamepad Model
        this.joystick = Clone({
            axes: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            buttons: [
                { pressed: false, value: 0 },
                { pressed: false, value: 0 },
                { pressed: false, value: 0 },
                { pressed: false, value: 0 },
                { pressed: false, value: 0 },
                { pressed: false, value: 0 },
                { pressed: false, value: 0 },
                { pressed: false, value: 0 },
                { pressed: false, value: 0 },
                { pressed: false, value: 0 },
                { pressed: false, value: 0 },
                { pressed: false, value: 0 }
            ]
        })
    }

    getJoystick() {
        return this.joystick
    }

    getInformation() {
        return this.joystickInfo
    }

    readAxis(buffer, bufferIndex, inverted) {
        let axisValue = buffer.substring(this.axisMapOffset + bufferIndex, this.axisMapOffset + bufferIndex + this.axisMapByteLength)

        axisValue = axisValue.replace(/\0/g, 0) // Convert to Binary
        axisValue = parseInt(axisValue, 2) // Convert to Base 10

        if (!isNaN(axisValue)) {
            axisValue = (parseFloat(axisValue) - 128) / 128 // Get Value
            if (inverted) {
                axisValue *= -1
            }
            return axisValue
        }
        return 0.0
    }

    read(line) {
        const buffer = [...line]

        // Read Buttons
        for (const buttonIndex in this.buttonMap) {
            const bufferIndex = this.buttonMap[buttonIndex]
            if (this.joystick.buttons[buttonIndex]) {
                if (buffer[bufferIndex] === '1') {
                    this.joystick.buttons[buttonIndex] = { pressed: true, value: 1 }
                } else {
                    this.joystick.buttons[buttonIndex] = { pressed: false, value: 0 }
                }
            }
        }

        // Read Axis
        for (const axisIndex in this.axisMap) {
            const bufferIndex = this.axisMap[axisIndex]
            if (typeof this.joystick.axes[axisIndex] !== 'undefined') {
                this.joystick.axes[axisIndex] = this.readAxis(line, bufferIndex, this.axisMapInverted[axisIndex])
            }
        }
    }
}

module.exports.RetroSpyDevice_GC = RetroSpyDevice_GC
