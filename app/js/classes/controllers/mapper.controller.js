const FS = require('fs');
const OJD = window.OJD;

class MapperController {

	constructor(rootController) {
		this.rootId = '#ojd-mapper';
		this.rootController = rootController;
	}

	renderInitial() {

		const files = [
			FS.openSync(OJD.appendCwdPath('app/views/components/mapper.view.html'), 'r')
		];

		$(this.rootId).html("");
		
		for (const file of files) {
			const html = FS.readFileSync(file, 'UTF-8');
			$(this.rootId).append(html);
			FS.closeSync(file);
		}

	}

}


module.exports.MapperController = MapperController;
