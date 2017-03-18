app.controller("orderCtrl",['orderData','$scope', orderCtrl]);
app.service('orderData',['$http', orderData]);

function orderData($http){
    this.post = function(orderData) {
        return $http.post('/api/order', orderData);
    }
}


function orderCtrl(orderData, $scope){
    //this.test = "TEST";
    var self = this;
    self.showSpinner = false;
    this.message = '';
    this.initOrderData = function() {
        self.orderData = {
            name: '',
            phone: '',
            email: '',
            minis: '',
            assembly: '',
            level: "2",
            comments: ''
        };
    };
    this.initOrderData();

    this.submitOrder = function(){
        self.showSpinner = true;
        orderData.post(self.orderData)
            .success(
                function(res) {
                    self.message = 'success';
                    self.showSpinner = false;
                    $scope.orderForm.$setPristine();
                    self.initOrderData();
                })
            .error(
                function(res){
                    self.message = 'error';
                });
    }
    
}



