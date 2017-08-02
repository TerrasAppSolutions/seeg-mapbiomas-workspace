angular.module('MapBiomas.directives')
    .directive('paginateLinks',
        function() {
            return {
                restrict: 'A',
                template: '<ul class="pagination" style="margin:0"><li ng-repeat="page in pages" ng-class="{active: page.active}"><a href="javascript:;" ng-click="page.link(page.number,pageSize)">{{page.label}}</a></li></ul>',
                replace: false,
                require: '?ngModel',
                scope: {
                    paginate: '=paginate',
                    page: '=page',
                    totalPages: '=totalPages',
                    pageSize: '=pageSize'
                },
                link: function(scope, element, attrs) {

                    scope.$watch('page', function(page) {

                        scope.pages = [];
                        if (page > 1) {
                            scope.pages.push({
                                label: "<<",
                                number: 1,
                                link: scope.paginate
                            });
                        }

                        for (var p = 1; p <= 5; p++) {
                            var pagelink = {};
                            var pg = 0;

                            if (page > 2) {
                                pg = page - 3;
                            }

                            if ((pg + p) <= scope.totalPages) {
                                pagelink = {
                                    label: pg + p,
                                    number: pg + p,
                                    active: false,
                                    link: scope.paginate
                                }
                                if ((pg + p) == page) {
                                    pagelink.active = true;
                                }
                                scope.pages.push(pagelink);
                            }
                        }
                        scope.pages.push({
                            label: ">>",
                            number: scope.totalPages,
                            link: scope.paginate
                        });
                    });
                }
            };
        })
    .directive('mmainSidebar',
        function() {
            return {
                restrict: 'A',
                templateUrl: 'js/app/views/workspace/mainsidebar.html',
                replace: true,
                scope: {},
                link: function(scope, element, attrs) {

                }
            };
        })
    .directive('bootstrapTabs',
        function() {
            return {
                restrict: 'A',
                replace: false,
                link: function(scope, element, attrs) {
                    element.find('a[data-toggle]').click(function() {
                        $(this).tab('show');
                        return false;
                    });
                }
            };
        });;