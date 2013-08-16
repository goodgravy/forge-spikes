$(function () {
	$('a.start').on('click', function () {
		$('a.start').addClass('disabled');
		forge.file.getLocal("small.mp4", function (file) {
			forge.request.ajax({
				url: "http://httpbin.org/post",
				files: [file],
				success: function () {
					$('div.bar').css('width', "0%");
					$('a.start').removeClass('disabled');
				},
				progress: function (progress) {
					$('div.bar').css('width', Math.round(100*progress.done/progress.total)+"%");
				}
			});
		});
	});
});
