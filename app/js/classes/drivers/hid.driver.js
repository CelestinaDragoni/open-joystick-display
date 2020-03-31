const Clone 		= require('clone')
const HID 			= require('node-hid')
const OJD 			= window.OJD

// Work in progress. Not ready.
class HIDDriver {
    constructor(handler) {
        // Joystick Properties
        this.joystickConnected = false
        this.joystickInfo = ''

        this.ready = true
        this.handler = handler

        // Load Event Listeners
        this.ports 	= []

        // Load Ports
        this.initPorts()
    }

    setActive() {
        // Do nothing.
    }

    setInactive() {
        // Do nothing.
    }

    connectJoystick(e) {
        if (!this.joystickConnected) {
            const joystick = navigator.getGamepads()[e.gamepad.index]
            this.joystickConnected = true
            this.joystickIndex = e.gamepad.index
            this.joystickInfo = `${joystick.id}: ${joystick.buttons.length} Buttons, ${joystick.axes.length} Axes.`
        }
    }

    disconnectJoystick() {
        this.joystickIndex = false
        this.joystickConnected = false
        this.joystickInfo = ''
    }

    isConnected() {
        return this.joystickConnected
    }

    getJoystick() {
        if (this.joystickConnected) {
            return navigator.getGamepads()[this.joystickIndex]
        }
        return false
    }

    getInformation() {
        if (this.joystickConnected) {
            return this.joystickInfo
        }
        return 'No joystick connected. Please connect a joystick and press a button to activate.'
    }

    getPorts() {
        return this.ports
    }

    getDevices() {
        return false
    }

    initPorts() {
        const ports = HID.devices()
        console.log(ports)
        for (const port of ports) {
            this.ports.push({
                value: port.comName,
                label: name
            })
        }
    }
}

module.exports.HIDDriver = HIDDriver
