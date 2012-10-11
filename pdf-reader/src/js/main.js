window.onload = function () {
	forge.file.cacheURL('http://ilpubs.stanford.edu:8090/361/1/1998-8.pdf',
			function (file) {
				forge.file.URL(file, function (url) {
					forge.tabs.open(url);
				});
			},
			function (error) {
				forge.logging.error(JSON.stringify(error));
			}
	);
};
