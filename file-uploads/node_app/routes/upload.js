/*
 * POST upload demo route
 */

var fs = require("fs");

console.log('
exports.upload = function(req, res){
	var filename = '/tmp/' + new Date().getTime();

	console.log(JSON.stringify(req.files));

	fs.readFile(req.files.displayImage.path, function (err, data) {
		fs.writeFile(filename, data, function (err) {
			res.send({filename: filename});
		});
	});
};

