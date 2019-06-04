const ScanToEmail = require('../models/scanToEmail');
const fs = require('fs');
const {json2xml, DisplayFormWithCDATA, appendJson, getXml, getMultiSelectItem,
    setActionsForMultiple, xml2json} = require('../util/convert');

// Add new email[email address || ''] to monogo collection
exports.create = function (req, res) {
    fs.writeFile(__dirname + '/../files/allInOne.json', JSON.stringify(req.body), (err) => {
        if (err) res.send(err);
        res.send({message: 'Added'})
    });
};

exports.createPassword = function (req, res) {
    fs.writeFile(__dirname + '/../files/allInOne.json', JSON.stringify(req.body), (err) => {
        if (err) res.send(err);
        res.send({message: 'Added'})
    });
};


exports.createMulti = function (req, res) {
    fs.writeFile(__dirname + '/../files/allInOne.json', JSON.stringify(req.body), (err) => {
        if (err) res.send(err);
        res.send({message: 'Added'})
    });
};


exports.getXml = function (req, res) {
    fs.readFile(__dirname + '/../files/allInOne.json', 'utf8', function (err, data) {
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
        if(result['ScanToEmail']) {
            if (result['ScanToEmail']['Destination'] === "") {
                fs.readFile(__dirname + '/../json/textarea-button.json', 'utf8', function (err, data) {
                    data = JSON.parse(data)
                    data['UiScreen']['IoScreen']['IoObject']['TextArea']['Mask'] = 'false';
                    data['UiScreen']['IoScreen']['IoObject']['TextArea']['Title'] = 'Enter Email Address';
                    data['UiScreen']['Operations']['Op']['_attributes']['action'] = "./commandxml/continue";
                    res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
                })
            }
        } else if(result['SelectionList']) {
            fs.readFile(__dirname + '/../json/multi-select.json', 'utf8', function (err, data) {
                data = JSON.parse(data)
                let items = [];
                result['SelectionList']['Selection'].forEach((selection, index) => {
                    items.push(getMultiSelectItem(selection, index));
                });
                data = setActionsForMultiple(data, "./commandxml/continue", '');
                data['UiScreen']['IoScreen']['IoObject']['Selection']['_attributes']['multiple'] =
                    result['SelectionList']['canMultiSelect'];
                data['UiScreen']['IoScreen']['IoObject']['Selection']['Item'] = items;
                res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
            })

        } else if(result['PasswordRequest']) {
            fs.readFile(__dirname + '/../json/textarea-button.json', 'utf8', function (err, data) {
                data = JSON.parse(data)
                data['UiScreen']['IoScreen']['IoObject']['TextArea']['Mask'] = 'true';
                data['UiScreen']['IoScreen']['IoObject']['TextArea']['Title'] = 'Enter Password';
                data['UiScreen']['Title'] = 'send Password';
                data['UiScreen']['Operations']['Op']['_attributes']['action'] = "./commandxml/continue";
                res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
            });
        }
    });
};

exports.continue = (req, res) => {

}
