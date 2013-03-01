forge.urlhandler.urlLoaded.addListener(function(obj) {
	alert(obj);
}, function(content) {
	alert('Error: '+ content);
});

forge.event.appResumed.addListener(function(content) {
	alert('App resumed: '+ content);
}, function(content) {
	alert('App resumed error: '+ content);
});