const Clone 		= require('clone');
const SerialPort 	= require("serialport");
const Readline 		= require('@serialport/parser-readline')
const OJD 			= window.OJD;

// Devices
const {RetroSpyDevice_NES} 	= require(OJD.appendCwdPath('app/js/classes/drivers/retrospy/retrospy-nes.device.js'));
const {RetroSpyDevice_SNES} = require(OJD.appendCwdPath('app/js/classes/drivers/retrospy/retrospy-snes.device.js'));
const {RetroSpyDevice_GC} 	= require(OJD.appendCwdPath('app/js/classes/drivers/retrospy/retrospy-gc.device.js'));
const {RetroSpyDevice_N64} 	= require(OJD.appendCwdPath('app/js/classes/drivers/retrospy/retrospy-n64.device.js'));
const {RetroSpyDevice_PCE} 	= require(OJD.appendCwdPath('app/js/classes/drivers/retrospy/retrospy-pce.device.js'));
const {RetroSpyDevice_MD} 	= require(OJD.appendCwdPath('app/js/classes/drivers/retrospy/retrospy-md.device.js'));

/*
	RetroSpyDriver
	Handles the RetroSpy responses from the serial device firmware. Converts them into a standard
	chromium gamepad response to be used with the existing input mapper.

	Original Implimentation:
	Original NintendoSpy implimentation by Jeremy Burns (jaburns). https://github.com/jaburns/NintendoSpy
	RetroSpy fork by Christopher J. Mallery (zoggins). https://github.com/zoggins/RetroSpy

	RetroSpy Copyright 2018 Christopher J. Mallery <http://www.zoggins.net> NintendoSpy Copyright (c) 2014 Jeremy Burns
	LICENSE: https://github.com/zoggins/RetroSpy/blob/master/LICENSE
	
	Open Joystick Display Implimentation:
	Port by Anthony 'Dragoni' Mattera (RetroWeeb) https://github.com/RetroWeeb
	Copyright 2019 Open Joystick Display Project, Anthony 'Dragoni' Mattera (RetroWeeb)
	LICENSE: https://ojdproject.com/license
	
*/
class RetroSpyDriver {

	constructor(handler) {

		this.joystickConnected = false;
		this.joystickInfo = '';
		this.handler = handler;

		// RetroSpy Settings
		this.ports 	= [];
		this.ready  = false;
		this.port 	= false;
		this.socket = false;
		this.baud 	= 115200;
		this.device = false;

		// List of Support Device Parsers
		this.devices = {
			'nes':new RetroSpyDevice_NES(),
			'snes':new RetroSpyDevice_SNES(),
			'n64':new RetroSpyDevice_N64(),
			'gc':new RetroSpyDevice_GC(),
			'md':new RetroSpyDevice_MD(),
			'pce':new RetroSpyDevice_PCE()
		};

		// Get Serial Ports
		this.initPorts();

	}

	setActive(port, device) {

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
				console.info(`RetroSpy: ${err}`);
			}
		}).bind(this));
		
		// On Disconnect Refresh Driver
		this.socket.on('err', (function(err) {
			if (this.joystickConnected) {
				console.info('RetroSpy: Reloading Driver');
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
		if (this.device && this.port) {
			return `Connected on ${this.port}: ${this.device.getInformation()}.`
		} else {
			return "RetroSpy is not connected. Check your arduino installation, your firmware, your serial port, your cable, and if your console is currently on.";
		}
	}

	getJoystick() {
		if (this.device  && this.port) {
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
			{value:'nes', label:'Nintendo Famicom (NES)'},
			{value:'snes', label:'Nintendo Super Famicom (SNES)'},
			{value:'n64', label:'Nintendo 64'},
			{value:'gc', label:'Nintendo Gamecube'},
			{value:'pce', label:'NEC PC-Engine / TurboGrafx-16'},
			{value:'md', label:'Sega Master System / Mega Drive (Genesis)'}
		];
	}

	async initPorts() {

		this.ports = [];

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
			console.error("RetroSpy: Could not access serial device. Maybe you need to give yourself permissions or run as administrator?");
		}

		return true;

	}

}

module.exports.RetroSpyDriver = RetroSpyDriver;