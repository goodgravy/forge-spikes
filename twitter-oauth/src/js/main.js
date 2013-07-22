function percentEncode (string) {
	return encodeURIComponent(string).replace('!', '%21');
}

function queryStringToHash (queryString) {
	// queryString shouldn't include leading ?
	var match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };

	urlParams = {};
	while (match = search.exec(queryString)) {
		urlParams[decode(match[1])] = decode(match[2]);
	}
	return urlParams;
}

function createSignature(method, url, parameters, consumerSecret, oauth_token_secret) {
	// oauth_token_secret is optional - for example when making a request for a token!

	var parser = document.createElement('a');
	parser.href = url;

	var noQueryUrl = parser.protocol + "//" + parser.host + parser.pathname,
		query = parser.search,
		i,
		parameter,
		encodedSortedParameters = [],
		parameterString = "";

	if (query) {
		// remove leading "?"
		var queryParams = query.slice(1).split("&");
		for (i = 0; i < queryParams.length; i++) {
			parameter = queryParams[i].split("=");
			if (parameter.length === 1) {
				parameter[1] = "";
			}
			parameters[decodeURIComponent(parameter[0])] = decodeURIComponent(parameter[1]);
		}
	}

	for (var key in parameters) {
		encodedSortedParameters.push([
			percentEncode(key),
			percentEncode(parameters[key])
		]);
	}

	encodedSortedParameters.sort(function (a, b) {
		return a[0] > b[0];
	});

	for (i = 0; i < encodedSortedParameters.length; i++) {
		parameterString += encodedSortedParameters[i][0];
		parameterString += "=";
		parameterString += encodedSortedParameters[i][1];
		parameterString += "&";
	}

	// delete last character (trailing &)
	parameterString = parameterString.slice(0, parameterString.length - 1);

	var signatureBaseString = method.toUpperCase();
	signatureBaseString += "&";
	signatureBaseString += percentEncode(noQueryUrl);
	signatureBaseString += "&";
	signatureBaseString += percentEncode(parameterString);

	var signingKey = percentEncode(window.consumerSecret);
	signingKey += "&";
	if (window.oauth_token_secret !== null) {
		signingKey += percentEncode(oauth_token_secret);
	}

	var shaObj = new jsSHA(signatureBaseString, "TEXT");
	var hmac = shaObj.getHMAC(signingKey, "TEXT", "SHA-1", "B64");

	return hmac;
}

function createOAuthHeader (method, url, parameters) {
	var header = "OAuth ";

	var oAuthParameters = {};
	oAuthParameters.oauth_consumer_key = window.oauth_consumer_key;
	if (window.oauth_token !== null) {
		oAuthParameters.oauth_token = window.oauth_token;
	}
	oAuthParameters.oauth_nonce = window.btoa(forge.tools.UUID());
	oAuthParameters.oauth_signature_method = "HMAC-SHA1";
	oAuthParameters.oauth_timestamp = Math.floor((new Date()).getTime() / 1000);
	oAuthParameters.oauth_version = "1.0";

	var paramsToSign = $.extend({}, parameters, oAuthParameters);

	var signature = createSignature(method, url, paramsToSign, consumerSecret, oauth_token_secret);

	oAuthParameters.oauth_signature = signature;

	for (var key in oAuthParameters) {
		header += percentEncode(key);
		header += '="';
		header += percentEncode(oAuthParameters[key]);
		header += '", ';
	}

	header = header.slice(0, header.length - 2);

	return header;
}

function makeSignedRequest (method, url, data, success, error) {
	var oAuthHeader = createOAuthHeader(method, url, data);

	forge.request.ajax({
		type: method,
		url: url,
		headers: {
			'Authorization': oAuthHeader
		},
		data: data,
		success: function (res) {
			forge.logging.info(res);
			success && success(res);
		},
		error: function (err) {
			forge.logging.error(err);
			error && error(error);
		}
	});
	
}

$(function () {
	$('.go').on('click', function () {
		// var consumerKey = forge.config.modules.parameters.consumerKey,
		// consumerSecret = forge.config.modules.parameters.consumerSecret,
		window.oauth_consumer_key = "RTF5M6lhAWuLLqzYYpYyAA";
		window.consumerSecret = "CLTKwJLr1gv2QHjXAWFE5OzKwx8ojkuM4gedGeJXnc";
		window.oauth_token = null;
		window.oauth_token_secret = null;

		if (window.oauth_consumer_key === undefined || window.consumerSecret === undefined) {
			forge.logging.error("'consumerKey' and 'consumerSecret' should be defined in your parameters module");
			return;
		}

		// get a request token
		makeSignedRequest('POST', 'https://api.twitter.com/oauth/request_token', {oauth_callback: "http://mycallback.com/"},
			function (res) {
				var resHash = queryStringToHash(res);
				window.oauth_token = resHash.oauth_token;
				window.oauth_token_secret = resHash.oauth_token_secret;

				forge.tabs.openWithOptions({
					url: 'https://api.twitter.com/oauth/authorize?oauth_token='+percentEncode(window.oauth_token),
					pattern: 'http://mycallback.com/*',
					title: 'Twitter Authentication'
				}, function (data) {
					if (data.userCancelled) {
						return;
					}
					var parser = document.createElement('a');
					parser.href = data.url;
					var resultParams = queryStringToHash(parser.search.substring(1));

					makeSignedRequest('POST',
						'https://api.twitter.com/oauth/access_token',
						{oauth_verifier: resultParams.oauth_verifier},
						function (res) {
							var resHash = queryStringToHash(res);
							forge.logging.info(resHash);
							window.oauth_token = '14562419-4jRNHUtCXYEL6HYzhVSZpgsfUp4VcDryFOfDrKLnU';
							window.oauth_token_secret = '54H41EnJTENxjh9ygtJr10mvBDkkeDPhXIuY9hxQU';
							$('.output').text("Hello "+resHash.screen_name);
						}
					);
				});
			}
		);

	});
});