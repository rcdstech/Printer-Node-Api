const pd = require('pretty-data').pd;
const xml2js = require('xml2js');
const xpath = require("xml2js-xpath");
const convert = require('xml-js');
const parser = new xml2js.Parser({explicitArray : false});
// Parse the XML response from printer to json
let parse = (req, res, next) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        data += chunk;
    });
    io.emit('by-printer', { 'xml': data });
    req.on('end', function() {
        req.xml = pd.xml(data.slice(data.search('<SerioEvent version'), data.search('</SerioEvent>')+13));
        parser.parseString(req.xml, function (err, result) {
            req.js = result;
            req.userId = xpath.find(result, "//UserId")[0];
            req.key = xpath.find(result, "//Key")[0];
            req.val = xpath.find(result, "//Value")[0];
        });
        next();
    });
}
module.exports = parse
