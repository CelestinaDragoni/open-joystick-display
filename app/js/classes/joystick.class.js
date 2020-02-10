const OJD = window.OJD;
const {ChromiumDriver} 	= require(window.OJD.appendCwdPath("app/js/classes/drivers/chromium.driver.js"));
const {RetroSpyDriver} 	= require(window.OJD.appendCwdPath("app/js/classes/drivers/retrospy.driver.js"));
const {NetworkDriver} 	= require(window.OJD.appendCwdPath("app/js/classes/drivers/network.driver.js"));
//const {HIDDriver} 		= require(window.OJD.appendCwdPath("app/js/classes/drivers/hid.driver.js"));

class Joystick {

	constructor(config, profiles) {

		// External Classes
		this.config = config;
		this.profiles = profiles;
		this.driver = this.profiles.getCurrentProfileDriver();
		this.lastButton = 0;

		// Keywords for Interface
		this.dpadKeywords = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
		this.cpadKeywords = ['CLEFT', 'CRIGHT', 'CUP', 'CDOWN'];

		// New Driver Components
		this.drivers = {
			'chromium':new ChromiumDriver(this),
			'retrospy':new RetroSpyDriver(this),
			'network':new NetworkDriver(this)
			//'hid':new HIDDriver(this)
		};

		// Setup Checking
		const poll = this.profiles.getCurrentProfilePoll();
		const func = this.intervalCheckJoystick.bind(this);
		this.joystickCheckInterval = setInterval(func, poll);

		this.reloadDriver();

	}

	updatePollRate() {
		clearInterval(this.joystickCheckInterval);
		const poll = this.profiles.getCurrentProfilePoll();
		const func = this.intervalCheckJoystick.bind(this);
		this.joystickCheckInterval = setInterval(func, poll);
	}

	isReady() {
		for (const k in this.drivers) {
			if (!this.drivers[k].ready) {
				return false;
			}
		}
		return true;
	}

	async reloadPorts() {
		await this.drivers[this.driver].initPorts();
	}

	reloadDriver() {
		this.drivers[this.driver].setInactive();
		this.driver = this.profiles.getCurrentProfileDriver();

		const port = this.profiles.getCurrentProfileDriverPort();
		const device = this.profiles.getCurrentProfileDriverDevice();
		const uri = this.profiles.getCurrentProfileDriverUri();

        if (this.driver === 'chromium') {
            this.drivers[this.driver].player = this.profiles.getCurrentProfilePlayer();
        }
		this.drivers[this.driver].setActive(port, device, uri);
	}

	getSupportedPorts() {
		return this.drivers[this.driver].getPorts();
	}

	getSupportedDevices() {
		return this.drivers[this.driver].getDevices();
	}

	getCurrentDriver() {
		return this.drivers[this.driver];
	}

	getJoystick() {
		return this.drivers[this.driver].getJoystick();
	}

	getJoystickInfo() {
		return this.drivers[this.driver].getInformation();
	}

	isConnected() {
		return this.drivers[this.driver].isConnected();
	}

	intervalCheckJoystick() {
		this.checkMapping();
		this.checkRaw();
	}

	checkRaw() {

		if (!this.getCurrentDriver().isConnected()) {
			return false;
		}

		// Buttons
		const joystick = this.getCurrentDriver().getJoystick();
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
			$(`*[ojd-raw-analog-x='${i}']`).val(offset.xRaw.toFixed(4));
			$(`*[ojd-raw-analog-y='${i}']`).val(offset.yRaw.toFixed(4));
		}

