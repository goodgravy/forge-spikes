
var fs = require("fs");

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

/*
 * POST upload demo route
 */
exports.upload = function(req, res){
	var filename = '/tmp/' + new Date().getTime();

	console.log(JSON.stringify(req.files));

	fs.readFile(req.files.test.path, function (err, data) {
		fs.writeFile(filename, data, function (err) {
			res.send({filename: filename});
		});
	});
};

