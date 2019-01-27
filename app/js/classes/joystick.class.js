const OJD = window.OJD;

class Joystick {

	constructor(config, profiles) {

		// External Classes
		this.config = config;
		this.profiles = profiles;
		this.lastButton = 0;

		// Keywords for Interface
		this.dpadKeywords = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
		this.cpadKeywords = ['CLEFT', 'CRIGHT', 'CUP', 'CDOWN'];

		// Joystick Properties
		this.joystickConnected = false;
		this.joystickStatus = 'No Joystick Connected. Press a button or connect a joystick.';	
		this.joystickInfo = '';	
		this.joystickIndex 	= null;
		this.joystickCheckInterval = null;

		// Load Event Listeners
		window.addEventListener("gamepadconnected", this.eventConnectGamepad.bind(this));
		window.addEventListener("gamepaddisconnected", this.eventDisconnectGamepad.bind(this));

	}

	eventConnectGamepad(e) {
		if (!this.joystickConnected) {
			const poll = this.profiles.getCurrentProfilePoll();
			const joystick = navigator.getGamepads()[e.gamepad.index];

			this.joystickConnected = true;
			this.joystickIndex = e.gamepad.index;
			this.joystickStatus = 'Joystick Connected.';
			this.joystickInfo = `Joystick connected at index ${joystick.index}: ${joystick.id}. ${joystick.buttons.length} buttons, ${joystick.axes.length} axes.`;

			const func = this.intervalCheckJoystick.bind(this);
			this.joystickCheckInterval = setInterval(func, poll);
		}
	}

	eventDisconnectGamepad(e) {
		clearInterval(this.joystickCheckInterval);
		this.joystickIndex = false;
		this.joystickConnected = false;
		this.joystickStatus = 'No Joystick Connected. Press a button or connect a joystick.';	
		this.joystickInfo = '';
	}

	updatePollRate() {
		if (this.joystickConnected) {
			const poll = this.profiles.getCurrentProfilePoll();
			clearInterval(this.joystickCheckInterval);
			const func = this.intervalCheckJoystick.bind(this);
			this.joystickCheckInterval = setInterval(func, poll);
		}
	}

	intervalCheckJoystick() {
		this.checkMapping();
		this.checkRaw();
	}

	checkRaw() {

		// Buttons
		const joystick = navigator.getGamepads()[this.joystickIndex];
		for (const i in joystick.buttons) {
			if (joystick.buttons[i].pressed) {
				this.lastButton = i;
				$(`*[ojd-raw-button='${i}']`).addClass('ojd-tester-active');
			} else {
				$(`*[ojd-raw-button='${i}']`).removeClass('ojd-tester-active');
			}
		}

		// 2D Directional View
		const directionalCount = joystick.axes.length/2;
		let axisIndex = 0;
		for (let i=0;i<directionalCount;i++) {

			let offset ={};
			let axis1 = axisIndex;
			let axis2 = axisIndex+1;

			axisIndex+=2;

			offset = this.checkAnalog(axis1, axis2, 0);

			$(`span[ojd-raw-analog-axes-x='${i}']`).html(axis1);
			$(`span[ojd-raw-analog-axes-y='${i}']`).html(axis2);

			$(`*[ojd-raw-analog='${i}']`).css('top',`${offset.y}%`);
			$(`*[ojd-raw-analog='${i}']`).css('left',`${offset.x}%`);
			$(`*[ojd-raw-analog-x='${i}']`).val(offset.xRaw.toFixed(5));
			$(`*[ojd-raw-analog-y='${i}']`).val(offset.yRaw.toFixed(5));
		}

		// 1D Thottle/Linear Axes View
		for(const i in joystick.axes) {
			const value = joystick.axes[i];
			const valueOffset = value+1; // Allows for easy percentage calculation
			$(`*[ojd-raw-axes-value='${i}']`).val(value.toFixed(5));
			$(`*[ojd-raw-axes='${i}']`).css('width',`${100*(valueOffset/2)}%`);
		}

	}

