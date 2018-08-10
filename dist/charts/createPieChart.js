(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'd3'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('d3'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.d3);
        global.createPieChart = mod.exports;
    }
})(this, function (exports, _d) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });


    // data is all pass PieChart creator
    var createPieChart = function createPieChart(data) {

        // create a in-memory node as chart container
        var node = document.createElement('div');

        var radius = Math.min(data.width, data.height) / 2;

        var color = (0, _d.scaleOrdinal)().range(data.colors);

        var arc = svg.arc().outerRadius(radius - 10).innerRadius(0);

        var labelArc = svg.arc().outerRadius(radius - 40).innerRadius(radius - 40);

        var pie = pie().sort(null).value(function (d) {
            return d.quantity;
        });

        var svg = (0, _d.select)(node).append("svg").attr("width", data.width).attr("height", data.height).append("g").attr("transform", "translate(" + data.width / 2 + "," + data.height / 2 + ")");

        var g = svg.selectAll(".arc").data(pie(data.dataSet)).enter().append("g").attr("class", data.arcClass);

        g.append("path").attr("d", arc).style("fill", function (d) {
            return color(d.data.label);
        });

        g.append("text").attr("transform", function (d) {
            return "translate(" + labelArc.centroid(d) + ")";
        }).attr("dy", ".35em").text(function (d) {
            return d.data.label;
        });

        var type = function type(d) {
            d.quantity = +d.quantity;
            return d;
        };

        return node;
    };

    exports.default = createPieChart;
});