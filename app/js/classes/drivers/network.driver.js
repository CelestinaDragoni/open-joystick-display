const Clone 			= require('clone')
const net 				= require('net')
const JSONSocket 		= require('json-socket')
const OJD 				= window.OJD


// Handles OJD server requests from another PC.
class NetworkDriver {
    constructor(handler) {
        // Joystick Properties
        this.driverActive = false
        this.joystickDefault = { connected: false, axes: [], buttons: [] }
        this.joystick = Clone(this.joystickDefault)
        this.joystickConnected = false
        this.joystickInfo = ''

        this.ready 		= true
        this.handler 	= handler
        this.host 		= null
        this.port 		= 56709
        this.socket 	= null

        this.serverInterval = null
    }

    setActive(physticalPort, physicalDevice, networkHost) {
        this.host = networkHost
        this.driverActive = true
        this.socket = new JSONSocket(new net.Socket())

        this.socket.on('error', function (err) {
            console.warn(`Socket Error: ${err.message}`)
        })

        this.socket.on('connect', (function () {
            this.checkJoystick()
        }).bind(this))

        this.socket.on('message', (function (response) {
	        if (response && response.connected) {
                this.joystick = response
                if (!this.joystickConnected) {
                    this.joystickConnected = true
                    this.joystickInfo = `${this.joystick.id}: ${this.joystick.buttons.length} Buttons, ${this.joystick.axes.length} Axes.`
                }
            } else {
                this.joystick = Clone(this.joystickDefault)
                this.joystickConnected = false
                this.joystickInfo = ''
            }
	        this.checkJoystick()
	    }).bind(this))

        this.socket.connect(this.port, this.host)
    }

    setInactive() {
        this.driverActive = false
        this.joystick = Clone(this.joystickDefault)
        this.joystickConnected = false
        this.joystickInfo = ''
        this.host = null
        this.socket = null
    }

    checkJoystick() {
        this.socket.sendMessage({ getController: true })
    }

    doSleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    doRequest(method, url) {
        return fetch(url).then(function (response) {
            return response.json()
        })
    }

    isConnected() {
        return this.joystickConnected
    }

    getJoystick() {
        if (this.joystickConnected) {
            return this.joystick
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
        return false
    }

    getDevices() {
        return false
    }

    async initPorts() {
        return true
    }
}

module.exports.NetworkDriver = NetworkDriver
