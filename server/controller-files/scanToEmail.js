const ScanToEmail = require('../models/scanToEmail');
const fs = require('fs');
const {json2xml, DisplayFormWithCDATA, appendJson, getXml, getMultiSelectItem,
    setActionsForMultiple, xml2json} = require('../util/convert');

// Add new email[email address || ''] to monogo collection
exports.create = function (req, res) {
	fs.writeFile(__dirname + '/../files/password.json', '', (err) => {
		fs.writeFile(__dirname + '/../files/multi-select.json', '', (err) => {
			fs.writeFile(__dirname + '/../files/scanToEmail.json', JSON.stringify(req.body), (err) => {
				if (err) res.send(err);
				res.send({message: 'Added'})
			});
		});
	});
};

exports.createMulti = function (req, res) {
	fs.writeFile(__dirname + '/../files/password.json', '', (err) => {
		fs.writeFile(__dirname + '/../files/scanToEmail.json', '', (err) => {
			if (req.params.canMultiSelect !== null || req.params.canMultiSelect !== undefined) {
				fs.writeFile(__dirname + '/../files/multi-select.json', JSON.stringify(req.body), (err) => {
					if (err) res.send(err);
						res.send({message: 'Added'})
				});
			}
		});
	});
};

// get XML whether if there is email than ok button or else textarea with button
exports.getXml = function (req, res) {
	fs.readFile(__dirname + '/../files/close.json', 'utf8', function (err, closeData) {
		if(closeData === '') {
	fs.readFile(__dirname + '/../files/message.json', 'utf8', function (err, messageData) {
		console.log(messageData)
		if(messageData === '') {
	fs.readFile(__dirname + '/../files/password.json', 'utf8', function (err, passwordData) {
	    if(passwordData === '') {
			fs.readFile(__dirname + '/../files/multi-select.json', 'utf8', function (err, multiData) {
				if(multiData === '') {
					fs.readFile(__dirname + '/../files/scanToEmail.json', 'utf8', function (err, data) {
						let json = '';
						data.toString().split('\n').forEach((line) => {
							if (!line.includes('/*')) {
								json += line.toString()
									.replace("\r\n", "")
									.replace("\r", "")
									.replace("\n", "");
							}
						})
						result = JSON.parse(json);
						if (result['ScanToEmail']['Destination'] === "") {
							fs.readFile(__dirname + '/../json/textarea-button.json', 'utf8', function (err, data) {
								data = JSON.parse(data)
								data['UiScreen']['IoScreen']['IoObject']['TextArea']['Mask'] = 'false';
								data['UiScreen']['IoScreen']['IoObject']['TextArea']['Title'] = 'Enter Email Address';
								data['UiScreen']['Operations']['Op']['_attributes']['action'] = "/file/commandxml/email";
								res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
							})
						} else if (typeof result['ScanToEmail']['Destination'] === "object") {
							fs.readFile(__dirname + '/../json/multi-select.json', 'utf8', function (err, data) {
								data = JSON.parse(data)
								let items = [];
								result['ScanToEmail']['Destination'].forEach((email, index) => {
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
					})
				} else {
					let json = '';
					multiData.toString().split('\n').forEach((line) => {
						if (!line.includes('/*')) {
							json += line.toString()
								.replace("\r\n", "")
								.replace("\r", "")
								.replace("\n", "");
						}
					})
					result = JSON.parse(json);
					fs.readFile(__dirname + '/../json/multi-select.json', 'utf8', function (err, data) {
						data = JSON.parse(data)
						let items = [];
						result['SelectionList']['Selection'].forEach((selection, index) => {
							items.push(getMultiSelectItem(selection, index));
						});
						data = setActionsForMultiple(data, "/file/commandxml/sendToMultiMail", '');
							data['UiScreen']['IoScreen']['IoObject']['Selection']['_attributes']['multiple'] =
                                result['SelectionList']['canMultiSelect'];
							data['UiScreen']['IoScreen']['IoObject']['Selection']['Item'] = items;
							console.log(data['UiScreen']['IoScreen']['IoObject']['Selection']['Item'])
							res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
					})
				}
			});
			} else {
				fs.readFile(__dirname + '/../json/textarea-button.json', 'utf8', function (err, data) {
					data = JSON.parse(data)
					data['UiScreen']['IoScreen']['IoObject']['TextArea']['Mask'] = 'true';
					data['UiScreen']['IoScreen']['IoObject']['TextArea']['Title'] = 'Enter Password';
					data['UiScreen']['Title'] = 'send Password';
					data['UiScreen']['Operations']['Op']['_attributes']['action'] = "/file/commandxml/submit";
					res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
				});
      }
	});
} else {
	fs.readFile(__dirname + '/../json/button.json', 'utf8', function (err, data) {
		data = JSON.parse(data)
		messageData = JSON.parse(messageData)
		 data['UiScreen']['Operations']['Op'][0]['_attributes']['action'] = "/file/commandxml/email";
		 data['UiScreen']['IoScreen']['IoObject']['Message']['_text'] = messageData['message'];
		fs.writeFile(__dirname + '/../files/message.json', '', (err) => {
			res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
		});
	})
}
});
} else {
	fs.readFile(__dirname + '/../files/deactivate.json', 'utf8', function (err, data) {
		fs.writeFile(__dirname + '/../files/close.json', '', (err) => {
		res.send(json2xml(data));
		});
    });
	}
});
}

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
		// res.send(json2xml(json));
		res.redirect('/file/commandxml');
    })
};

// Render xml from last given email
exports.sendMail = function (req, res) {
	req.io.sockets.emit('getXml', {s:1, data:req.xml});
    fs.readFile(__dirname + '/../files/scanToEmail.json', 'utf8', function (err, data) {
        let json = '';
        data.toString().split('\n').forEach((line) => {
            if (!line.includes('/*')) {
                json += line.toString()
                    .replace("\r\n", "")
                    .replace("\r", "")
                    .replace("\n", "");
            }
        })
        result = JSON.parse(json);
        getXml(result, 'ScanToEmail', '_text').then((data) => {
			// res.send(data);
			res.redirect('/file/commandxml');
        })
    });
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
    // fs.readFile(__dirname + '/../files/scanToEmail.json', 'utf8', function (err, data) {
    //     let json = '';
    //     data.toString().split('\n').forEach((line) => {
    //         if (!line.includes('/*')) {
    //             json += line.toString()
    //                 .replace("\r\n", "")
    //                 .replace("\r", "")
    //                 .replace("\n", "");
    //         }
    //     })
    //     result = JSON.parse(json);
    //     getXml(result, 'ScanToEmail', '_text').then((data) => {
    //         // res.send(data);
    //     })
    fs.readFile(__dirname + '/../files/deactivate.json', 'utf8', function (err, data) {
		// res.send(json2xml(data));
		res.redirect('/file/commandxml');
    });
};


exports.createPassword = function (req, res) {
	fs.writeFile(__dirname + '/../files/password.json', JSON.stringify(req.body), (err) => {
		if (err) res.send(err);
		res.send({message: 'Added'})
	});
};

// get XML after submit password
exports.submit = function (req, res) {
	fs.readFile(__dirname + '/../files/password.json', 'utf8', function (err, password) {
	let xml = req.xml;
	if(xml) {
		let jsonXml = xml2json(xml);
		if(jsonXml) {
			jsonXml =JSON.parse(jsonXml);
			password = JSON.parse(password);
			req.io.sockets.emit('getXml', {s:3, data:{"PasswordRequestRes": {
			"UserResponse": password['PasswordRequest']['PasswordToCheck'] == jsonXml['SerioEvent']['UserInput']['UserInputValues']['KeyValueData']['Value']['_text']
			}
			}});
		}	
	}
	fs.readFile(__dirname + '/../files/deactivate.json', 'utf8', function (err, data) {
		// res.send(json2xml(data));
		res.redirect('/file/commandxml');
	});
});
};

exports.createMessage = (req, res) => {
	fs.writeFile(__dirname + '/../files/message.json', JSON.stringify(req.body), (err) => {
		if (err) res.send(err);
		res.send({message: 'Added'})
	});
}

exports.close = (req, res) => {
	fs.writeFile(__dirname + '/../files/close.json', JSON.stringify(req.body), (err) => {
		if (err) res.send(err);
		res.send({message: 'Added'})
	});
}