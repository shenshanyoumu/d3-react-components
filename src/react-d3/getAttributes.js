import toCamelCase from '../utils/toCamelCase';

// parameter node is in-memeory for react 
export default function(attributesObject, node) {
    let attributes = {}
    for (let key in attributesObject) {
        if (!isNaN(key)) {
            // transform 'class' to 'className'
            if (attributesObject[key].localName === 'class') {
                attributes['className'] = attributesObject[key].nodeValue;
            } else if (attributesObject[key].localName.indexOf('-') > -1) {

                // transform xx-yy to xxYy
                let reactKey = toCamelCase(attributesObject[key].localName);
                attributes[reactKey] = attributesObject[key].nodeValue;
            } else {
                attributes[attributesObject[key].localName] = attributesObject[key].nodeValue;
            }

        }
    }

    // if in-memory node has below attributes
    if (node['data-react-d3-id']) {
        attributes['data-react-d3-id'] = node['data-react-d3-id']
    }

    if (node['__transition__']) {
        attributes['__transition__'] = node['__transition__'];
    }

    // becarful,key in node may be '__transition__'
    // and key may be '__data__'
    for (let key in node) {
        if (key.slice(0, 2) === '__') {
            attributes[key] = node[key];
        }
    }

    return attributes;
}