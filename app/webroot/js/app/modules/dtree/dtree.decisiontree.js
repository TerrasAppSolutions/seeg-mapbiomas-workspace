/*
 * Modulo Workmap DecisionTree
 */
angular.module('MapBiomas.dtree')
    .factory('DecisionTree', ['$injector',
        function($injector) {

            var DecisionTree = function(dtree) {

                var _this = this;

                _this.dtree = dtree;                

                /**
                 * Set and update dtree json.
                 *
                 * @param {dictionary} dtree
                 */
                this.setDtree = function(dtree) {
                    _this.dtree = dtree;
                };

                /**
                 * Apply the decision rule for a specific node.
                 *
                 * @param {dictionary} pixelData
                 *    ex.{
                 *          "layer1": [0,0,0,0], // rgba
                 *          "layer2": [0,0,0,0],
                 *          "layer3": [0,0,0,0],
                 *          "layern": [0,0,0,0]
                 *       }
                 * @param {String} rule
                 *    ex. {
                 *          "variable": "gv",
                 *          "operator": ">=",
                 *          "thresh"  : 40
                 *        }
                 */

                var applyRule = function(pixelData, rule) {
                    var result = 0;

                    if (rule.operator == '>') {
                        result = pixelData[rule.variable][0] > rule.thresh;

                    } else if (rule.operator == '>=') {
                        result = pixelData[rule.variable][0] >= rule.thresh;

                    } else if (rule.operator == '<') {
                        result = pixelData[rule.variable][0] < rule.thresh;

                    } else if (rule.operator == '<=') {
                        result = pixelData[rule.variable][0] <= rule.thresh;

                    } else if (rule.operator == '=') {
                        result = pixelData[rule.variable][0] == rule.thresh;

                    } else if (rule.operator == '!=') {
                        result = pixelData[rule.variable][0] != rule.thresh;
                    }

                    return result;
                };

                /**
                 * Apply a recursive decision tree classifier.
                 *
                 * @param {dictionary} pixelData
                 *    ex.{
                 *          "layer1": [0,0,0,0], // rgba
                 *          "layer2": [0,0,0,0],
                 *          "layer3": [0,0,0,0],
                 *          "layern": [0,0,0,0]
                 *       }
                 * @param {String} node
                 *    ex. "2-1"
                 */
                var recursion = function(pixelData, node) {

                    var classification;

                    try {

                        if (_this.dtree[node].kind == 'decision') {

                            var result = applyRule(pixelData, _this.dtree[node].rule);

                            var node1 = _this.dtree[node].children[0]; // not agree child
                            var node2 = _this.dtree[node].children[1]; // agree child

                            if (result) {
                                classification = recursion(pixelData, node2.level + "-" + node2.position);
                            } else {
                                classification = recursion(pixelData, node1.level + "-" + node1.position);
                            }

                        } else {
                            var classification = hex2rgba(_this.dtree[node].class.color);
                        }
                    } catch (err) {                     
                        classification = [255, 0, 0, 255];                            
                    }

                    return classification;
                };
                

                /**
                 * Run the recursive function for the first time.
                 * Goes the node arg "1-1" (root).
                 *
                 * @param {dictionary} pixelData
                 *    ex.{
                 *          "layer1": [0,0,0,0], // rgba
                 *          "layer2": [0,0,0,0],
                 *          "layer3": [0,0,0,0],
                 *          "layern": [0,0,0,0]
                 *       }
                 */
                this.classify = function(pixelData) {

                    var classification = recursion(pixelData, "1-1");

                    return classification;
                };


                var hex2rgba = function(h) {
                    var r = parseInt(((h.charAt(0) == "#") ? h.substring(1, 7) : h).substring(0, 2), 16);
                    var g = parseInt(((h.charAt(0) == "#") ? h.substring(1, 7) : h).substring(2, 4), 16);
                    var b = parseInt(((h.charAt(0) == "#") ? h.substring(1, 7) : h).substring(4, 6), 16);
                    return [r, g, b, 255];
                };

            };

            return DecisionTree;
        }
    ]);