	checkMapping() {

		const currentMapping = this.profiles.getCurrentProfileMapping();
		const currentButtonMapping = currentMapping.button;
		const hasDirectionalPad = currentMapping;

		// Check Buttons
		const multimapCheck=[]; // In case a single button is mapped to multiple physical buttons.
		for (const k of currentButtonMapping) {
			const pressed = this.checkButtonPressed(k.index);
			if (pressed) {
				multimapCheck.push(k.button);
				$(`*[ojd-button='${k.button}']`).addClass('active');
			} else {
				if (!multimapCheck.includes(k.button)) {
					$(`*[ojd-button='${k.button}']`).removeClass('active');
				}
			}
		}

		// Check Directional Pad
		for (const i in currentMapping.directional) {

			const directional = currentMapping.directional[i];
			const deadzone = directional.deadzone;
			const axisIndex1 = directional.axes[0];
			const axisIndex2 = directional.axes[1];
			const offset = this.checkAnalog(axisIndex1, axisIndex2, deadzone);

			// All directionals are treated like analogs regardless
			$(`*[ojd-directional='${i}']`).css('top',`${offset.y}%`);
			$(`*[ojd-directional='${i}']`).css('left',`${offset.x}%`);

			// Allow for highlighting.
			if (offset.x !== 50 || offset.y !== 50) {
				$(`*[ojd-directional='${i}']`).addClass('active');
			} else {
				$(`*[ojd-directional='${i}']`).removeClass('active');
			}

			// Is axes support to function like a dpad?
			if (directional.dpad) {
				for (const d of this.dpadKeywords) {
					const pressed = this.checkDirectionPressed(axisIndex1, axisIndex2, deadzone, d);
					if (pressed) {
						$(`*[ojd-button='${d}']`).addClass('active');
					} else {
						if (!multimapCheck.includes(d)) {
							$(`*[ojd-button='${d}']`).removeClass('active');
						}
					}
				}
			}

			// Is axes suppose to function like a cpad (Gamecube/N64)
			if (directional.cpad) {
				for (const d of this.cpadKeywords) {
					const pressed = this.checkDirectionPressed(axisIndex1, axisIndex2, deadzone, d);
					if (pressed) {
						$(`*[ojd-button='${d}']`).addClass('active');
					} else {
						if (!multimapCheck.includes(d)) {
							$(`*[ojd-button='${d}']`).removeClass('active');
						}
					}
				}
			}

		}

		for (const i in currentMapping.trigger) {

			const trigger = currentMapping.trigger[i];
			const active = this.checkTrigger(trigger.axis, trigger.range[0], trigger.range[1]);

			if (active !== false) {

				const scale = ((active+1)/(trigger.range[1]+1))*100;

				$(`*[ojd-trigger-scale='${i}']`).css('height', `${scale}%`);
				$(`*[ojd-trigger-move='${i}']`).css('top', `${scale}%`);
				$(`*[ojd-trigger-scale-inverted='${i}']`).css('height', `${100-scale}%`);
				$(`*[ojd-trigger-move-inverted='${i}']`).css('top', `${100-scale}%`);
				$(`*[ojd-trigger='${i}']`).addClass('trigger-active');

				if (trigger.button) {
					$(`*[ojd-button='${trigger.button}']`).addClass('active');
				}

			} else {

				$(`*[ojd-trigger-scale='${i}']`).css('height', '');
				$(`*[ojd-trigger-scale-inverted='${i}']`).css('height', '');
				$(`*[ojd-trigger-move='${i}']`).css('top', ``);
				$(`*[ojd-trigger-move-inverted='${i}']`).css('top', ``);
				$(`*[ojd-trigger='${i}']`).removeClass('trigger-active');

				if (trigger.button) {
					if (!multimapCheck.includes(trigger.button)) {
						$(`*[ojd-button='${trigger.button}']`).removeClass('active');
					}
				}
			}

		}

	}

	getJoystick() {
		if (this.joystickConnected) {
			return navigator.getGamepads()[this.joystickIndex];

		}
		return false;
	}

	checkTrigger(axisIndex, rangeMin, rangeMax) {

		const joystick = navigator.getGamepads()[this.joystickIndex];
		const axis = joystick.axes[axisIndex];

		if (axis >= rangeMin && axis <= rangeMax) {
			return axis;
		}

		return false;

	}

	checkAnalog(axisIndex1, axisIndex2, deadzone) {
		
		const joystick = navigator.getGamepads()[this.joystickIndex];
		const axis1 = joystick.axes[axisIndex1];
		const axis2 = joystick.axes[axisIndex2];

		const offset = {
			x:0,
			y:0,
			xRaw:0,
			yRaw:0,
		};

		let x = (axis1 < deadzone*-1 || axis1 > deadzone) ? axis1 : 0;
		let y = (axis2 < deadzone*-1 || axis2 > deadzone) ? axis2 : 0;

		offset.x = 50 + (x*50);
		offset.y = 50 + (y*50);
		offset.xRaw = axis1;
		offset.yRaw = axis2;
		
		return offset;

	}

	checkDirectionPressed(axisIndex1, axisIndex2, deadzone, direction) {

		const joystick = navigator.getGamepads()[this.joystickIndex];
		const axis1 = joystick.axes[axisIndex1];
		const axis2 = joystick.axes[axisIndex2];

		if (direction === 'LEFT' || direction === 'CLEFT') {
			if (axis1 < deadzone*-1) {
				return true;
			}
		}

		if (direction === 'RIGHT' || direction === 'CRIGHT') {
			if (axis1 > deadzone) {
				return true;
			}
		}

		if (direction === 'UP' || direction === 'CUP') {
			if (axis2 < deadzone*-1) {
				return true;
			}
		}

		if (direction === 'DOWN' || direction === 'CDOWN') {
			if (axis2 > deadzone) {
				return true;
			}
		}

		return false;

	}

	checkButtonPressed(buttonIndex) {
		const joystick = navigator.getGamepads()[this.joystickIndex];
		if (joystick.buttons[buttonIndex]) {
			if (joystick.buttons[buttonIndex].pressed) {
				return true;
			}
		}
		return false;
	}


}

module.exports.Joystick = Joystick;