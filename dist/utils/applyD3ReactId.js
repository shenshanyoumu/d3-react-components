(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.applyD3ReactId = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = applyD3ReactId;
    function applyD3ReactId(children, counter) {
        var count = -1;
        var length = 0;
        var childCount = 0;
        var parentCount = 0;
        var result = { state: {}, children: [] };

        function apply(parent) {
            count++;
            parent.forEach(function (child, i) {
                var d3Attributes = Object.keys(child);
                var id = child.localName + '.' + counter + '.' + parentCount + '.' + count;

                // for every child given a specided id。
                // as we can see child is modifed
                var currentNode = child['data-react-d3-id'] = id;
                var resultObj = result.state[id] = {};

                // if child has childNodes
                if (child.childNodes.length) {
                    length = child.childNodes.length;
                }

                // child obj has attribute
                if (d3Attributes.length) {
                    d3Attributes.forEach(function (key) {
                        // shallow copy child to resultObj
                        resultObj[key] = child[key];
                    });
                } else {
                    // if child obj has no iterated attributes
                    resultObj['__data__'] = null;
                }
                if (count === length) {
                    count = 0, parentCount++;
                }

                return child.childNodes.length ? [].slice.call(child.childNodes).forEach(function (child) {
                    return apply([child]);
                }) : [];
            });
        }

        apply(children);
        result.children = children;
        return result;
    }
});