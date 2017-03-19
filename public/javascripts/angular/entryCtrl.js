app.controller("entryCtrl",['entryData','$scope','$location',entryCtrl]);
app.service('entryData',['$http', entryData]);
app.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                imageLoaded();
            });
            element.bind('error', function(){
                console.log('image could not be loaded');
            });
        }
    };
});



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
        //state:'open',
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
                self.fullImages = [];
                self.fullImages.push(imageStoragePath+data.slug+'/'+data.mainImage.filename);
                for(i in self.entry.images){
                    self.fullImages.push(imageStoragePath+data.slug+'/'+self.entry.images[i].filename);
                }
                //console.log(self.fullImages);
            }
        )
        .error(
            function(e){
                console.log(e);
            }
        );
    this.loadedThumbs = 0;
    this.imageLoaded = function(){
        self.loadedThumbs++;
        if (self.loadedThumbs == self.entry.images.length+1){
            //console.log('all images loaded');
            var images = [];
            for (i in self.entry.images) {
                images[i] = new Image();
                images[i].src = imageStoragePath + gallerySlug + '/' + self.entry.images[i].filename;
                //console.log('image preloaded');
            }
        }
    };

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
    };

    this.nextImageInModal = function(){
        var n = self.fullImages.indexOf(self.modal.image);
        if (self.fullImages.length<=n+1){
            n=0;
        } else {
            n++
        }
        self.modal.image = self.fullImages[n];
    };
    this.prevImageInModal = function(){
        var n = self.fullImages.indexOf(self.modal.image);
        if (n<=0){
            n=self.fullImages.length-1;
        } else {
            n--
        }
        self.modal.image = self.fullImages[n];
    };
};