		// 1D Thottle/Linear Axes View
		for(const i in joystick.axes) {
			const value = joystick.axes[i];
			const valueOffset = value+1; // Allows for easy percentage calculation
			$(`*[ojd-raw-axes-value='${i}']`).val(value.toFixed(4));
			$(`*[ojd-raw-axes='${i}']`).css('width',`${100*(valueOffset/2)}%`);
		}

	}

	checkMapping() {

		if (!this.getCurrentDriver().isConnected()) {
			return false;
		}

		const currentMapping = this.profiles.getCurrentProfileMapping();
		const currentButtonMapping = currentMapping.button;

		// Check Buttons
		const multimapCheck=[]; // In case a single button is mapped to multiple physical buttons.
		for (const k of currentButtonMapping) {
			const pressed = this.checkButtonPressed(k.index);
			if (pressed) {
				multimapCheck.push(k.button);
				$(`*[ojd-button='${k.button}']`).addClass('active');
				$(`*[ojd\\:button='${k.button}']`).addClass('active');
			} else {
				if (!multimapCheck.includes(k.button)) {
					$(`*[ojd-button='${k.button}']`).removeClass('active');
					$(`*[ojd\\:button='${k.button}']`).removeClass('active');
				}
			}
		}

		// Check for Arcade Stick
		const arcadeOffset = this.checkArcadeStick(currentButtonMapping);
		$(`*[ojd-arcade-directional]`).css('top',`${arcadeOffset.y}%`);
		$(`*[ojd-arcade-directional]`).css('left',`${arcadeOffset.x}%`);
		if (arcadeOffset.x !== 50 || arcadeOffset.y !== 50) {
			$(`*[ojd-arcade-directional]`).addClass('active');
		} else {
			$(`*[ojd-arcade-directional]`).removeClass('active');
		}

		// Check Directional Pad
		for (const i in currentMapping.directional) {

			const directional = currentMapping.directional[i];
			const deadzone = directional.deadzone;
			const axisIndex1 = directional.axes[0];
			const axisIndex2 = directional.axes[1];
			const hasInfinity = directional.infinity;
			const invertX = directional.invertX;
			const invertY = directional.invertY;
			const offset = this.checkAnalog(axisIndex1, axisIndex2, deadzone, hasInfinity, invertX, invertY);

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
					const pressed = this.checkDirectionPressed(axisIndex1, axisIndex2, deadzone, d, hasInfinity);
					if (pressed) {
						$(`*[ojd-button='${d}']`).addClass('active');
						$(`*[ojd\\:button='${d}']`).addClass('active');
					} else {
						if (!multimapCheck.includes(d)) {
							$(`*[ojd-button='${d}']`).removeClass('active');
							$(`*[ojd\\:button='${d}']`).removeClass('active');
						}
					}
				}
			}

			// Is axes suppose to function like a cpad (Gamecube/N64)
			if (directional.cpad) {
				for (const d of this.cpadKeywords) {
					const pressed = this.checkDirectionPressed(axisIndex1, axisIndex2, deadzone, d, hasInfinity);
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

				let scale = ((active+1)/(trigger.range[1]+1))*100;

                if (trigger.invert) {
                    scale = 100 - scale;
                }
                
                let degrees = trigger.degrees || trigger.degrees == 0 ? trigger.degrees : 0;
                let degreesScale = 0;

                if (scale > 50) {
                    degreesScale = (scale-50)/50;
                    degrees = degrees*degreesScale;
                } else if (scale < 50) {
                    degreesScale = ((scale*-1)+50)/50;
                    degrees = degrees*degreesScale*-1;
                } else {
                    degrees = 0;
                }
                degrees = parseInt(degrees/2);

				$(`*[ojd-trigger-scale='${i}']`).css('height', `${scale}%`);
				$(`*[ojd-trigger-move='${i}']`).css('top', `${scale}%`);
				$(`*[ojd-trigger-scale-inverted='${i}']`).css('height', `${100-scale}%`);
				$(`*[ojd-trigger-move-inverted='${i}']`).css('top', `${100-scale}%`);
                $(`*[ojd-trigger-wheel='${i}']`).css('transform', `rotate(${degrees}deg)`);
				$(`*[ojd-trigger='${i}']`).addClass('trigger-active');

				if (trigger.button) {
					$(`*[ojd-button='${trigger.button}']`).addClass('active');
				}

			} else {

				$(`*[ojd-trigger-scale='${i}']`).css('height', '');
				$(`*[ojd-trigger-scale-inverted='${i}']`).css('height', '');
				$(`*[ojd-trigger-move='${i}']`).css('top', ``);
				$(`*[ojd-trigger-move-inverted='${i}']`).css('top', ``);
                $(`*[ojd-trigger-wheel='${i}']`).css('transform', ``);
				$(`*[ojd-trigger='${i}']`).removeClass('trigger-active');

				if (trigger.button) {
					if (!multimapCheck.includes(trigger.button)) {
						$(`*[ojd-button='${trigger.button}']`).removeClass('active');
					}
				}
			}

		}

        const fixedTriggerDir = [];
		for (const i in currentMapping.triggerFixed) {
			const trigger = currentMapping.triggerFixed[i];
			const active = this.checkFixedTrigger(trigger.axis, trigger.val);

            

			if (active) {

				if (trigger.button1) {
					multimapCheck.push(trigger.button1);
					$(`*[ojd-button='${trigger.button1}']`).addClass('active');
                    fixedTriggerDir.push(trigger.button1);
				}

				if (trigger.button2) {
					multimapCheck.push(trigger.button2);
					$(`*[ojd-button='${trigger.button2}']`).addClass('active');
                    fixedTriggerDir.push(trigger.button2);
				}

			} else {
				if (trigger.button1) {
					if (!multimapCheck.includes(trigger.button1)) {
						$(`*[ojd-button='${trigger.button1}']`).removeClass('active');
					}
				}

				if (trigger.button2) {
					if (!multimapCheck.includes(trigger.button2)) {
						$(`*[ojd-button='${trigger.button2}']`).removeClass('active');
					}
				}

			}
		}


        const fixedTriggerOffset = this.checkTriggerArcadeStick(fixedTriggerDir);
        if (fixedTriggerOffset.x !== 50 || fixedTriggerOffset.y !== 50) {
            $(`*[ojd-arcade-directional]`).addClass('active');
        } else {
            $(`*[ojd-arcade-directional]`).removeClass('active');
        }

        // All directionals are treated like analogs regardless
        $(`*[ojd-arcade-directional]`).css('top',`${fixedTriggerOffset.y}%`);
        $(`*[ojd-arcade-directional]`).css('left',`${fixedTriggerOffset.x}%`);

	}


    checkTriggerArcadeStick(direction) {

        const offset = {x:0, y:0, xRaw:0, yRaw:0};

        for(const dir of direction) {
            switch(dir) {
                case "UP":
                    offset.yRaw = -1;
                    break;
                case "DOWN":
                    offset.yRaw = 1;
                    break;
                case "LEFT":
                    offset.xRaw = -1;
                    break;
                case "RIGHT":
                    offset.xRaw = 1;
                    break;
            }
        }

        offset.x = 50 + (offset.xRaw*50);
        offset.y = 50 + (offset.yRaw*50);

        return offset;

    }


	checkArcadeStick(buttonMapping) {

		const joystick = this.getCurrentDriver().getJoystick();

		const buttons = {
			'UP':false,
			'LEFT':false,
			'RIGHT':false,
			'DOWN':false
		};

		const active = {
			'UP':false,
			'LEFT':false,
			'RIGHT':false,
			'DOWN':false
		};

		const offset = {
			x:0,
			y:0,
			xRaw:0,
			yRaw:0
		};

		// Find Directionals
		for (const k of buttonMapping) {

			switch(k.button) {
				case "UP":
					buttons.UP = k.index;
					break;
				case "DOWN":
					buttons.DOWN = k.index;
					break;
				case "LEFT":
					buttons.LEFT = k.index;
					break;
				case "RIGHT":
					buttons.RIGHT = k.index;
					break;
			}

		}

		// Determine if the buttons are activated
		active.UP 		= buttons.UP 	!== false && joystick.buttons[buttons.UP] 	 && joystick.buttons[buttons.UP].pressed ? true : false;
		active.LEFT 	= buttons.LEFT 	!== false && joystick.buttons[buttons.LEFT]  && joystick.buttons[buttons.LEFT].pressed ? true : false;
		active.RIGHT 	= buttons.RIGHT !== false && joystick.buttons[buttons.RIGHT] && joystick.buttons[buttons.RIGHT].pressed ? true : false;
		active.DOWN 	= buttons.DOWN 	!== false && joystick.buttons[buttons.DOWN]  && joystick.buttons[buttons.DOWN].pressed ? true : false;

		// Check Directions
		if (active.UP && active.LEFT) { // Check Secondary-Cardinal Directions
			offset.yRaw = -1;
			offset.xRaw = -1;
		} else if (active.UP && active.RIGHT) {
			offset.yRaw = -1;
			offset.xRaw = 1;
		} else if (active.DOWN && active.LEFT) {
			offset.yRaw = 1;
			offset.xRaw = -1;
		} else if (active.DOWN && active.RIGHT) {
			offset.yRaw = 1;
			offset.xRaw = 1;
		} else if (active.UP) { // Check Primary-Cardinal Directions
			offset.yRaw = -1;
		} else if (active.LEFT) {
			offset.xRaw = -1;
		} else if (active.DOWN) {
			offset.yRaw = 1;
		} else if (active.RIGHT) {
			offset.xRaw = 1;
		}

		offset.x = 50 + (offset.xRaw*50);
		offset.y = 50 + (offset.yRaw*50);

		return offset;

	}

	checkTrigger(axisIndex, rangeMin, rangeMax) {

		const joystick = this.getCurrentDriver().getJoystick();
		const axis = joystick.axes[axisIndex];

		if (axis >= rangeMin && axis <= rangeMax) {
			return axis;
		}

		return false;

	}

	checkFixedTrigger(axisIndex, val) {

		const joystick = this.getCurrentDriver().getJoystick();
		const axis = joystick.axes[axisIndex];

		if (axis.toFixed(4) == val) {
			return true;
		}

		return false;

	}

	checkAnalog(axisIndex1, axisIndex2, deadzone, hasInfinity=false, invertX=false, invertY=false) {
		
		const joystick = this.getCurrentDriver().getJoystick();
		let axis1 = joystick.axes[axisIndex1];
		let axis2 = joystick.axes[axisIndex2];

		const offset = {
			x:0,
			y:0,
			xRaw:0,
			yRaw:0,
		};

		if (hasInfinity) {

			if (axis1 === -Infinity) {
				axis1 = -1;
			} else if (axis1 === Infinity) {
				axis1 = 1;
			} else {
				axis1 = 0;
			}

			if (axis2 === -Infinity) {
				axis2 = -1;
			} else if (axis2 === Infinity) {
				axis2 = 1;
			} else {
				axis2 = 0;
			}

		}

		let x = (axis1 < deadzone*-1 || axis1 > deadzone) ? axis1 : 0;
		let y = (axis2 < deadzone*-1 || axis2 > deadzone) ? axis2 : 0;
		
		offset.xRaw = axis1;
		offset.yRaw = axis2;

		if (invertX) {
			offset.x = 50 + ((x*-1)*50);
		} else {
			offset.x = 50 + (x*50);
		}

		if (invertY) {
			offset.y = 50 + ((y*-1)*50);
		} else {
			offset.y = 50 + (y*50);
		}
		
		return offset;

	}

	checkDirectionPressed(axisIndex1, axisIndex2, deadzone, direction, hasInfinity=false) {

		const joystick = this.getCurrentDriver().getJoystick();
		let axis1 = joystick.axes[axisIndex1];
		let axis2 = joystick.axes[axisIndex2];

		if (hasInfinity) {

			if (axis1 === -Infinity) {
				axis1 = -1;
			} else if (axis1 === Infinity) {
				axis1 = 1;
			} else {
				axis1 = 0;
			}

			if (axis2 === -Infinity) {
				axis2 = -1;
			} else if (axis2 === Infinity) {
				axis2 = 1;
			} else {
				axis2 = 0;
			}

		}

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
		const joystick = this.getCurrentDriver().getJoystick();
		if (joystick.buttons[buttonIndex]) {
			if (joystick.buttons[buttonIndex].pressed) {
				return true;
			}
		}
		return false;
	}


}

module.exports.Joystick = Joystick;