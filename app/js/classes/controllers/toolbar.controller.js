const FS = require('fs');
const OJD = window.OJD;

class ToolbarController {

	constructor(rootController) {
		this.rootId = '#ojd-toolbar';
		this.rootController = rootController;
	}

	renderInitial() {

		const files = [
			FS.openSync(OJD.appendCwdPath('app/views/components/toolbar.view.html'), 'r')
		];

		$(this.rootId).html("");

		for (const file of files) {
			const html = FS.readFileSync(file, 'UTF-8');
			$(this.rootId).append(html);
			FS.closeSync(file);
		}

	}

	render() {

	}

}


module.exports.ToolbarController = ToolbarController;
