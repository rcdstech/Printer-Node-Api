const {json2xml, DisplayFormWithCDATA, appendJson, getXml, getMultiSelectItem,
    setActionsForMultiple, xml2json} = require('../util/convert');
const fs = require('fs');
let jsonObject = '';
// Add new email[email address || ''] to monogo collection
exports.create = function (req, res) {
	jsonObject = req.body;
  res.send({message: 'Added'})
};

exports.createPassword = function (req, res) {
	jsonObject = req.body;
	res.send({message: 'Added'})
};


exports.createMulti = function (req, res) {
	jsonObject = req.body;
	res.send({message: 'Added'})
};


exports.createMessage = (req, res) => {
	jsonObject = req.body;
	res.send({message: 'Added'})
};

exports.close = (req, res) => {
	jsonObject = {close: true};
	res.send({message: 'Added'})
};


// Render XML after enter email from Printer b=as soon as i restart node please try it
exports.getEmailXml = function (req, res) {
	let xml = req.xml;
	if(xml) {
		let jsonXml = xml2json(xml);
		if(jsonXml) {
			jsonXml =JSON.parse(jsonXml);
			console.log()
			req.io.sockets.emit('getXml', {s:1, data:{"ScanToEmailRes": {
				"Destination": jsonXml['SerioEvent']['UserInput']['UserInputValues']['KeyValueData']['Value']['_text'],
				"Status": "ACK"}
			}});
		}
	}
	fs.readFile(__dirname + '/../json/ScanToEmail.json', 'utf8', function (err, data) {
		let json = appendJson(JSON.parse(data), 'Destination', [req.val || req.email || req.body.email ], '_text');
	 jsonObject = '';
	 res.send(json2xml(json));
		//res.redirect('/file/commandxml');
	});
};


// Render xml from last given email
exports.sendMail = function (req, res) {
	req.io.sockets.emit('getXml', {s:1, data:req.xml});
		getXml(jsonObject, 'ScanToEmail', '_text').then((data) => {
			jsonObject = '';
			res.send(data);
			// res.redirect('/file/commandxml');
		})
};

// Render xml from last given Multi email
exports.sendToMultiMail = function (req, res) {
	let xml = req.xml;
	if(xml) {
		let jsonXml = xml2json(xml);
		if(jsonXml) {
			jsonXml =JSON.parse(jsonXml);
			if(jsonXml['SerioEvent']['UserInput']['UserInputValues']['KeyValueData']['Value'] !== undefined) {
				req.io.sockets.emit('getXml', {s:2, data:{"SelectionListRes": {
					"SelectionChoice": jsonXml['SerioEvent']['UserInput']['UserInputValues']['KeyValueData']['Value']['_text']
				}}});
			} else {
				let selectedItem = []
				jsonXml['SerioEvent']['UserInput']['UserInputValues']['KeyValueData'].forEach(i => {
					selectedItem.push(i['Value']['_text']);
				})
				req.io.sockets.emit('getXml', {s:2, data:{"SelectionList": {
					"canMultiSelect":"true",
					"Selection": selectedItem
				}}});
			}
		}
	}
	 jsonObject = '';
		res.redirect('/file/commandxml');
};

// get XML after submit password
exports.submit = function (req, res) {
		let xml = req.xml;
		if(xml) {
			let jsonXml = xml2json(xml);
			if(jsonXml) {
				jsonXml =JSON.parse(jsonXml);
				req.io.sockets.emit('getXml', {s:3, data:{"PasswordRequestRes": {
					"UserResponse": jsonObject['PasswordRequest']['PasswordToCheck'] == jsonXml['SerioEvent']['UserInput']['UserInputValues']['KeyValueData']['Value']['_text']
				}
				}});
	 jsonObject = jsonObject['PasswordRequest']['PasswordToCheck'] == jsonXml['SerioEvent']['UserInput']['UserInputValues']['KeyValueData']['Value']['_text']
	 ? '' : jsonObject;
			}
		}
			res.redirect('/file/commandxml');
};

