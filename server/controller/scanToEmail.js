const ScanToEmail = require('../models/scanToEmail');
const fs = require('fs');
const {json2xml, DisplayFormWithCDATA, appendJson, getXml} = require('../util/convert');

// Add new email[email address || ''] to monogo collection
exports.create = function (req, res) {
    let scanToEmail = new ScanToEmail(req.body);
    scanToEmail.save((err) => {
        if(err) {
            res.send(err);
        }
        res.send({message:'Added'})
    })
};

// get XML whether if there is email than ok button or else textarea with button
exports.getXml = function (req, res) {
    ScanToEmail.findOne().sort({createdAt: -1}).exec((err, result) => {
    if(result['ScanToEmail']['Destination'] === "") {
        fs.readFile(__dirname + '/../json/textarea-button.json', 'utf8', function (err, data) {
            data = JSON.parse(data)
            data['UiScreen']['IoScreen']['IoObject']['TextArea']['Mask'] = 'false';
            data['UiScreen']['IoScreen']['IoObject']['TextArea']['Title'] = 'Enter Email Address';
            data['UiScreen']['Operations']['Op']['_attributes']['action'] = "./commandxml/email";
            res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
        })
    } else {
        fs.readFile(__dirname + '/../json/button.json', 'utf8', function (err, data) {
            res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
        })
    }
    })
};

// Render XML after enter email from Printer
exports.getEmailXml = function (req, res) {
    fs.readFile(__dirname + '/../json/ScanToEmail.json', 'utf8', function (err, data) {
        let json = appendJson(JSON.parse(data), 'Destination', [req.val || req.email || req.body.email ], '_text');
        res.send(json2xml(json));
    })
};

// Render xml from last given email
exports.sendMail = function (req, res) {
    ScanToEmail.findOne().sort({createdAt: -1}).exec((err, result) => {
        getXml(result, 'ScanToEmail', '_text').then((data) => {
            res.send(data);
        })
    });
};

// Render xml from last given Multi email
exports.sendToMultiMail = function (req, res) {
    console.log(req.xml)
    ScanToEmail.findOne().sort({createdAt: -1}).exec((err, result) => {
        getXml(result, 'ScanToEmail', '_text').then((data) => {
            res.send(data);
        })
    });
};
