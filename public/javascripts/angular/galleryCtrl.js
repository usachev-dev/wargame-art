app.controller("galleryCtrl",['$scope','galleryData','systemsData','genresData','filterFilter','$location',galleryCtrl])
function galleryCtrl($scope,galleryData,systemsData,genresData,filterFilter,$location){
    //console.log(Object.keys($location.search()).length == 0);
    //console.log($location.search().foo===undefined);
    //console.log($location.search().foo);
    this.title = "Gallery of awesome";
    this.strapline = "All miniatures here";
    var i;
    var params,temp;
    var self = this;
    self.scrollBusy=false;
    $scope.textFilter='';
    $scope.selectGenres={};
    $scope.selectSystems={};
    $scope.selectLevels={};
    $scope.lastLoadedGallery = 0;
    self.showedGalleries = {};
    if ($location.search().levels===undefined){
        $scope.selectLevels = {
            1:true,
            2:true,
            3:true
        };
    } else {
        params = $location.search().levels.split(',');
        for (i=1;i<4;i++){
            if (params.indexOf(i.toString())!==-1){
                $scope.selectLevels[i] = true;
            } else {
                $scope.selectLevels[i] = false;
            }
        }
    }

    self.systemsFilter = function(gallery){
        return $scope.selectSystems[gallery.system];
    };
    self.genresFilter = function(gallery){
        return $scope.selectGenres[gallery.genre];
    };
    self.levelsFilter = function(gallery){
        return $scope.selectLevels[gallery.level];
    };

    self.foundGalleries = '';
    this.parseFound = function(){
        switch (self.filteredGalleries.length % 10) {
            case 1:
                self.foundGalleries = '' + self.filteredGalleries.length + ' галерея';
                break;
            case 2:
            case 3:
            case 4:
                self.foundGalleries = '' + self.filteredGalleries.length + ' галереи';
                break;
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 0:
                self.foundGalleries = '' + self.filteredGalleries.length + ' галерей';
                break;
        }
        switch (self.filteredGalleries.length % 100){
            case 11:
            case 12:
            case 13:
            case 14:
                self.foundGalleries = '' + self.filteredGalleries.length + ' галерей'
                break;

        }
    };
    systemsData
        .success(function(data){
            self.systems = data;
            if ($location.search().systems===undefined) {
                for (i in self.systems) {
                    $scope.selectSystems[self.systems[i].name] = true;
                }
            } else {
                params = $location.search().systems.split(',');
                for (i in self.systems){
                    temp = self.systems[i].name
                    if (params.indexOf(temp)!==-1) {
                        $scope.selectSystems[temp] = true;
                    } else {
                        $scope.selectSystems[temp] = false;;
                    }

                }
            }
        })
        .error(function(e){
            console.log(e);
        });
    genresData
        .success(function(data){
            self.genres = data;
            if ($location.search().genres===undefined) {
                for (i in self.genres) {
                    $scope.selectGenres[self.genres[i].name] = true;
                }
            } else {
                params = $location.search().genres.split(',');
                for (i in self.genres){
                    temp = self.genres[i].name
                    if (params.indexOf(temp)!==-1) {
                        $scope.selectGenres[temp] = true;
                    } else {
                        $scope.selectGenres[temp] = false;;
                    }

                }
            }
        })
        .error(function(e){
            console.log(e);
        });

    galleryData
        .success(function(data){
            self.galleries = data;
            self.filterGalleries = function(){
                //console.log('filtering galleries');
                self.filteredGalleries = [];
                self.showedGalleries = [];
                var galleries = filterFilter(self.galleries,$scope.textFilter);
                var i;
                for (i = 0; i<galleries.length; i++){
                    if (self.systemsFilter(galleries[i])
                        && self.genresFilter(galleries[i])
                        && self.levelsFilter(galleries[i])){
                        self.filteredGalleries.push(galleries[i]);
                    }
                }

                $scope.lastLoadedGallery = -1;
                self.loadGalleries();
                self.parseFound();

            };
            self.loadGalleries = function(){
                self.scrollBusy=true;
                var i,y;
                //console.log('loading  galleries');
                for (i=$scope.lastLoadedGallery+1, y=0;i<self.filteredGalleries.length && y<16;i++,y++){
                    self.showedGalleries.push(self.filteredGalleries[i])
                    //console.log('loaded 1 more gallery');
                    $scope.lastLoadedGallery = i;
                    //console.log ('filtered galleries legth: '+self.filteredGalleries.length);
                }
                //console.log ('last loaded gallery: '+i);
            };

            $scope.$watch('selectGenres',self.filterGalleries,true);
            $scope.$watch('selectSystems',self.filterGalleries,true);
            $scope.$watch('selectLevels',self.filterGalleries,true);
            $scope.$watch('textFilter',self.filterGalleries,true);

        })
        .error(function(e){
            console.log(e);
        });


    //$scope.searchbarClass = 'hidden-xs';

    this.searchbarToggle = function(){
        if ($scope.searchbarClass == 'hidden-xs'){
            $scope.searchbarClass = 'active'
        } else {
            $scope.searchbarClass = 'hidden-xs'
        }
    };

}