exports.getXml = function (req, res) {
	console.log(jsonObject)

	if(jsonObject !== '' ) {
		const jsonType = Object.keys(jsonObject)[0];
		if(jsonType === 'ScanToEmail') {
			if (jsonObject['ScanToEmail']['Destination'] === "") {
				fs.readFile(__dirname + '/../json/textarea-button.json', 'utf8', function (err, data) {
					data = JSON.parse(data)
					data['UiScreen']['IoScreen']['IoObject']['TextArea']['Mask'] = 'false';
					data['UiScreen']['IoScreen']['IoObject']['TextArea']['Title'] = 'Enter Email Address';
					data['UiScreen']['Operations']['Op']['_attributes']['action'] = "/file/commandxml/email";
					res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
				})
			} else if (typeof jsonObject['ScanToEmail']['Destination'] === "object") {
				fs.readFile(__dirname + '/../json/multi-select.json', 'utf8', function (err, data) {
					data = JSON.parse(data)
					let items = [];
					jsonObject['ScanToEmail']['Destination'].forEach((email, index) => {
						items.push(getMultiSelectItem(email, index));
					});
					data = setActionsForMultiple(data, "/file/commandxml/sendToMultiMail", '');
					fs.readFile(__dirname + '/../files/canMultiSelect.json', 'utf8', function (err, multiData) {
						data['UiScreen']['IoScreen']['IoObject']['Selection']['_attributes']['multiple'] =
							JSON.parse(multiData).canMultiSelect;
						data['UiScreen']['IoScreen']['IoObject']['Selection']['Item'] = items;
						console.log(data['UiScreen']['IoScreen']['IoObject']['Selection']['Item'])
						res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
					});
				})
			} else {
				fs.readFile(__dirname + '/../json/button.json', 'utf8', function (err, data) {
					res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
				})
			}
		}
		else if(jsonType === 'SelectionList') {
			fs.readFile(__dirname + '/../json/multi-select.json', 'utf8', function (err, data) {
				data = JSON.parse(data)
				let items = [];
				jsonObject['SelectionList']['Selection'].forEach((selection, index) => {
					items.push(getMultiSelectItem(selection, index));
				});
				data = setActionsForMultiple(data, "/file/commandxml/sendToMultiMail", '');
				data['UiScreen']['IoScreen']['IoObject']['Selection']['_attributes']['multiple'] =
				jsonObject['SelectionList']['canMultiSelect'];
				data['UiScreen']['IoScreen']['IoObject']['Selection']['Item'] = items;
				res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
			});
		}
		else if(jsonType === 'PasswordRequest') {
			fs.readFile(__dirname + '/../json/textarea-button.json', 'utf8', function (err, data) {
				data = JSON.parse(data)
				data['UiScreen']['IoScreen']['IoObject']['TextArea']['Mask'] = 'true';
				data['UiScreen']['IoScreen']['IoObject']['TextArea']['Title'] = 'Enter Password';
				data['UiScreen']['Title'] = 'send Password';
				data['UiScreen']['Operations']['Op']['_attributes']['action'] = "/file/commandxml/submit";
				res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
			});
		}
		else if(jsonType === 'message') {
			fs.readFile(__dirname + '/../json/button.json', 'utf8', function (err, data) {
				data = JSON.parse(data)
				data['UiScreen']['Operations']['Op'][0]['_attributes']['action'] = "/file/commandxml";
				data['UiScreen']['IoScreen']['IoObject']['Message']['_text'] = jsonObject['message'];
				jsonObject = '';
				res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
			});
			}
		else if(jsonType === 'close') {
			fs.readFile(__dirname + '/../json/deactivate.json', 'utf8', function (err, data) {
					res.send(json2xml(data));
			});
		}
	} else {
		res.send('<?xml version="1.0" encoding="utf-8"?>' +
		'<SerioCommands version="1.0">' +
		 '<DeactivateLock>' +
		'<JobFinAckUrl>http://192.168.0.60:8101/file/commandxml</JobFinAckUrl>' +
		'</DeactivateLock>' +
	 '</SerioCommands>');
	 //res.redirect('/file/commandxml');
	}
};
