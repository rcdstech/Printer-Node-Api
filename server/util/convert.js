const convert = require('xml-js');
const xml2jsonConfig = {compact: true, spaces: 4, cdataKey: '_cdata'};
const fs = require('fs');
const objectPath = require('object-path')

const xml2json = (data) => {
    return convert.xml2json(data, xml2jsonConfig);
}
const json2xml = (data) => {
    return convert.json2xml(data, xml2jsonConfig);
}
const getXml =(json, xml, attr) => {
    return new Promise((resolve) => {
        fs.readFile(__dirname + '/../json/' + xml + '.json', 'utf8', function (err, data) {
            if (err) throw err;
            let serverJSON = JSON.parse(data);
            if(json && !json.length) {
                json[xml] && Object.keys(json[xml]).forEach((key) => {
                    if (typeof json[xml][key] === 'object') {
                        appendJson(serverJSON, key, json[xml][key], attr);
                    } else {
                        serverJSON = replaceValue(serverJSON, key, json[xml][key], attr);
                    }
                });
            }
            resolve(json2xml(serverJSON));
        });
    });
}
const getXmlWithJSON =(json, xml, replaceObject) => {
    return new Promise((resolve) => {
        fs.readFile(__dirname + '/../json/' + xml + '.json', 'utf8', function (err, data) {
            if (err) throw err;
            let serverJSON = JSON.parse(data);
            let setValue = (propertyPath, value, obj) => objectPath.set(obj, propertyPath, value)
					  let getValue = (propertyPath, obj) => objectPath.get(obj, propertyPath, null) // null is a default value, returns undefined if nothing set

					setValue(replaceObject, json, serverJSON)
					resolve(json2xml(serverJSON));
        });
    });
}
const DisplayFormWithCDATA = (data) => {
    return {
        "_declaration": {
            "_attributes": {
                "version": "1.0",
                "encoding": "utf-8"
            }
        },
        "SerioCommands": {
            "_attributes": {
                "version": "1.2"
            },
            "DisplayForm": {
                "Script": {"_cdata": data}
            }
        }
    }
}
const appendJson = (object, keyToBeReplace, value, attr) => {
    Object.keys(object)
        .forEach(key => {
            if (typeof object[key] === "object") {
                if (key === keyToBeReplace) {
                    let data = [];
                    value[0] && value.forEach((i) => {
                        if (typeof i === 'object') {
                            data.push(i)
                        } else {
                            data.push({[attr]: i})
                        }
                    });
                    object[key] = value[0] ? data : value;
                } else {
                    appendJson(object[key], keyToBeReplace, value, attr);
                }
            }
            return key;
        })
    return object;
}
const replaceValue = (object, keyToBeReplace, value, attr) => {
    Object.keys(object)
        .forEach(key => {
            if (typeof object[key] === "object") {
                key === keyToBeReplace ? object[key][attr] = value === '' ? object[key][attr] : value : replaceValue(object[key], keyToBeReplace, value, attr);
            }
            return key
        })
    return object;
}

const getMultiSelectItem = (data, index) => {
    return {
        "_attributes": {
            "value": data,
            "selected": "false"
        },
        "Label": {
            "_text": data
        }
    }

}

const setActionsForMultiple = (multipleData, okAction, backAction) => {
    multipleData['UiScreen']['Operations']['Op'][0]['_attributes']['action'] = okAction;
    multipleData['UiScreen']['Operations']['Op'][1]['_attributes']['action'] = backAction;
    return multipleData;
}
const removeEmpty = (obj) => {
	let replaceUndefinedOrNull = (key, value) => {
		if (value === null || value === undefined || value === '') {
			return undefined;
		}

		return value;
	}
	obj = JSON.stringify(obj, replaceUndefinedOrNull);
	obj = JSON.parse(obj);
	return obj;
}

module.exports = {
    xml2json,
    json2xml,
    getXml,
    DisplayFormWithCDATA,
    appendJson,
    replaceValue,
    getMultiSelectItem,
    setActionsForMultiple,
	getXmlWithJSON,
	removeEmpty
}
