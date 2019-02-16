const Clone 		= require('clone');
const SerialPort 	= require("serialport");
const Readline 		= require('@serialport/parser-readline')
const OJD 			= window.OJD;

// Devices
const {RetroSpyDevice_NES} = require(OJD.appendCwdPath('app/js/classes/drivers/retrospy/retrospy-nes.device.js'));
const {RetroSpyDevice_SNES} = require(OJD.appendCwdPath('app/js/classes/drivers/retrospy/retrospy-snes.device.js'));


class RetroSpyDriver {

	constructor(handler) {

		this.joystickConnected = false;
		this.joystickInfo = '';
		this.handler = handler;

		this.ports 	= [];
		this.ready  = false;
		this.port 	= false;
		this.socket = false;
		this.baud 	= 115200;
		this.device = false;
		this.devices = {
			'nes':new RetroSpyDevice_NES(),
			'snes':new RetroSpyDevice_SNES(),
			'n64':'',
			'gc':''
		};

		// Get Serial Ports
		this.initSerialPorts();

	}

	setActive(port, device) {

		console.log(device);

		// Sanity Checking
		if (port === '') {
			return false;
		}

		if (device === '') {
			return false;
		}

		// Setup Devices
		this.port = port;
		this.device = this.devices[device];
		this.device.resetJoystick();

		// Make Serial Connection
		this.socket = new SerialPort(this.port, {baudRate:this.baud, autoOpen:true}, (function(err) {
			if (err) {
				console.error(err);
			}
		}).bind(this));
		
		// On Disconnect Refresh Driver
		this.socket.on('err', (function(err) {
			if (this.joystickConnected) {
				this.handler.reloadDriver();
			}
		}).bind(this));

		// Send Information to Parser
		const parser = this.socket.pipe(new Readline({ delimiter: '\n' }))
		parser.on('data', (function (data) {
			this.device.read(data);
		}).bind(this));

		this.joystickConnected = true;

	}

	setInactive() {
		this.joystickConnected = false;
		this.error = false;
		this.port = false;
		this.socket = false;

		if (this.socket && this.socket.isOpen) {
			this.socket.close();
		}
	}

	isConnected() {
		return this.joystickConnected;
	}

	getInformation() {
		if (this.device) {
			return `Connected on ${this.port}: ${this.device.getInformation()}.`
		} else {
			return "RetroSpy is not connected. Check your arduino installation, your firmware, your serial port, your cable, and if your console is currently on.";
		}
	}

	getJoystick() {
		if (this.device) {
			return this.device.getJoystick();
		} else {
			return {buttons:[],axes:[]};
		}
	}

	getPorts() {
		return this.ports;
	}

	getDevices() {
		return [
			{value:'nes', label:'NES / Famicom'},
			{value:'snes', label:'SNES / Super Famicom'},
			{value:'n64', label:'Nintendo 64'},
			{value:'gc', label:'Nintendo Gamecube'}
		];
	}

	async initSerialPorts() {

		try {
			const ports = await SerialPort.list();

			for (const port of ports) {
				let name = port.comName;

				if (typeof port.pnpId !== 'undefined') {
					name = `${name} (${port.pnpId})`;
				}

				this.ports.push({
					value:port.comName,
				    label:name
				});
			}

			this.ready = true;

		} catch (err) {
			console.error("Could not access serial device. Maybe you need to give yourself permissions or run as administrator?");
		}

	}

}

module.exports.RetroSpyDriver = RetroSpyDriver;