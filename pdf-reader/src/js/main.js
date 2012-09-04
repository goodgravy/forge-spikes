setTimeout(function () {
	forge.tools.getURL('google.pdf',
		function (file) {
			 forge.tabs.open(file);
		}
	);
}, 2000);
