const FS = require('fs');
const OJD = window.OJD;

class ThemeController {

	constructor(rootController) {
		this.rootId = '#ojd-theme';
		this.rootController = rootController;
	}

	renderInitial() {

		const files = [
			FS.openSync(OJD.appendCwdPath('app/views/components/theme.view.html'), 'r')
		];

		$(this.rootId).html("");
		
		for (const file of files) {
			const html = FS.readFileSync(file, 'UTF-8');
			$(this.rootId).append(html);
			FS.closeSync(file);
		}

	}
}


module.exports.ThemeController = ThemeController;
