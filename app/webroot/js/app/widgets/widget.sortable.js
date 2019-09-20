(function () {
    'use strict';

    angular
        .module('MapBiomas.widgets')
        .directive('widgetSortable', widgetSortable);

    function widgetSortable() {

        /*
         * Parametros da diretiva
         */
        var directive = {
            restrict: 'A',
            link: widgetSortableLink,
            scope: {
                addElement: '&',
                removeElement: '&',
                changePosition: '&',
                startSortable: '='
            }
        };

        return directive;

        function widgetSortableLink(scope, element, attrs) {
            var el1 = document.getElementById('list1');
            var el2 = document.getElementById('list2');
            var sortable1 = Sortable.create(el1, {
                animation: 200,
                sort: false,
                group: {
                    name: "shared",
                    pull: "clone",
                    put: false,
                    revertClone: true,
                }
            });
            var sortable2 = Sortable.create(el2, {
                group: "shared",
                animation: 200,
                sort: true,
                filter: ".js-remove", // Class name for the chosen item
                group: {
                    name: "shared",
                },
                // Element is dropped into the list from another list
                onAdd: function (evt) {
                    // forcing to get the right index
                    evt.oldIndex = Number(evt.item.dataset.id);
                    
                    scope.addElement({
                        info: evt
                    });
                },
                // Attempt to drag a filtered element
                onFilter: function (evt) {
                    var item = evt.item,
                        ctrl = evt.target;

                    if (Sortable.utils.is(ctrl, ".js-remove")) { // Click on remove button
                        item.parentNode.removeChild(item); // remove sortable item
                        scope.removeElement({
                            index: evt.oldIndex
                        });
                    }
                },
                // Changed sorting within list
                onUpdate: function (evt) {
                    // same properties as onEnd
                     scope.changePosition({
                         info: evt
                     });
                },
            });

            /**
             * Função que adiciona elementos ao trocar o projeto
             * http: //jsfiddle.net/06y0w14b/
             * @param {data} data elementos para serem adicionados
             */
            scope.startSortable.run = function (data) {
                var lst = $(el2).parent().find('.tile__list');
                // remove os elementos anteriores
                lst.empty();

                for (var i = 0; i < data.length; i++) {
                    var element = data[i];
                    var template = '<div class="list-group-item">';
                    template += '<div style="background-color:' + element.Classe.cor + '" class="block-color-classe"></div>';
                    template += '<span>' + element.Classe.classe + '</span>';
                    template += '<i class="js-remove">✖</i>';
                    template += '</div>';
                    lst.append(template);
                }
            };
            
        }
    }
})();