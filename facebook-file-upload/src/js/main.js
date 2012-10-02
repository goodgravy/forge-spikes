function getImage () {
	forge.file.getImage({source: "gallery", height: "200"}, uploadToFacebook);
}

function uploadToFacebook (image) {
	$('#result').html('authorizing Facebook action...');
	forge.facebook.authorize(["publish_stream"], function (auth) {
		$('#result').html('uploading to Facebook...');
		forge.request.ajax({
			type: 'POST',
			url: 'https://graph.facebook.com/me/photos?access_token='+auth.access_token,
			files: [image],
			success: function (resp) {
				forge.logging.info("successful POST: "+resp);
				$('#result').html('Upload succeeded! Check your Facebook photos');
			},
			error: function (err) {
				$('#result').html('Upload failed! '+JSON.stringify(err));
			}
		});
	},
	function (err) {
		$('#result').html('Upload failed! '+JSON.stringify(err));
	});
}

$(function () {
	$('#fb-upload').on('click', getImage);
});
