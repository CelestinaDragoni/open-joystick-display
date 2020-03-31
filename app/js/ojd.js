/*
	Class OJD
	General tools used globally thoughout OJD.
*/
const PATH = require('path')

class OJD {
    /*
	 * constructor(cwd)
	 * @param string cwd
	 * @param object config
	 * @return OJD
	 * OJD Class constructor. Sets the CWD application wide.
	 */
    constructor(cwd) {
        this.cwd = this.getEnvPath(cwd.replace('app/views', '').replace('app\\views', ''))
    }

    /*
	 * setConfig()
	 * @param object Config
	 * @return bool
	 * Post constructor bind of configuration class.
	 */
    setConfig(config) {
        this.config = config
    }

    /*
	 * isWindows()
	 * @return bool
	 * Determines if the application is running in windows.c
	 */
    isWindows() {
        if (process.platform === 'win32') {
            return true
        }
        return false
    }

    /*
	 * getCwd()
	 * @return string
	 * Gets the current working directory of the application. Set in index.js.
	 */
    getCwd() {
        return this.cwd
    }

    /*
	 * getEnvPath(path)
	 * @param string path
	 * @return string
	 * Returns the correct pathing style for each OS. Mostly here for windows.
	 */
    getEnvPath(path) {
        if (this.isWindows()) {
            path = PATH.normalize(path)
        }
        return path
    }

    /*
	 * appendCwdPath(path)
	 * @param string path
	 * @return string
	 * Returns path from the current working directory.
	 */
    appendCwdPath(path) {
        const cwd = this.getCwd()
        let cwdPath = `${cwd}/${path}`
        cwdPath = this.getEnvPath(cwdPath)
        return cwdPath
    }

    /*
	 * escapeText(string)
	 * @param string text
	 * @return string
	 * Returns an escaped string to prevent JS injection.
	 */
    escapeText(text) {
        return $('<div>').text(text).html()
    }

    /*
	 * log()
	 * @param mixed buffer
	 * @return NULL
	 * Enables logging if config.debug = true
	 */

    log(buffer) {
        if (this.config.debugEnabled()) {
            console.log(buffer)
        }
    }

    /*
	 * validateInteger()
	 * @param mixed value
	 * @param float min
	 * @param float max
	 * @param integer precision
	 * @return float
	 * Validates an float value between a range. Also allows for precision rounding.
	 */
    validateFloat(value, min, max, precision) {
        value = parseFloat(value)
        if (value < min) {
            value = min
        } else if (value > max) {
            value = max
        }
        if (precision) {

        }
        return value
    }

    /*
	 * validateInteger()
	 * @param mixed value
	 * @param integer min
	 * @param integer max
	 * @param integer precision
	 * @return integer
	 * Validates an integer value between a range.
	 */
    validateInteger(value, min, max) {
        value = parseInt(value, 10)
        if (value < min) {
            value = min
        } else if (value > max) {
            value = max
        }
        return value
    }
}
module.exports.OJD = OJD
