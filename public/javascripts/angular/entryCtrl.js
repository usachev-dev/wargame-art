app.controller("entryCtrl",['entryData','$scope','$location',entryCtrl]);
app.service('entryData',['$http', entryData]);

function entryData($http){
    this.get = function(gallerySlug) {
        return $http.get('/api/gallery/'+gallerySlug);
    }
}

function entryCtrl(entryData,$scope,$location){
    var absUrl, gallerySlug, i;
    var self = this;
    this.entry = {};
    var imageStoragePath = 'https://s3.amazonaws.com/wargame-art/gallery/'
    this.modal = {
        state:'open',
        image:''
    };
    absUrl = $location.absUrl();
    absUrl = absUrl.split('/');
    gallerySlug = absUrl[absUrl.length-1];
    entryData.get(gallerySlug)
        .success(
            function(data){
                self.entry = data;
                self.modal.image = imageStoragePath+data.slug+'/'+data.mainImage.filename;
                $scope.$on('$viewContentLoaded', function(event) {
                    console.log("onload launched");
                });
                angular.element(function () {
                    console.log('page loading completed');
                });

                window.onload = function() {
                    console.log("onload launched");
                    var images = [];
                    for (i in self.entry.images) {
                        images[i] = new Image();
                        images[i].src = imageStoragePath + gallerySlug + '/' + self.entry.images[i].filename;
                    }
                };
                //console.log(data);
            }
        )
        .error(
            function(e){
                console.log(e);
            }
        );

    this.openImageModal = function(item){
        //self.modal.state = "open";
        $('body').addClass("no-overflow");
        self.modal.image = item.currentTarget.getAttribute("data-image-path");
        $('#image-modal').removeClass("closed");
        //console.log(item.currentTarget.getAttribute("data-image-path"));
    };
    
    this.closeImageModal = function(){
        $('body').removeClass("no-overflow");
        //console.log("clicked cross");
        $('#image-modal').addClass("closed");
    }

};