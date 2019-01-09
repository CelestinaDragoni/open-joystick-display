const FS = require('fs');
const { remote } = require('electron');
const dialog = remote.require('electron').dialog;

class InterfaceTester {

	constructor(config, joystick, themes, mappings) {
		
		// Objects
		this.config = config;
		this.joystick = joystick;
		this.themes = themes;
		this.mappings = mappings;

		// Properties
		this.joystickConnected = false;

		// Check for Joystick Changes
		this.intervalCheckJoystick = setInterval(this.actionCheckJoystickStatus.bind(this), 100);
	}

	actionCheckJoystickStatus() {
		if (this.joystickConnected != this.joystick.joystickConnected) {
			this.joystickConnected = this.joystick.joystickConnected;
			this.renderContent();
		}
	}

	renderContent() {

		const joystick = this.joystick.getJoystick();
		const $element = $("#ojd-tester-content");
		$($element).html("");

		let contentHtml = "";
		let buttonHtml = "";
		let directionalHtml = "";
		let throttleHtml = "";

		// Is joystick connected?
		if (!joystick) {
			$($element).html($("#ojd-template-tester-empty").html());
			return;
		} else {
			contentHtml = $("#ojd-template-tester").html();
		}

		// Render Buttons
		for (const i in joystick.buttons) {
			let t = $("#ojd-template-tester-button").html();
			t = t.replace(/\$\{index\}/g, i);
			buttonHtml += t;
		}

		// Render Directionals
		const directionalCount = joystick.axes.length/2;
		for (let i=0;i<directionalCount;i++) {
			
			let t = $("#ojd-template-tester-directional").html();
			t = t.replace(/\$\{index\}/g, i);
			directionalHtml += t;
		}

		// Render Linear View
		for(const i in joystick.axes) {
			let t = $("#ojd-template-tester-throttle").html();
			t = t.replace(/\$\{index\}/g, i);
			throttleHtml += t;
		}

		// Do The Mario
		contentHtml = contentHtml.replace("${information}", this.joystick.joystickInfo);
		contentHtml = contentHtml.replace("${buttons}", buttonHtml);
		contentHtml = contentHtml.replace("${directionals}", directionalHtml);
		contentHtml = contentHtml.replace("${throttle}", throttleHtml);

		$($element).html(contentHtml);

	}

	render() {

		const files = [
			FS.openSync('./src/views/interfaceTester.view.html', 'r')
		];

		for (const file of files) {
			const html = FS.readFileSync(file, 'UTF-8');
			$("body").append(html);
			FS.closeSync(file);
		}

		this.renderContent();

	}

}

module.exports.InterfaceTester = InterfaceTester;