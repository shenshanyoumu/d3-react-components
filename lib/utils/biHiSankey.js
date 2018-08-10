"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var biHiSankey = {},

    // the default width of node in visualization
    nodeWidth = 24,
        nodeSpacing = 8,
        linkSpacing = 5,


    //set the distance between link arrow and node icon
    arrowheadScaleFactor = 0,
        size = [1, 1],
        nodes = [],
        nodeMap = {},
        parentNodes = [],
        leafNodes = [],
        links = [],
        xScaleFactor = 1,
        yScaleFactor = 1,
        defaultLinkCurvature = 0.5;

    function center(node) {
        return node.y + node.height / 2;
    }

    function value(link) {
        return link.value;
    }

    function initializeNodeArrayProperties(node) {

        node.sourceLinks = [];
        node.rightLinks = [];
        node.targetLinks = [];
        node.leftLinks = [];
        node.connectedNodes = [];

        // make nodes tree topology
        node.children = [];
        node.ancestors = [];
    }

    function initializeNodeMap() {
        nodes.forEach(function (node) {
            nodeMap[node.id] = node;
            initializeNodeArrayProperties(node);
        });
    }

    function computeLeafNodes() {
        leafNodes = nodes.filter(function (node) {
            return !node.children.length;
        });
    }

    function computeParentNodes() {
        parentNodes = nodes.filter(function (node) {
            return node.children.length;
        });
    }

    // recursively iterate current node and descendant to add ancestors attribute in every node
    function addAncestorsToChildren(node) {
        node.children.forEach(function (child) {
            child.ancestors = child.ancestors.concat(this.ancestors.concat([this]));
            addAncestorsToChildren(child);
        }, node);
    }

    function computeNodeHierarchy() {
        var parent = void 0,
            rootNodes = [];

        nodes.forEach(function (node) {
            parent = nodeMap[node.parent];
            if (parent) {
                node.parent = parent;
                parent.children.push(node);
            } else {
                node.parent = null;
                rootNodes.push(node);
            }
        });

        computeLeafNodes();
        computeParentNodes();

        rootNodes.forEach(function (rNode) {
            addAncestorsToChildren(rNode);
        });
    }

    function computeNodeLinks() {
        var sourceNode = void 0,
            targetNode = void 0;
        links.forEach(function (link) {
            sourceNode = nodeMap[link.source] || link.source;
            targetNode = nodeMap[link.target] || link.target;
            link.id = link.source + "-" + link.target;
            link.source = sourceNode;
            link.target = targetNode;
            sourceNode.sourceLinks.push(link);
            targetNode.targetLinks.push(link);
        });
    }
    // the state of nodes connected by links is expanded
    function visible(linkCollection) {
        return linkCollection.filter(function (link) {
            return link.source.state === "expanded" && link.target.state === "expanded";
        });
    }

    // when click node to collpase,all child links collapsed to ancestor nodes
    function computeAncestorLinks() {

        leafNodes.forEach(function (leafNode) {
            leafNode.sourceLinks.forEach(function (sourceLink) {
                var ancestorTargets = void 0,
                    target = sourceLink.target;
                if (leafNodes.indexOf(target) >= 0) {

                    ancestorTargets = target.ancestors.filter(function (tAncestor) {
                        return leafNode.ancestors.indexOf(tAncestor) < 0;
                    });
                    ancestorTargets.forEach(function (ancestorTarget) {
                        var ancestorLink = {
                            source: leafNode,
                            target: ancestorTarget,
                            value: sourceLink.value,
                            id: leafNode.id + "-" + ancestorTarget.id
                        };

                        leafNode.sourceLinks.push(ancestorLink);
                        ancestorTarget.targetLinks.push(ancestorLink);
                        links.push(ancestorLink);
                    });
                }
            });

            leafNode.targetLinks.forEach(function (targetLink) {
                var ancestorSources = void 0,
                    source = targetLink.source;
                if (leafNodes.indexOf(source) >= 0) {
                    ancestorSources = source.ancestors.filter(function (sAncestor) {
                        return leafNode.ancestors.indexOf(sAncestor) < 0;
                    });
                    ancestorSources.forEach(function (ancestorSource) {
                        var ancestorLink = {
                            source: ancestorSource,
                            target: leafNode,
                            value: targetLink.value,
                            id: ancestorSource.id + "-" + leafNode.id
                        };
                        ancestorSource.sourceLinks.push(ancestorLink);
                        leafNode.targetLinks.push(ancestorLink);
                        links.push(ancestorLink);
                    });
                }
            });
        });

        // 
        parentNodes.forEach(function (parentNode) {
            parentNode.sourceLinks.forEach(function (sourceLink) {
                var ancestorTargets = void 0,
                    target = sourceLink.target;
                if (leafNodes.indexOf(target) >= 0) {
                    ancestorTargets = target.ancestors.filter(function (tAncestor) {
                        return parentNode.ancestors.indexOf(tAncestor) < 0;
                    });
                    ancestorTargets.forEach(function (ancestorTarget) {
                        var ancestorLink = {
                            source: parentNode,
                            target: ancestorTarget,
                            value: sourceLink.value,
                            id: parentNode.id + "-" + ancestorTarget.id
                        };

                        parentNode.sourceLinks.push(ancestorLink);
                        ancestorTarget.targetLinks.push(ancestorLink);
                        links.push(ancestorLink);
                    });
                }
            });
        });
    }

    //merge links by source Node and target node
    function mergeLinks() {
        var linkGroups = (0, _d.nest)().key(function (link) {
            return link.source.id + "->" + link.target.id;
        }).entries(links).map(function (object) {
            return object.values;
        });
        links = linkGroups.map(function (linkGroup) {
            return linkGroup.reduce(function (previousLink, currentLink) {
                return {
                    source: previousLink.source,
                    target: previousLink.target,
                    id: (0, _d.min)([previousLink.id, currentLink.id]),
                    value: previousLink.value + currentLink.value
                };
            });
        });
    }

    function nodeHeight(sideLinks) {

        var spacing = Math.max(sideLinks.length - 1, 0) * linkSpacing,
            scaledValueSum = (0, _d.sum)(sideLinks, value) * yScaleFactor;
        return scaledValueSum + spacing;
    }

    // 
    function computeNodeValues() {
        nodes.forEach(function (node) {

            node.value = Math.max((0, _d.sum)(node.leftLinks, value), (0, _d.sum)(node.rightLinks, value));

            node.netFlow = (0, _d.sum)(visible(node.targetLinks), value) - (0, _d.sum)(visible(node.sourceLinks), value);

            node.height = Math.max(nodeHeight(visible(node.leftLinks)), nodeHeight(visible(node.rightLinks)));

            node.linkSpaceCount = Math.max(Math.max(node.leftLinks.length, node.rightLinks.length) - 1, 0);
        });
    }

    function computeConnectedNodes() {
        var sourceNode = void 0,
            targetNode = void 0;
        links.forEach(function (link) {
            sourceNode = link.source;
            targetNode = link.target;

            if (sourceNode.connectedNodes.indexOf(targetNode) < 0) {
                sourceNode.connectedNodes.push(targetNode);
            }
            if (targetNode.connectedNodes.indexOf(sourceNode) < 0) {
                targetNode.connectedNodes.push(sourceNode);
            }
        });
    }

    function sourceAndTargetNodesWithSameX() {
        var nodeArray = [];

        links.filter(function (link) {
            return link.target.x === link.source.x;
        }).forEach(function (link) {
            if (nodeArray.indexOf(link.target) < 0) {
                nodeArray.push(link.target);
            }
        });
        return nodeArray;
    }

    function compressInXDirection() {
        var connectedNodesXPositions = void 0,
            nodesByXPosition = (0, _d.nest)().key(function (node) {
            return node.x;
        }).sortKeys(_d.ascending).entries(nodes).map(function (object) {
            return object.values;
        });

        nodesByXPosition.forEach(function (xnodes) {
            xnodes.forEach(function (node) {
                connectedNodesXPositions = node.connectedNodes.map(function (connectedNode) {
                    return connectedNode.x;
                });

                // 
                while (node.x > 0 && connectedNodesXPositions.indexOf(node.x - 1) < 0) {
                    node.x -= 1;
                }
            });
        });
    }

    function scaleNodeXPositions() {

        var minX = (0, _d.min)(nodes, function (node) {
            return node.x;
        }),
            maxX = (0, _d.max)(nodes, function (node) {
            return node.x;
        }) - minX;

        // calculate chart scaleFactor based on DOM width
        xScaleFactor = (size[0] - nodeWidth) / maxX;

        // beautify chart for visualization
        nodes.forEach(function (node) {
            node.x *= xScaleFactor;
        });
    }

    function computeNodeXPositions() {
        var remainingNodes = nodes,
            nextNodes = void 0,
            x = 0,
            addToNextNodes = function addToNextNodes(link) {
            if (nextNodes.indexOf(link.target) < 0 && link.target.x === this.x) {
                nextNodes.push(link.target);
            }
        },
            setValues = function setValues(node) {
            node.x = x;
            node.width = nodeWidth;

            node.sourceLinks.forEach(addToNextNodes, node);
        };

        while (remainingNodes.length) {
            nextNodes = [];
            remainingNodes.forEach(setValues);
            if (nextNodes.length) {
                remainingNodes = nextNodes;
            } else {
                remainingNodes = sourceAndTargetNodesWithSameX();
            }
            x += 1;
        }

        compressInXDirection();
        scaleNodeXPositions();
    }

    function computeLeftAndRightLinks() {
        var source = void 0,
            target = void 0;
        nodes.forEach(function (node) {
            node.rightLinks = [];
            node.leftLinks = [];
        });
        links.forEach(function (link) {
            source = link.source;
            target = link.target;
            if (source.x < target.x) {
                source.rightLinks.push(link);
                target.leftLinks.push(link);
                link.direction = 1;
            } else {
                source.leftLinks.push(link);
                target.rightLinks.push(link);
                link.direction = -1;
            }
        });
    }

    function adjustTop(adjustment) {
        nodes.forEach(function (node) {
            node.y -= adjustment;
        });
    }

    function computeNodeYPositions(iterations) {
        var minY = void 0,
            alpha = void 0,
            nodesByXPosition = (0, _d.nest)().key(function (node) {
            return node.x;
        }).sortKeys(_d.ascending).entries(nodes).map(function (object) {
            return object.values;
        });

        function calculateYScaleFactor() {
            var linkSpacesCount = void 0,
                nodeValueSum = void 0,
                discretionaryY = void 0;
            yScaleFactor = (0, _d.min)(nodesByXPosition, function (nodes) {
                linkSpacesCount = (0, _d.sum)(nodes, function (node) {
                    return node.linkSpaceCount;
                });
                nodeValueSum = (0, _d.sum)(nodes, function (node) {
                    return node.value;
                });
                discretionaryY = size[1] - (nodes.length - 1) * nodeSpacing - linkSpacesCount * linkSpacing;

                return discretionaryY / nodeValueSum;
            });

            links.forEach(function (link) {
                var linkLength = Math.abs(link.source.x - link.target.x),
                    linkHeight = link.value * yScaleFactor;
                if (linkLength / linkHeight < 4) {
                    yScaleFactor = 0.25 * linkLength / link.value;
                }
            });
        }

        function initializeNodeYPosition() {
            nodesByXPosition.forEach(function (nodes) {
                nodes.forEach(function (node, i) {
                    node.y = i;

                    node.heightAllowance = node.value * yScaleFactor + linkSpacing * node.linkSpaceCount;
                });
            });
        }

        function calculateLinkThickness() {
            links.forEach(function (link) {
                link.thickness = link.value * yScaleFactor;
            });
        }

        function relaxLeftToRight(alpha) {

            function weightedSource(link) {
                return center(link.source) * link.value;
            }

            nodesByXPosition.forEach(function (nodes) {
                nodes.forEach(function (node) {

                    if (node.rightLinks.length) {
                        var y = (0, _d.sum)(node.rightLinks, weightedSource) / (0, _d.sum)(node.rightLinks, value);
                        node.y += (y - center(node)) * alpha;
                    }
                });
            });
        }

        function relaxRightToLeft(alpha) {
            function weightedTarget(link) {
                return center(link.target) * link.value;
            }

            nodesByXPosition.slice().reverse().forEach(function (nodes) {
                nodes.forEach(function (node) {
                    if (node.leftLinks.length) {
                        var y = (0, _d.sum)(node.leftLinks, weightedTarget) / (0, _d.sum)(node.leftLinks, value);
                        node.y += (y - center(node)) * alpha;
                    }
                });
            });
        }

        function resolveCollisions() {

            function ascendingYPosition(a, b) {
                return a.y - b.y;
            }

            nodesByXPosition.forEach(function (nodes) {
                var node = void 0,
                    dy = void 0,
                    y0 = 0,
                    n = nodes.length,
                    i = void 0;

                nodes.sort(ascendingYPosition);

                for (i = 0; i < n; ++i) {
                    node = nodes[i];
                    dy = y0 - node.y;
                    if (dy > 0) {
                        node.y += dy;
                    }
                    y0 = node.y + node.heightAllowance + nodeSpacing;
                }

                dy = y0 - nodeSpacing - size[1];
                if (dy > 0) {
                    node.y -= dy;
                    y0 = node.y;

                    for (i = n - 2; i >= 0; --i) {
                        node = nodes[i];
                        dy = node.y + node.heightAllowance + nodeSpacing - y0;
                        if (dy > 0) {
                            node.y -= dy;
                        }
                        y0 = node.y;
                    }
                }
            });
        }

        calculateYScaleFactor();
        initializeNodeYPosition();
        calculateLinkThickness();
        resolveCollisions();

        for (alpha = 1; iterations > 0; --iterations) {
            alpha *= 0.99;
            relaxRightToLeft(alpha);
            resolveCollisions();
            relaxLeftToRight(alpha);
            resolveCollisions();
        }

        minY = (0, _d.min)(nodes, function (node) {
            return node.y;
        });

        adjustTop(minY);
    }

    function computeLinkYPositions() {
        function ascendingLeftNodeYPosition(a, b) {

            var aLeftNode = a.direction > 0 ? a.source : a.target,
                bLeftNode = b.direction > 0 ? b.source : b.target;
            return aLeftNode.y - bLeftNode.y;
        }

        function ascendingRightNodeYPosition(a, b) {

            var aRightNode = a.direction > 0 ? a.target : a.source,
                bRightNode = b.direction > 0 ? b.target : b.source;
            return aRightNode.y - bRightNode.y;
        }

        nodes.forEach(function (node) {
            node.rightLinks.sort(ascendingRightNodeYPosition);
            node.leftLinks.sort(ascendingLeftNodeYPosition);
        });

        nodes.forEach(function (node) {
            var rightY = 0,
                leftY = 0;

            node.rightLinks.forEach(function (link) {
                if (link.direction > 0) {
                    link.sourceY = rightY;
                    // 
                    if (link.target.state === "collapsed") {
                        rightY += link.thickness + linkSpacing;
                    }
                } else {
                    link.targetY = rightY;
                    if (link.source.state === "collapsed") {
                        rightY += link.thickness + linkSpacing;
                    }
                }
            });

            node.leftLinks.forEach(function (link) {
                if (link.direction < 0) {
                    link.sourceY = leftY;
                    if (link.target.state === "collapsed") {
                        leftY += link.thickness + linkSpacing;
                    }
                } else {
                    link.targetY = leftY;
                    if (link.source.state === "collapsed") {
                        leftY += link.thickness + linkSpacing;
                    }
                }
            });
        });
    }

    biHiSankey.arrowheadScaleFactor = function (_) {
        if (!arguments.length) {
            return arrowheadScaleFactor;
        }
        arrowheadScaleFactor = +_;
        return biHiSankey;
    };

    biHiSankey.collapsedNodes = function () {
        return nodes.filter(function (node) {
            return node.state === "collapsed";
        });
    };

    biHiSankey.connected = function (nodeA, nodeB) {
        return nodeA.connectedNodes.indexOf(nodeB) >= 0;
    };

    biHiSankey.expandedNodes = function () {
        return nodes.filter(function (node) {
            return node.state === "expanded";
        });
    };

    biHiSankey.layout = function (iterations) {
        computeNodeXPositions();
        computeLeftAndRightLinks();
        computeNodeValues();
        computeNodeYPositions(iterations);
        computeNodeValues();
        computeLinkYPositions();
        return biHiSankey;
    };

    biHiSankey.link = function () {
        var curvature = defaultLinkCurvature;

        function leftToRightLink(link) {
            var arrowHeadLength = link.thickness * arrowheadScaleFactor,
                straightSectionLength = 3 * link.thickness / 4 - arrowHeadLength,
                x0 = link.source.x + link.source.width,
                x1 = x0 + arrowHeadLength / 2,
                x4 = link.target.x - straightSectionLength - arrowHeadLength,
                xi = (0, _d.interpolateNumber)(x0, x4),
                x2 = xi(curvature),
                x3 = xi(1 - curvature),
                y0 = link.source.y + link.sourceY + link.thickness / 2,
                y1 = link.target.y + link.targetY + link.thickness / 2;
            return "M" + x0 + "," + y0 + "L" + x1 + "," + y0 + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x4 + "," + y1 + "L" + (x4 + straightSectionLength) + "," + y1;
        }

        function rightToLeftLink(link) {
            var arrowHeadLength = link.thickness * arrowheadScaleFactor,
                straightSectionLength = link.thickness / 4,
                x0 = link.source.x,
                x1 = x0 - arrowHeadLength / 2,
                x4 = link.target.x + link.target.width + straightSectionLength + arrowHeadLength,
                xi = (0, _d.interpolateNumber)(x0, x4),
                x2 = xi(curvature),
                x3 = xi(1 - curvature),
                y0 = link.source.y + link.sourceY + link.thickness / 2,
                y1 = link.target.y + link.targetY + link.thickness / 2;
            return "M" + x0 + "," + y0 + "L" + x1 + "," + y0 + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x4 + "," + y1 + "L" + (x4 - straightSectionLength) + "," + y1;
        }

        function link(d) {

            if (d.source.x < d.target.x) {
                return leftToRightLink(d);
            }
            return rightToLeftLink(d);
        }

        link.curvature = function (_) {
            if (!arguments.length) {
                return curvature;
            }
            curvature = +_;
            return link;
        };

        return link;
    };

    biHiSankey.links = function (_) {
        if (!arguments.length) {
            return links;
        }
        links = _.filter(function (link) {
            return link.source !== link.target;
        });
        return biHiSankey;
    };

    biHiSankey.linkSpacing = function (_) {
        if (!arguments.length) {
            return linkSpacing;
        }
        linkSpacing = +_;
        return biHiSankey;
    };

    biHiSankey.nodes = function (_) {
        if (!arguments.length) {
            return nodes;
        }
        nodes = _;
        return biHiSankey;
    };

    biHiSankey.nodeWidth = function (_) {
        if (!arguments.length) {
            return nodeWidth;
        }
        nodeWidth = +_;
        return biHiSankey;
    };

    biHiSankey.nodeSpacing = function (_) {
        if (!arguments.length) {
            return nodeSpacing;
        }
        nodeSpacing = +_;
        return biHiSankey;
    };

    biHiSankey.relayout = function () {
        computeLeftAndRightLinks();
        computeNodeValues();
        computeLinkYPositions();
        return biHiSankey;
    };

    biHiSankey.size = function (_) {
        if (!arguments.length) {
            return size;
        }
        size = _;
        return biHiSankey;
    };

    biHiSankey.visibleLinks = function () {
        return visible(links);
    };

    // 初始化nodes
    biHiSankey.initializeNodes = function (callback) {
        initializeNodeMap();
        computeNodeHierarchy();
        computeNodeLinks();
        computeAncestorLinks();
        mergeLinks();
        computeConnectedNodes();

        nodes.forEach(callback);
        return biHiSankey;
    };

    return biHiSankey;
};

var _d = require("d3");