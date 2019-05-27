const ScanToEmail = require('../models/scanToEmail');
const fs = require('fs');
const {json2xml, DisplayFormWithCDATA, appendJson, getXml} = require('../util/convert');

// Add new email[email address || ''] to monogo collection
exports.create = function (req, res) {
    fs.writeFile(__dirname + '/../files/scanToEmail.json', JSON.stringify(req.body), (err) => {
        if (err) res.send(err);
        res.send({message:'Added'})
    });
};

// get XML whether if there is email than ok button or else textarea with button
exports.getXml = function (req, res) {
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
    if(result['ScanToEmail']['Destination'] === "") {
        fs.readFile(__dirname + '/../json/email-button.json', 'utf8', function (err, data) {
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
            res.send(data);
        })
    });
};
