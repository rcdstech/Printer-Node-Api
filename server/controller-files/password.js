const fs = require('fs');
const {
    json2xml, DisplayFormWithCDATA, appendJson, getXml, getMultiSelectItem,
    setActionsForMultiple
} = require('../util/convert');

exports.create = function (req, res) {
    fs.writeFile(__dirname + '/../files/password.json', JSON.stringify(req.body), (err) => {
        if (err) res.send(err);
        res.send({message: 'Added'})
    });
};


// get XML textarea with button
exports.getXml = function (req, res) {
    fs.readFile(__dirname + '/../json/textarea-button.json', 'utf8', function (err, data) {
        data = JSON.parse(data)
        data['UiScreen']['IoScreen']['IoObject']['TextArea']['Mask'] = 'true';
        data['UiScreen']['IoScreen']['IoObject']['TextArea']['Title'] = 'Enter Password';
        data['UiScreen']['Operations']['Op']['_attributes']['action'] = "./password/submit";
        res.send(json2xml(DisplayFormWithCDATA(json2xml(data))))
    });
};

// get XML after submit password
exports.submit = function (req, res) {
    console.log(req.xml)
};
