const {
	json2xml,
	DisplayFormWithCDATA,
	appendJson,
	getXml,
	getMultiSelectItem,
	setActionsForMultiple,
	xml2json,
	getXmlWithJSON,
	removeEmpty
  } = require("../util/convert");
  const fs = require("fs");
  let jsonObject = "";
  
  //saves Jason request in memory
  exports.create = function(req, res) {
	jsonObject = req.body;
	res.send({ message: "Added" });
  };
  
  exports.createPassword = function(req, res) {
	jsonObject = req.body;
	res.send({ message: "Added" });
  };
  
  exports.createMulti = function(req, res) {
	jsonObject = req.body;
	res.send({ message: "Added" });
  };
  
  exports.createMessage = (req, res) => {
	jsonObject = req.body;
	res.send({ message: "Added" });
  };
  
  exports.close = (req, res) => {
	jsonObject = { close: true };
	res.send({ message: "Added" });
  };
  
  // Render XML after enter email from Printer b=as soon as i restart node please try it
  exports.getEmailXml = function(req, res) {
	let xml = req.xml;
	if (xml) {
	  let jsonXml = xml2json(xml);
	  if (jsonXml) {
		jsonXml = JSON.parse(jsonXml);
		console.log();
		req.io.sockets.emit("getJson", {
		  s: "ScanToEmail",
		  data: {
			ScanToEmailRes: {
			  Destination:
				jsonXml["SerioEvent"]["UserInput"]["UserInputValues"][
				  "KeyValueData"
				]["Value"]["_text"],
			  Status: "ACK"
			}
		  }
		});
	  }
	}
	fs.readFile(__dirname + "/../json/ScanToEmail.json", "utf8", function(
	  err,
	  data
	) {
	  let json = appendJson(
		JSON.parse(data),
		"Destination",
		[req.val || req.email || req.body.email],
		"_text"
	  );
	  jsonObject = "";
	  res.send(json2xml(json));
	  //res.redirect('/file/commandxml');
	});
  };
  
  // Render xml from last given email
  exports.sendMail = function(req, res) {
	req.io.sockets.emit("getJson", { s: "ScanToEmail", data: req.xml });
	getXmlWithJSON(
	  removeEmpty(jsonObject)["ScanToEmail"],
	  "ScanToEmail",
	  "SerioCommands.IoScanAndSend"
	).then(data => {
	  jsonObject = "";
	  res.send(data);
	  // res.redirect('/file/commandxml');
	});
  };
  
  // Render xml from last given FTP
  exports.ScanToFTP = function(req, res) {
	req.io.sockets.emit("getJson", { s: "ScanToFTP", data: req.xml });
	let ScanToFTP = jsonObject["ScanToFTP"];
	try {
		ScanToFTP['JobFinAckUrl']="/file/commandxml";
	  if (ScanToFTP["TxProfiles"]["Ftp"]["FtpParams"]["StoreDir"]) {
		ScanToFTP["TxProfiles"]["Ftp"]["FtpParams"]["HostAddress"] = "";
	  }
	} catch {}
	jsonObject["ScanToFTP"] = ScanToFTP;
	getXmlWithJSON(
	  removeEmpty(jsonObject)["ScanToFTP"],
	  "ScanToFTP",
	  "SerioCommands.IoScanAndSend"
	)
	  .then(data => {
		console.log(data);
		jsonObject = "";
		res.send(data);
		// res.redirect('/file/commandxml');
	  })
	  .catch(err => {
		console.log(err);
		jsonObject = "";
		res.send(err);
	  });
  };
  
  // Render xml from last given Multi email
  exports.sendToMultiMail = function(req, res) {
	let xml = req.xml;
	if (xml) {
	  let jsonXml = xml2json(xml);
	  if (jsonXml) {
		jsonXml = JSON.parse(jsonXml);
		if (
		  jsonXml["SerioEvent"]["UserInput"]["UserInputValues"]["KeyValueData"][
			"Value"
		  ] !== undefined
		) {
		  req.io.sockets.emit("getJson", {
			s: "MultiSelection",
			data: {
			  SelectionListRes: {
				SelectionChoice:
				  jsonXml["SerioEvent"]["UserInput"]["UserInputValues"][
					"KeyValueData"
				  ]["Value"]["_text"]
			  }
			}
		  });
		} else {
		  let selectedItem = [];
		  jsonXml["SerioEvent"]["UserInput"]["UserInputValues"][
			"KeyValueData"
		  ].forEach(i => {
			selectedItem.push(i["Value"]["_text"]);
		  });
		  req.io.sockets.emit("getJson", {
			s: "MultiSelection",
			data: {
			  SelectionList: {
				canMultiSelect: jsonObject["SelectionList"]["canMultiSelect"],
				Selection: selectedItem
			  }
			}
		  });
		}
	  }
	}
	jsonObject = "";
	res.redirect("/file/commandxml");
  };
  
  // get XML after submit password
  exports.submit = function(req, res) {
	let xml = req.xml;
	if (xml) {
	  let jsonXml = xml2json(xml);
	  if (jsonXml) {
		jsonXml = JSON.parse(jsonXml);
		req.io.sockets.emit("getJson", {
		  s: "Password",
		  data: {
			PasswordRequestRes: {
			  UserResponse:
				jsonObject["PasswordRequest"]["PasswordToCheck"] ==
				jsonXml["SerioEvent"]["UserInput"]["UserInputValues"][
				  "KeyValueData"
				]["Value"]["_text"]
			}
		  }
		});
		jsonObject =
		  jsonObject["PasswordRequest"]["PasswordToCheck"] ==
		  jsonXml["SerioEvent"]["UserInput"]["UserInputValues"]["KeyValueData"][
			"Value"
		  ]["_text"]
			? ""
			: jsonObject;
	  }
	}
	res.redirect("/file/commandxml");
  };
  
  exports.getXml = function(req, res) {
	if (jsonObject !== "") {
	  const jsonType = Object.keys(jsonObject)[0];
	  if (jsonType === "ScanToEmail") {
		if (jsonObject["ScanToEmail"]["Destination"] === "") {
		  fs.readFile(
			__dirname + "/../json/textarea-button.json",
			"utf8",
			function(err, data) {
			  data = JSON.parse(data);
			  data["UiScreen"]["IoScreen"]["IoObject"]["TextArea"]["Mask"] =
				"false";
			  data["UiScreen"]["IoScreen"]["IoObject"]["TextArea"]["Title"] =
				"Enter Email Address";
			  data["UiScreen"]["Operations"]["Op"]["_attributes"]["action"] =
				"/file/commandxml/email";
			  res.send(json2xml(DisplayFormWithCDATA(json2xml(data))));
			}
		  );
		} else if (typeof jsonObject["ScanToEmail"]["Destination"] === "object") {
		  fs.readFile(__dirname + "/../json/multi-select.json", "utf8", function(
			err,
			data
		  ) {
			data = JSON.parse(data);
			let items = [];
			jsonObject["ScanToEmail"]["Destination"].forEach((email, index) => {
			  items.push(getMultiSelectItem(email, index));
			});
			data = setActionsForMultiple(
			  data,
			  "/file/commandxml/sendToMultiMail",
			  ""
			);
			fs.readFile(
			  __dirname + "/../files/canMultiSelect.json",
			  "utf8",
			  "<JobFinAckUrl>/file/commandxml</JobFinAckUrl>" +
				function(err, multiData) {
				  data["UiScreen"]["IoScreen"]["IoObject"]["Selection"][
					"_attributes"
				  ]["multiple"] = JSON.parse(multiData).canMultiSelect;
				  data["UiScreen"]["IoScreen"]["IoObject"]["Selection"][
					"Item"
				  ] = items;
				  res.send(json2xml(DisplayFormWithCDATA(json2xml(data))));
				}
			);
		  });
		} else {
		  fs.readFile(__dirname + "/../json/button.json", "utf8", function(
			err,
			data
		  ) {
			res.send(json2xml(DisplayFormWithCDATA(json2xml(data))));
		  });
		}
	  } else if (jsonType === "SelectionList") {
		fs.readFile(__dirname + "/../json/multi-select.json", "utf8", function(
		  err,
		  data
		) {
		  data = JSON.parse(data);
		  let items = [];
		  jsonObject["SelectionList"]["Selection"].forEach((selection, index) => {
			items.push(getMultiSelectItem(selection, index));
		  });
		  data = setActionsForMultiple(
			data,
			"/file/commandxml/sendToMultiMail",
			""
		  );
		  data["UiScreen"]["IoScreen"]["IoObject"]["Selection"]["_attributes"][
			"multiple"
		  ] = jsonObject["SelectionList"]["canMultiSelect"];
		  data["UiScreen"]["IoScreen"]["IoObject"]["Selection"]["Item"] = items;
		  res.send(json2xml(DisplayFormWithCDATA(json2xml(data))));
		});
	  } else if (jsonType === "PasswordRequest") {
		fs.readFile(__dirname + "/../json/textarea-button.json", "utf8", function(
		  err,
		  data
		) {
		  data = JSON.parse(data);
		  data["UiScreen"]["IoScreen"]["IoObject"]["TextArea"]["Mask"] = "true";
		  data["UiScreen"]["IoScreen"]["IoObject"]["TextArea"]["Title"] =
			"Enter Password";
		  data["UiScreen"]["Title"] = "send Password";
		  data["UiScreen"]["Operations"]["Op"]["_attributes"]["action"] =
			"/file/commandxml/submit";
		  res.send(json2xml(DisplayFormWithCDATA(json2xml(data))));
		});
	  } else if (jsonType === "message") {
		fs.readFile(__dirname + "/../json/button.json", "utf8", function(
		  err,
		  data
		) {
		  data = JSON.parse(data);
		  data["UiScreen"]["Operations"]["Op"][0]["_attributes"]["action"] =
			"/file/commandxml";
		  data["UiScreen"]["IoScreen"]["IoObject"]["Message"]["_text"] =
			jsonObject["message"];
		  jsonObject = "";
		  res.send(json2xml(DisplayFormWithCDATA(json2xml(data))));
		});
	  } else if (jsonType === "close") {
		fs.readFile(__dirname + "/../json/deactivate.json", "utf8", function(
		  err,
		  data
		) {
		  res.send(json2xml(data));
		});
	  } else if (jsonType === "Print") {
		fs.readFile(__dirname + "/../json/print.json", "utf8", function(
		  err,
		  data
		) {
		  let fileJson = JSON.parse(data);
		  let authentication = {
			AuthenticationProfiles: {
			  HttpAuth: {
				HttpAuthParams: jsonObject["Authentication"]
			  }
			}
		  };
		  let requestJson;
		  if (
			jsonObject["Authentication"]["User"] &&
			jsonObject["Authentication"]["Password"]
		  ) {
			requestJson = { ...authentication, ...jsonObject["Print"] };
		  } else {
			requestJson = { ...jsonObject["Print"] };
		  }
		  fileJson["SerioCommands"]["IoDirectPrint"] = requestJson;
		  jsonObject = "";
		  res.send(json2xml(fileJson));
		});
	  } else if (jsonType === "xml") {
		var xml = jsonObject.xml;
		jsonObject = "";
		res.send(xml);
	  } else if (jsonType === "ScanToFTP") {
		fs.readFile(__dirname + "/../json/button.json", "utf8", function(
		  err,
		  data
		) {
		  data = JSON.parse(data);
		  data["UiScreen"]["Operations"]["Op"][0]["_attributes"]["action"] =
			"/file/commandxml/ScanToFTP";
		  data["UiScreen"]["IoScreen"]["IoObject"]["Message"]["_text"] =
			"Press OK or START to Scan and send FTP.";
		  res.send(json2xml(DisplayFormWithCDATA(json2xml(data))));
		});
	  }
	} else {
	  res.send(
		'<?xml version="1.0" encoding="utf-8"?>' +
		  '<SerioCommands version="1.0">' +
		  "<DeactivateLock>" +
		  "<JobFinAckUrl>/file/commandxml</JobFinAckUrl>" +
		  "</DeactivateLock>" +
		  "</SerioCommands>"
	  );
	}
  };
  