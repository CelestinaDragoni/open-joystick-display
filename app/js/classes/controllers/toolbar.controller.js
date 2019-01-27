const FS = require('fs');
const OJD = window.OJD;

class ToolbarController {

	constructor(rootController) {
		this.rootId = '#ojd-toolbar';
		this.aboutId = '#ojd-about-model';
		this.objectIds = {
			btnReload:'#ojd-toolbar-reload',
			btnDevTools:'#ojd-toolbar-dev',
			btnResetConfig:'#ojd-toolbar-reset',
			btnAbout:'#ojd-toolbar-about',
			btnDownload:'#ojd-toolbar-download',
			btnCloseModal:'.ojd-modal-close'
		};
		this.rootController = rootController;
		this.aboutDialog = false;
		this.localVersion = false;
		this.remoteVersion = false;
	}

	checkVersion() {
		$.get(OJD.appendCwdPath('app/version'), function( data ) {
		  this.localVersion = parseFloat(data);
		  $(".ojd-version").html(this.localVersion);
		  $.get({url:'https://ojdproject.com/version.txt',cache: false}, function( data ) {
		 	 this.remoteVersion = parseFloat(data);
		 	 if (this.localVersion != this.remoteVersion) {
		 	 	$(`${this.rootId} ${this.objectIds.btnDownload}`).show();
		 	 }
			}.bind(this));
		}.bind(this));
	}

	bindEvents() {
		$(`${this.rootId} ${this.objectIds.btnReload}`).bind('click', this.onReload.bind(this));
		$(`${this.rootId} ${this.objectIds.btnDevTools}`).bind('click', this.onDevTools.bind(this));
		$(`${this.rootId} ${this.objectIds.btnResetConfig}`).bind('click', this.onResetConfig.bind(this));
		$(`${this.rootId} ${this.objectIds.btnAbout}`).bind('click', this.onAbout.bind(this));
		$(`${this.aboutId} ${this.objectIds.btnCloseModal}`).bind('click', this.onAbout.bind(this));
		this.onDevTools(null, true);
	}

	onReload() {
		location.reload();
	}

	onDevTools(e, ignore=false) {

		if (!ignore) {
			this.rootController.electron.window.toggleDevTools({mode: 'detach'});
		}

		setTimeout((function() {
			const devToolsOpened = this.rootController.electron.window.isDevToolsOpened();
		}).bind(this), 250);

	}

	onResetConfig() {
		if (confirm("Are you should you want to reset your config?\nAll settings and mappings will be lost.")) {
			this.rootController.config.reset();
			this.onReload();
		}
	}

	onAbout() {
		this.aboutDialog = !this.aboutDialog;
		if (this.aboutDialog) {
			$(`${this.aboutId} > div`).show();
		} else {
			$(`${this.aboutId} > div`).hide();
		}
	}

	renderInitialAbout() {

		const files = [
			FS.openSync(OJD.appendCwdPath('app/views/components/about.view.html'), 'r')
		];

		$(this.aboutId).html("");
		for (const file of files) {
			const html = FS.readFileSync(file, 'UTF-8');
			$(this.aboutId).append(html);
			FS.closeSync(file);
		}

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

		this.renderInitialAbout();
		this.bindEvents();
		this.checkVersion();

	}

}


module.exports.ToolbarController = ToolbarController;
