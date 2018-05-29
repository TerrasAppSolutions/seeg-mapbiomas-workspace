/*
 * Modulo Dtree
 */

angular.module('MapBiomas.dtree', []);

angular.module('MapBiomas.dtree')
    .directive('decisionTree', ['$compile', '$injector', '$filter', '$uibModal',
        function($compile, $injector, $filter, $uibModal) {

            var template =
                '<div class="row" ng-show="slidevalueShow">' +
                '<div class="col-xs-9 col-md-9 col-lg-9">' +
                '<div class="form-group">' +
                '<div ui-slider min="{{slideOpts.min}}" max="{{slideOpts.max}}" ' +
                'ng-model="DtreeNodeMap[dtreeNodeLvlPosSelected].rule.thresh" ' +
                'ng-change="dtreeNodeRuleChange()"></div>' +
                '</div>' +
                '</div>' +
                '<div class="col-xs-3 col-md-3 col-lg-3">' +
                '<div class="form-group">' +
                '<input type="number" min="0" max="{{slideOpts.max}}"' +
                'ng-model="DtreeNodeMap[dtreeNodeLvlPosSelected].rule.thresh" ' +
                'ng-change="dtreeNodeRuleChange()" ' +
                'class="form-control"/>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<p ng-hide="slidevalueShow" class="text-light-blue">{{\'DTREESELECIONENODE\' | translate}}</p>' +
                '<div class="dtree" ng-show="dtreeShow" style="min-height:270px">' +
                '</div>';

            return {
                restrict: 'A',
                template: template,
                scope: {
                    dtree: "=decisionTree",
                    dtreeRender: "=dtreeRender",
                    edit: "=edit"
                },
                controller: ['$scope',
                    function($scope) {

                        $scope.dtreeShow = false;

                        $scope.DtreeNodeMap = {};

                        $scope.dtreeNodeLvlPosSelected;

                        $scope.nodeIdSelected;

                        $scope.slidevalueShow = false;

                        $scope.variableMaxMin = $injector.get('VariableMaxMin');

                        $scope.slideOpts = {
                            min: 0,
                            max: 100
                        };

                        var changeDelay;

                        $scope.dtreeNodeRuleChange = function() {

                            if (!$scope.DtreeNodeMap[$scope.dtreeNodeLvlPosSelected]) {
                                return;
                            }

                            var ruleValue = $scope.DtreeNodeMap[$scope.dtreeNodeLvlPosSelected].rule.thresh;

                            var nodeSelector = "li#" + $scope.nodeIdSelected + " > .jstree-anchor .node-value";

                            angular.element(nodeSelector).html(ruleValue);

                            if (changeDelay) {
                                clearTimeout(changeDelay);
                                changeDelay = null;
                            }

                            changeDelay = setTimeout(function() {
                                delete $scope.DtreeNodeMap[undefined]; // bug to fix
                                var dtree = $scope.DtreeNodeMap;
                                $scope.dtreeRender(dtree);
                            }, 500);

                        };

                    }
                ],
                link: function($scope, element, attrs) {

                    var $jsdtree;

                    var jstreeOpts

                    var treeId;

                    var NodeMap;

                    var DtreeNodeMap;

                    var DtreeClasses = $injector.get('DtreeClasses').getClasses();

                    var AreaClasses = DtreeClasses;

                    var layers = [
                        "ndfi","gv","npv",
                        "soil","cloud","gvs","shade","ndvi",
                        "ndwi","savi","evi2","water_mask","fci",
                        "ndfi3","ndfi4","ndfi_amplitude","npvsoil",
                        "gvnpvs","slope","wvi"
                    ].sort();                    

                    var operators = [">", ">=", "<", "<=", "="];

                    /**
                     * inicia componente
                     */
                    var init = function(dtree) {

                        treeId = 0;

                        NodeMap = {};
                        $scope.NodeMap = NodeMap;

                        DtreeNodeMap = {};
                        $scope.DtreeNodeMap = DtreeNodeMap;

                        if (!$jsdtree) {
                            $jsdtree = $(element).find('.dtree')
                                .jstree(jstreeOpts)
                                .on('show_contextmenu.jstree', jsdtreeEventContextMenuShow)
                                .on('after_open.jstree', jsdtreeEventLoadNode)
                                .on('select_node.jstree', jsdtreeEventSelectNode)
                                .on('create_node.jstree', jsdtreeEventCreateNode)
                                .on('refresh.jstree', jsdtreeEventRefreshNodes)
                                .jstree(true);
                        }


                        if (dtree) {
                            var jstreeData = dtreeJsonToJstreeData(dtree);
                            $jsdtree.settings.core.data = jstreeData;
                            $jsdtree.refresh()
                        } else {

                            var jstreeNode = $jsdtree.get_node("dtree_1");

                            if (jstreeNode) {
                                $jsdtree.delete_node(jstreeNode);
                            }

                            var rootNode = new Node({
                                kind: "decision",
                                node: {
                                    level: 1,
                                    position: 1
                                }
                            });

                            $jsdtree.create_node(null, rootNode.getJstreeData(), "last", function(jstreeNodeCreated) {
                                $jsdtree.set_text(jstreeNodeCreated, "Root Node (right-click to add a rule)");
                            });
                        }
                    };

                    /**
                     * Ação de adicionar regra, adicionando duas classes filhas
                     * @param  {jstree.contextmenu.data} data contextmenu
                     */
                    var jstreeRuleAdd = function(data) {

                        var jstreeNodeSelected = $jsdtree.get_node(data.reference);

                        jstreeRuleForm(null, function(formData) {

                            var nodeSelected = NodeMap[jstreeNodeSelected.id];

                            // define no selecionado como regra
                            if (jstreeNodeSelected.type == "class") {
                                nodeSelected.setType("rule");
                            }

                            // aplica dados do formulário
                            if (jstreeNodeSelected.type == "rule") {
                                nodeSelected.dtreeNode.rule = {
                                    variable: formData.variable,
                                    operator: formData.operator,
                                    thresh: formData.thresh
                                };
                            }

                            // cria nós das classes filhas

                            // primeiro cria classe que não atende a regra
                            var classFalse = new Node({
                                kind: "class",
                                class: {
                                    value: formData.classFalseId
                                },
                                node: {
                                    level: null,
                                    position: 1
                                }
                            }, nodeSelected);

                            classFalse.setClassId(formData.classFalseId);

                            // segundo cria classe que atende a regra
                            var classTrue = new Node({
                                kind: "class",
                                class: {
                                    value: formData.classTrueId
                                },
                                node: {
                                    level: null,
                                    position: 2
                                }
                            }, nodeSelected);

                            classTrue.setClassId(formData.classTrueId);

                            // primeiro adiciona que atende a regra
                            // para que visualmente fique em cima da classe 
                            // que nao atende
                            $jsdtree.create_node(jstreeNodeSelected, classTrue.getJstreeData(), "last");

                            // segundo adiciona que não atende a regra
                            // para que visualmente fique abaixo
                            $jsdtree.create_node(jstreeNodeSelected, classFalse.getJstreeData(), "last");

                            setTimeout(function() {
                                nodeSelected.updateJstreeNode();
                                $jsdtree.open_node(jstreeNodeSelected);
                                classTrue.updateJstreeNode();
                                classFalse.updateJstreeNode();
                                $scope.dtreeNodeRuleChange();
                            }, 500);

                        });

                    };

                    /**
                     * Ação de editar regra
                     * @param  {jstree.contextmenu.data} data contextmenu
                     */
                    var jstreeRuleEdit = function(data) {

                        var jstreeNodeSelected = $jsdtree.get_node(data.reference);

                        var nodeSelected = NodeMap[jstreeNodeSelected.id];

                        var dtreenode = nodeSelected.dtreeNode;

                        jstreeRuleForm(dtreenode, function(formData) {

                            dtreenode.rule.variable = formData.variable;
                            dtreenode.rule.operator = formData.operator;
                            dtreenode.rule.thresh = formData.thresh;

                            if (formData.classFalseId) {
                                var children0Lvl = dtreenode.children[0].level;
                                var children0Pos = dtreenode.children[0].position;
                                var nodeChild = _.find(NodeMap, function(n) {
                                    if (n.dtreeNode.node.level == children0Lvl &&
                                        n.dtreeNode.node.position == children0Pos
                                    ) {
                                        return n;
                                    }
                                });
                                nodeChild.setClassId(formData.classFalseId);
                            }

                            if (formData.classTrueId) {

                                var children1Lvl = dtreenode.children[1].level;
                                var children1Pos = dtreenode.children[1].position;

                                var nodeChild = _.find(NodeMap, function(n) {
                                    if (n.dtreeNode.node.level == children1Lvl &&
                                        n.dtreeNode.node.position == children1Pos
                                    ) {
                                        return n;
                                    }
                                });

                                nodeChild.setClassId(formData.classTrueId);
                            }

                            nodeSelected.updateJstreeNode();

                            $scope.dtreeNodeRuleChange();
                        });
                    };

                    /**
                     * Exibor formulario de regra
                     * @param  {Function} callback confirmação dos dados da regra
                     */
                    var jstreeRuleForm = function(dtreeNode, callback) {
                        var modalInstance = $uibModal.open({
                            animation: false,
                            templateUrl: 'js/app/views/dtree/dtree_ruleform.html',
                            size: 'md',
                            controller: ['$scope', '$uibModalInstance',
                                function($modalScope, $uibModalInstance) {

                                    $modalScope.rule = {};

                                    $modalScope.classes = _.map(angular.copy(DtreeClasses), function(value) {
                                        value.classe = value.cod + ' ' + value.classe;
                                        return value;
                                    });

                                    $modalScope.operators = operators;
                                    $modalScope.layers = layers;

                                    $modalScope.classTrueShow = true;
                                    $modalScope.classFalseShow = true;

                                    var init = function() {
                                        if (dtreeNode) {

                                            $modalScope.rule.variable = dtreeNode.rule.variable;
                                            $modalScope.rule.operator = dtreeNode.rule.operator;
                                            $modalScope.rule.thresh = dtreeNode.rule.thresh;

                                            var children0LvlPos = dtreeNode.children[0].level + "-" + dtreeNode.children[0].position;
                                            var children1LvlPos = dtreeNode.children[1].level + "-" + dtreeNode.children[1].position;

                                            $modalScope.classTrueShow = false;
                                            $modalScope.classFalseShow = false;

                                            if (DtreeNodeMap[children0LvlPos].kind == 'class') {
                                                $modalScope.classFalseShow = true;
                                                $modalScope.rule.classFalseId = parseInt(DtreeNodeMap[children0LvlPos].class.value);
                                            }

                                            if (DtreeNodeMap[children1LvlPos].kind == 'class') {
                                                $modalScope.classTrueShow = true;
                                                $modalScope.rule.classTrueId = parseInt(DtreeNodeMap[children1LvlPos].class.value);
                                            }
                                        }
                                    };

                                    $modalScope.confirm = function() {
                                        $uibModalInstance.close($modalScope.rule);
                                    };

                                    $modalScope.modalClose = function() {
                                        $uibModalInstance.dismiss('cancel');
                                    };

                                    init();
                                }
                            ]
                        });

                        modalInstance.result.then(function(rule) {
                            setTimeout(function() {
                                callback(rule);
                                $scope.$apply();
                            }, 1000);
                        });
                    };

                    /**
                     * Ação de remover regra
                     * @param  {jstree.contextmenu.data} data contextmenu
                     */
                    var jstreeRuleRemove = function(data) {

                        var jstreeNodeSelected = $jsdtree.get_node(data.reference);

                        // remove childrens
                        var nodeMapKeys = Object.keys(NodeMap);

                        var childrensRemove = angular.copy(jstreeNodeSelected.children_d);

                        for (var i = 0; i < nodeMapKeys.length; i++) {

                            var nodeMapKey = nodeMapKeys[i];

                            var node = NodeMap[nodeMapKey];

                            var dtreeNodeLvlPos = node.getDtreeNodeLvlPos();

                            var removeKey = _.find(childrensRemove, function(chkey) {
                                return chkey == nodeMapKey;
                            });

                            if (removeKey) {
                                delete NodeMap[nodeMapKey];
                                delete DtreeNodeMap[dtreeNodeLvlPos];
                                $jsdtree.delete_node(nodeMapKey);
                            }
                        }

                        // change type node to class
                        var node = NodeMap[jstreeNodeSelected.id];
                        var dtreeNode = node.dtreeNode;

                        node.setType('class');
                        node.setClassId(1);
                        node.dtreeNode.children = [];

                        $scope.dtreeNodeRuleChange();
                    };


                    /**
                     * Evento de exibição do menu de contexto que configura os itens
                     * de ação que devem ser exibidos em função do tipo do nó seleciondado
                     * @param  {jstree.node} e node do jstree
                     */
                    var jsdtreeEventContextMenuShow = function(node) {
                        var nodeSelectedIds = $jsdtree.get_selected();

                        var nodeSelected = $jsdtree.get_node(nodeSelectedIds[0]);

                        var nodeType = nodeSelected.type;

                        var $jstreeContextmenu = $('.jstree-contextmenu');

                        $jstreeContextmenu.find('li.action').hide();

                        if (nodeType == "rule") {
                            $jstreeContextmenu.find('li.rule-action').show();
                            $jstreeContextmenu.find('li.rule-action-add').hide();
                        } else {
                            $jstreeContextmenu.find('li.rule-action-add').show();
                        }

                        var node = NodeMap[nodeSelected.id];

                        if (node.getDtreeNodeLvlPos() == "1-1") {
                            $jstreeContextmenu.find('li.rule-action-del').hide();
                            if (nodeSelected.children.length == 0) {
                                $jstreeContextmenu.find('li.rule-action-add').show();
                                $jstreeContextmenu.find('li.rule-action-edit').hide();
                            }
                        }

                    };

                    /**
                     * Evento de carregamento dos nós
                     * @param  {jstree.node} e node do jstree
                     */
                    var jsdtreeEventLoadNode = function(e, data) {
                        var childrens = data.node.children_d;
                        childrens.forEach(function(element, index, array) {
                            NodeMap[element].updateJstreeNode();
                        });
                    };

                    /**
                     * Evento de atualização dos nós
                     * @param  {jstree.node} e node do jstree
                     */
                    var jsdtreeEventRefreshNodes = function(e, data) {
                        angular.forEach(NodeMap, function(node, key) {
                            node.updateJstreeNode();
                        });
                    };

                    /**
                     * Evento de carregamento dos nós
                     * @param  {jstree.node} e node do jstree
                     */
                    var jsdtreeEventSelectNode = function(e, data) {
                        if (data.node.type == "rule") {

                            $scope.nodeIdSelected = data.node.id;

                            var node = NodeMap[data.node.id];

                            $scope.dtreeNodeLvlPosSelected =
                                node.dtreeNode.node.level +
                                "-" +
                                node.dtreeNode.node.position;

                            if (node.dtreeNode.rule.variable) {
                                $scope.slideOpts.min = $scope.variableMaxMin[node.dtreeNode.rule.variable].min;
                                $scope.slideOpts.max = $scope.variableMaxMin[node.dtreeNode.rule.variable].max;
                                $scope.slidevalueShow = true;
                            }

                        } else {
                            $scope.slidevalueShow = false;
                        }
                        $scope.$apply();
                    };

                    var jsdtreeEventCreateNode = function() {
                        //$scope.dtreeNodeRuleChange();
                    };

                    var dtreeJsonToJstreeData = function(dtreeJson) {

                        var jstreeData = [];

                        var jstreeDataLvlPos = {};

                        var dtreeNodeKeys = Object.keys(dtreeJson);

                        var createNextNode = function() {

                            var dtreeNodeKey = dtreeNodeKeys.shift();
                            var dtreeNode = dtreeJson[dtreeNodeKey];

                            if (!dtreeNodeKey) {
                                return;
                            }

                            var dtnode = new Node(dtreeNode);

                            jstreeDataLvlPos[dtreeNodeKey] = dtnode.getJstreeData();

                            var parentLvlPos = getNodeParentLvlPos(dtreeNodeKey);

                            if (parentLvlPos) {
                                jstreeDataLvlPos[parentLvlPos].children.unshift(dtnode.getJstreeData());
                            } else {
                                jstreeData.push(dtnode.getJstreeData());
                            }

                            createNextNode();
                        };

                        var getNodeParentLvlPos = function(dtreeLvlPosKey) {
                            var parent = null;
                            angular.forEach(dtreeJson, function(dtreenode) {
                                if (dtreenode.children) {
                                    dtreenode.children.forEach(function(elem) {
                                        if (elem.level == dtreeLvlPosKey.split('-')[0] &&
                                            elem.position == dtreeLvlPosKey.split('-')[1]
                                        ) {
                                            parent = dtreenode.node.level + "-" + dtreenode.node.position;
                                        }
                                    });
                                }
                            });
                            return parent;
                        };

                        createNextNode();

                        return jstreeData;
                    };

                    /**
                     * função contrutor de nó de classe
                     */
                    var Node = function(params, NodeParent) {

                        var _this = this;

                        var _id;

                        var _jstreeId;

                        var _classeArea;

                        var _jstreeData;

                        var _init = function() {

                            _id = ++treeId;

                            // jstree
                            _jstreeId = "dtree_" + _id;

                            if (params && params.kind) {
                                constructFromDtreeNode(params)
                            }

                            // NodeMap
                            NodeMap[_jstreeId] = _this;

                            if (NodeParent) {
                                _this.setParentNode(NodeParent);
                            }

                            _this.dtreeNode.jstreeId = _jstreeId;

                            DtreeNodeMap[_this.dtreeNode.node.level + "-" + _this.dtreeNode.node.position] = _this.dtreeNode;

                            if (_jstreeData.type == "rule") {
                                _this.dtreeNode.kind = "decision";
                            } else {
                                _this.dtreeNode.kind = "class";
                            }
                        };

                        this.dtreeNode = {
                            "kind": "class",
                            "rule": {
                                "variable": null,
                                "operator": null,
                                "thresh": null
                            },
                            "class": {
                                "value": null,
                                "name": null,
                                "color": null
                            },
                            "node": {
                                "level": null,
                                "position": null
                            },
                            "children": []
                        };

                        this.getId = function() {
                            return id;
                        };

                        this.getJstreeId = function() {
                            return jstreeId;
                        };

                        this.getType = function() {
                            return _jstreeData.type;
                        };

                        this.getJstreeData = function() {
                            return _jstreeData;
                        };

                        // comum
                        this.setType = function(type) {
                            var jstreeNode = $jsdtree.get_node(_jstreeId);
                            if (type == "rule") {
                                // jstree
                                $jsdtree.set_type(jstreeNode, "rule");
                                $jsdtree.set_text(jstreeNode, "Rule");

                                // jstree obj
                                _jstreeData.text = "Rule";
                                _jstreeData.type = "rule";
                                _jstreeData.class = "rule";

                                // dtreenode
                                _this.dtreeNode.class = null;
                                _this.dtreeNode.kind = "decision";
                            }

                            if (type == "class") {
                                // jstree
                                $jsdtree.set_type(jstreeNode, "class");
                                $jsdtree.set_text(jstreeNode, "Class");

                                // jstree obj
                                _jstreeData.text = "Class";
                                _jstreeData.type = "class";
                                _jstreeData.class = "class";

                                // dtreenode
                                _this.dtreeNode.kind = "class";
                                _this.dtreeNode.class = {
                                    value: null,
                                        name: null,
                                        color: null
                                };
                            }
                        };

                        this.updateJstreeNode = function() {
                            var jstreeNode = $jsdtree.get_node(_jstreeId);

                            if (_this.dtreeNode.kind == "class") {
                                $jsdtree.set_text(jstreeNode, _classeArea.classe);
                                var $nodeIcon = $("li#" + jstreeNode.id).find('.jstree-icon');
                                $nodeIcon.css('color', _classeArea.color);
                            }

                            if (_this.dtreeNode.kind == "decision") {
                                var text =
                                    "[" + _this.dtreeNode.node.level + "-" + _this.dtreeNode.node.position + "] " +
                                    '<span class="node-rule">' +
                                    _this.dtreeNode.rule.variable + " " +
                                    _this.dtreeNode.rule.operator + " " +
                                    '<span class="node-value">' + _this.dtreeNode.rule.thresh +
                                    "</span>" +
                                    "</span>";

                                $jsdtree.set_text(jstreeNode, text);
                            }
                        }

                        // class
                        this.setClassId = function(classId) {
                            _classeArea = _.findWhere(AreaClasses, {
                                id: classId
                            });

                            _this.dtreeNode.class.color = _classeArea.color;
                            _this.dtreeNode.class.name = _classeArea.classe;
                            _this.dtreeNode.class.value = _classeArea.id;

                            var jstreeNode = $jsdtree.get_node(_jstreeId);

                            if (jstreeNode) {
                                _this.updateJstreeNode();
                            }

                        };

                        this.setParentNode = function(nodeParent) {
                            var parentPos = nodeParent.dtreeNode.node.position;
                            var parentLvl = nodeParent.dtreeNode.node.level;
                            _this.dtreeNode.node.level = parseInt(parentLvl) + 1;
                            if (_this.dtreeNode.node.position == 1) {
                                _this.dtreeNode.node.position = (parentPos * 2) - 1;
                            } else {
                                _this.dtreeNode.node.position = (parentPos * 2);
                            }

                            if (nodeParent.dtreeNode.children) {
                                nodeParent.dtreeNode.children.push(_this.dtreeNode.node);
                            } else {
                                nodeParent.dtreeNode.children = [_this.dtreeNode.node];
                            }

                        };

                        this.getDtreeNodeLvlPos = function() {
                            return _this.dtreeNode.node.level + "-" + _this.dtreeNode.node.position;
                        };

                        var constructFromDtreeNode = function(dtreenode) {

                            _this.dtreeNode = $.extend(true, _this.dtreeNode, dtreenode);

                            if (dtreenode.kind == "decision") {
                                _jstreeData = {
                                    id: _jstreeId,
                                    text: '',
                                    type: "rule",
                                    class: "rule",
                                    children: [],
                                    state: {
                                        opened: true
                                    }
                                };

                                if (dtreenode.rule) {
                                    _jstreeData.text =
                                        "[" + dtreenode.node.level + "-" + dtreenode.node.position + "] " +
                                        '<span class="node-rule">' +
                                        dtreenode.rule.variable + " " +
                                        dtreenode.rule.operator + " " +
                                        '<span class="node-value">' + dtreenode.rule.thresh +
                                        "</span>" +
                                        "</span>";
                                } else {
                                    _jstreeData.text = "Rule";
                                }


                            } else {
                                _jstreeData = {
                                    id: _jstreeId,
                                    text: '',
                                    type: "class",
                                    class: "class",
                                    children: [],
                                    state: {
                                        opened: true
                                    }
                                };

                                _classeArea = _.findWhere(AreaClasses, {
                                    id: parseInt(dtreenode.class.value)
                                });

                                if(!_classeArea){
                                    _classeArea = AreaClasses[0];
                                }

                                _this.dtreeNode.class.color = _classeArea.color;
                                _this.dtreeNode.class.name = _classeArea.classe;
                                _this.dtreeNode.class.value = _classeArea.id;

                                _jstreeData.text = _classeArea.classe;
                                
                            }

                        };

                        _init();
                    };

                    jstreeOpts = {
                        core: {
                            animation: 0,
                            check_callback: true,
                            themes: {
                                stripes: true,
                                dots: true
                            },
                            data: []
                        },
                        contextmenu: {
                            items: {
                                ruleAdd: {
                                    label: $filter('translate')('DTREEREGRAADD'),
                                    _class: 'action rule-action rule-action-add',
                                    action: jstreeRuleAdd
                                },
                                ruleEdit: {
                                    label: $filter('translate')('DTREEREGRAEDIT'),
                                    _class: 'action rule-action rule-action-edit',
                                    action: jstreeRuleEdit
                                },
                                ruleRemove: {
                                    label: $filter('translate')('DTREEREGRAREMOVE'),
                                    _class: 'action rule-action rule-action-del',
                                    action: jstreeRuleRemove
                                }
                            }
                        },
                        types: {
                            rule: {
                                "icon": "fa fa-fw fa-sitemap",
                                "max_children": 2
                            },
                            class: {
                                "icon": "fa fa-fw fa-square",
                                "max_children": 2
                            }
                        },
                        plugins: [                            
                            "state", "types", "contextmenu"
                        ]
                    };

                    if ($scope.edit == false) {
                        delete jstreeOpts.plugins.pop();
                    }

                    $scope.$watch('dtree', function(decisionTree) {
                        if (decisionTree) {

                            var dtree = decisionTree.DecisionTree.dtree;

                            if (!decisionTree.DecisionTree.classe_legenda_id) {
                                decisionTree.DecisionTree.classe_legenda_id = 3;
                            }

                            DtreeClasses = $injector.get('DtreeClasses').getClasses(decisionTree.DecisionTree.classe_legenda_id);
                            AreaClasses = DtreeClasses;

                            init(dtree);

                            $scope.slidevalueShow = false;
                            $scope.dtreeShow = true;
                        } else {
                            init();
                            $scope.dtreeShow = true;
                        }
                    });
                }
            };
        }
    ])
    .directive('dtreemap', ['$injector', '$compile', 'DtreeMapAPI',
        function($injector, $compile, DtreeMapAPI) {
            return {
                restrict: 'A',
                scope: {
                    imagensProcessadas: "=imagensProcessadas",
                    cartaEventClick: "=cartaEventClick",
                },
                link: function($scope, element, attrs) {

                    element.attr('id', 'dtreemap');

                    /*
                     * Inicia Componentes
                     */

                    // inicia mapa                    
                    var $wgisDtreemap = $(element).wgis({
                        osm: false,
                        google: false,
                        switchLayer: false,
                        height: '100%',
                        lmap: {
                            center: [-14.264383087562635, -59.0625],
                            zoom: 5,
                            minZoom: 5,
                            maxZoom: 15,
                            touchZoom: true,
                            scrollWheelZoom: true,
                            doubleClickZoom: true,
                            boxZoom: true,
                            zoomControl: true
                        }
                    });

                    // instancia do mapa 
                    var dtreemap = $wgisDtreemap._wgis.lmap;

                    // injeta instancia do mapa no controle do componente
                    DtreeMapAPI.setMap(dtreemap);

                    // adiciona camada google
                    var googleTerrain = new L.Google('SATELLITE');

                    dtreemap.addLayer(googleTerrain);

                    // camada de cartas                     
                    var cartasLayers = L.geoJson(cartas, {
                        style: {
                            "color": "#78b569",
                            "weight": 0.5,
                            "opacity": 0.1,
                            "fillOpacity": 0,
                        }
                    });

                    dtreemap.addLayer(cartasLayers);

                    dtreemap.fitBounds(cartasLayers.getBounds());

                    // injeta camada de cartas
                    DtreeMapAPI.setCartasLayer(cartasLayers);

                    /*
                     * Configura Eventos
                     */
                    // evento de dbclick na camada de cartas
                    cartasLayers.on('dblclick', function(e) {
                        var carta = e.layer.feature.properties.name;
                        DtreeMapAPI.selectCarta(carta);
                    });

                    // configura açoes do evento de click no 
                    // botão direito do mouse na camada de cartas
                    cartasLayers.on('contextmenu', function(e) {

                        var carta = e.layer.feature.properties.name;

                        var popup = L.popup()
                            .setLatLng(e.latlng)
                            .setContent('<div popup-worklayer="popupparams" style=width:220px></div>');

                        $scope.popupparams = {
                            carta: carta,
                            popup: popup
                        };

                        dtreemap.on('popupopen', function(e) {
                            DtreeMapAPI.setPopupOpened(e.popup);
                            var $popupcontent = $(e.popup._contentNode);
                            $compile($popupcontent)($scope);
                            $scope.$apply();
                        });

                        popup.openOn(dtreemap);
                    });

                    // dispara ações após seleção de uma carta
                    DtreeMapAPI.onSelectedCarta = function(carta) {
                        $scope.cartaEventClick(carta);
                        $scope.$apply();
                    };

                    // Dispara ações quando novos parametros de classificação 
                    // são inseridos no mapa via scope
                    $scope.$watch('imagensProcessadas', function(params) {
                        if (params) {
                            DtreeMapAPI.buildDtreeLayer(params);
                        }
                    });
                }
            };
        }
    ])
    .factory('VariableMaxMin',
        function() {            

            var maxmin = {                
                ndfi: {
                    min: 0,
                    max: 200
                },
                ndfi3: {
                    min: 0,
                    max: 200
                },
                ndfi4: {
                    min: 0,
                    max: 200
                },
                ndfi_amplitude: {
                    min: 0,
                    max: 200
                },
                fci: {
                    min: 0,
                    max: 200
                },
                ndvi: {
                    min: 0,
                    max: 200
                },
                evi2: {
                    min: 0,
                    max: 200
                },
                ndwi: {
                    min: 0,
                    max: 200
                },
                savi: {
                    min: 0,
                    max: 200
                },
                gv: {
                    min: 0,
                    max: 100
                },
                gvs: {
                    min: 0,
                    max: 100
                },
                gvnpvs: {
                    min: 0,
                    max: 100
                },
                npv: {
                    min: 0,
                    max: 100
                },
                soil: {
                    min: 0,
                    max: 100
                },
                npvsoil: {
                    min: 0,
                    max: 100
                },
                cloud: {
                    min: 0,
                    max: 100
                },
                shade: {
                    min: 0,
                    max: 100
                },
                water_mask: {
                    min: 0,
                    max: 255
                },
                slope: {
                    min: 0,
                    max: 100
                }
            };
            return maxmin;
        });