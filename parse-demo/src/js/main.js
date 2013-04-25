$(function () {
	$('#again').click(push);
});

forge.event.messagePushed.addListener(function (msg) {
	$('body').html('<h1>Message received: '+msg.alert+'</h1>');
});

function push () {
	forge.request.ajax({
		url: 'https://api.parse.com/1/push',
		headers: {
			"X-Parse-Application-Id": "your app id",
			"X-Parse-REST-API-Key": "your REST key"
		},
		contentType: "application/json",
		type: 'POST',
		data: JSON.stringify({
			channels: [""],
			data: { "alert": (new Date()).toString() }
		})
	});
};
push();
