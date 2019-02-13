const Clone 		= require('clone');
const SerialPort 	= require("serialport");
const Readline = require('@serialport/parser-readline')
const OJD 			= window.OJD;

class RetroSpy {

	constructor() {
		console.log("Loading Serial Ports");
		this.ports 	= [];
		this.port 	= false;
		this.device = false;
		this.baud 	= 115200;
		this.ready 	= false;
		this.active = false;
		this.getSerialPorts();
	}

	setActive(device) {
		console.log(device);

		this.port = new SerialPort(device, {baudRate:this.baud, autoOpen:true});
		
		/*this.port.on('data', function(data) {
			console.log('Data:', data);
		});*/

		const parser = this.port.pipe(new Readline({ delimiter: '\n' }))
		parser.on('data', function (data) {
			console.log('Data:', data)
		})

	}

	setInactive() {


	}

	getSerialPorts() {

		SerialPort.list((function(err, ports) {

			if (err) {
				console.error("Could not access serial device. Maybe you need to give yourself permissions or run as administrator?");
			} else {
				for (const port of ports) {

					let name = port.comName;
					if (typeof port.pnpId !== 'undefined') {
						name = `${name} (${port.pnpId})`;
					}

					this.ports.push({
						"name":name,
						"port":port.comName
					});

				}
				this.setActive(ports[0].comName);

			}
		}).bind(this));

	}


	onLog() {
		
	}


}

module.exports.RetroSpy = RetroSpy;