var data = {
    "attributes": {
        "first_name": "John",
        "last_name": "Smith",
        "email": "john.smith@aol.com",
        "phone": "5551112234",
        "address": "",
        "city": "",
        "state": "",
        "zip": "",
        "race": "7",
        "theDate": "10/02/2012",
        "formName": "DriverWaiver",
        "imported": true
    },
    "_operations": {},
    "_dirty": {},
    "_hashedJSON": {},
    "_escapedAttributes": {},
    "cid": "c38",
    "id": "beLlUqrUBl",
    "createdAt": "2012-10-02T17:51:38.267Z",
    "updatedAt": "2012-10-02T17:51:38.267Z",
    "_setting": false,
    "_previousAttributes": {
        "first_name": "John",
        "last_name": "Smith",
        "email": "john.smith@aol.com",
        "phone": "5551112234",
        "address": "",
        "city": "",
        "state": "",
        "zip": "",
        "race": "7",
        "theDate": "10/02/2012",
        "formName": "DriverWaiver",
        "imported": true
    }
}

$(function () {
	$('#save-object').on('click', function () {
		forge.prefs.set('my-object', data);
		$('#result').text('saved data!');
	});
	$('#get-object').on('click', function () {
		forge.prefs.get('my-object', function (result) {
			forge.logging.info('initial data: '+JSON.stringify(data));
			forge.logging.info('retreived data: '+JSON.stringify(result));
			$('#result').text('retreived data: '+JSON.stringify(result));
		});
	});
});
