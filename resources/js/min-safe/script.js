var app = angular.module('myApp',['ui.bootstrap','ngAnimate','ngCookies','ngResource','ui.router','angular-loading-bar']);

app.factory('Article', ['$resource', function ($resource) {

  return $resource("/articles/:article_id", null,
  {
    'update': { method:'PUT' }
  });

}]);

app.factory('UserService', ['$resource', function ($resource) {

  return $resource("/getuserdata");

}]);

app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
   // cfpLoadingBarProvider.includeSpinner = false;
   cfpLoadingBarProvider.latencyThreshold = 10;
 }]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider,$urlRouterProvider){
  $urlRouterProvider.otherwise('/home');
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: 'pages/home.ejs',
    controller:'homeController'
  })
  .state('products',{
    url: '/products',
    templateUrl:'pages/products.ejs',
    controller:'productsController',
    params : {category: 'deco'}
  })
  .state('login',{
    url: '/login',
    templateUrl:'pages/login.ejs'
  })
  .state('profile',{
    url: '/profile',
    templateUrl:'pages/profile.ejs',
    controller:'profileController'
  })
  .state('signup',{
    url: '/signup',
    templateUrl:'pages/signup.ejs',
    controller:'registerController'
  })
  .state('article_details',{
    url: '/article_details',
    templateUrl:'pages/article_details.ejs'
  })
  .state('checkout',{
    url: '/checkout',
    templateUrl:'pages/checkout.ejs',
    controller:'checkoutController'
  });
}]);

app.directive('imageonload', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('load', function() {
        scope.$apply(attrs.imageonload);
      });
    }
  };
});


app.controller('homeController',['$scope', function($scope){

  $scope.thumbs=[
  {src: 'resources/img/no-thumbnail1.png',
  description: '11111'},
  {src: 'resources/img/no-thumbnail2.png',
  description: '22222'},
  {src: 'resources/img/no-thumbnail3.png',
  description: '33333'},
  {src: 'resources/img/no-thumbnail4.png',
  description: '44444'},
  {src: 'resources/img/no-thumbnail5.png',
  description: '55555'}
  ];

  $scope.myInterval = 3000;
  $scope.slides = $scope.thumbs;


}]);

app.controller('loginController',['$scope', '$http', '$state', '$timeout', '$rootScope', function($scope,$http,$state,$timeout,$rootScope){
  $scope.message="";
  $scope.data={
    email:'',
    password:''
  };
  $scope.send=function(){
    console.log($scope.data);
    $scope.spinnerClass='fa fa-spinner fa-pulse';
    $http({method:'POST',url:'/login',data:$scope.data})
    .then(function(response) {
      $scope.message=response.data;
      if(response.data === 'success !!!'){
        $timeout(function(){
          window.location.replace('/#/profile');
          
        }, 1000);
        $scope.spinnerClass='fa fa-check';
        $rootScope.getUserData();
      }else{
        $scope.spinnerClass='';
      }
    });
  };

}]);

app.controller('productsController',['$scope', '$uibModal', '$animate', '$cookies', '$http', '$state', function($scope,$uibModal,$animate,$cookies,$http,$state){
  var sousCategorie=[];
  $scope.sousCategorieModel={
    nappe : false,
    napperon : false,
    sousplat : false,
    soustasse : false,
    mugcover : false,
    serviettes : false,
    unePlace : false,
    deuxPlaces : false,
    thrown : false,
    chausson : false,
    gant : false,
    bonnet : false,
    couverture : false,
    boucles : false,
    colier : false,
    bracelets : false,
    chauffe : false,
    jambieres : false
  };
  $scope.$watchCollection('sousCategorieModel', function () {
    sousCategorie=[];
    sousCategorie.push($state.params.category);
    angular.forEach($scope.sousCategorieModel, function (value, key) {
      if (value) {
        sousCategorie.push(key);
        console.log(sousCategorie);
      }
    });
  });
  sousCategorie.push($state.params.category);
  $scope.productsCategory=$state.params.category;
  console.log(sousCategorie);
  $scope.filterFn=function(thumb){
    var i=0,flag=true;
    while(i<sousCategorie.length && flag){
      if (thumb.categorie.indexOf(sousCategorie[i])<0) {
        flag=false;
      }else{
        i++;
      }
    }
    return flag;
  };

}]);

app.controller('mainController',['$scope', '$uibModal', '$animate', '$cookies', '$http', '$rootScope', 'Article', function($scope,$uibModal,$animate,$cookies,$http,$rootScope,Article){

  Article.query(function(data){
    $scope.db=data;
    console.log($scope.db);
  });
  $scope.productCategory=function(x){
    $scope.productCategoryNumber=x;
    console.log($scope.productCategoryNumber);
  };

  $scope.testEmail={to : ''};
  $scope.cartObj={}
$scope.cartObj.yourCart= [];

  $scope.imgLoading="imgLoading";
  $scope.doThis=function(){
    $scope.imgLoading="imgloaded";
  };
  
  $rootScope.isLoggedIn=false;
  $rootScope.isAdmin=false;

  $scope.name="";
  $scope.items = [
  'Item 1',
  'Item 2',
  'Item 3'
  ];


  $rootScope.getUserData=function(){
    $http({method: 'GET',url: '/getuserdata'}).then(function(response) {
      $rootScope.isLoggedIn=true;
      if(response.data.nom ==='admin'
          && response.data.prenom ==='admin'
          && response.data.email ==='admin@admin.com'){
      $rootScope.isAdmin=true;
  }

      if(response.data.nom){
        $scope.username=response.data.nom+' '+response.data.prenom;
      }else{
        if (response.data.email){
          $scope.username=response.data.email;
        }else{
          $rootScope.isLoggedIn=false;
        }
      }
      return (response.data);
    });
  };

  $rootScope.updateDB=function(){
    Article.query(function(data){
      $scope.db=data;
      console.log($scope.db);
    });
  };
  $rootScope.getUserData();
  $scope.index = 0;
  $scope.cartObj.yourCart=$cookies.getObject('yourCart');
  if(typeof $scope.cartObj.yourCart === 'undefined' ||  $scope.cartObj.yourCart.length<=0 ){
    $scope.cartObj.yourCart= [];
  }

  $scope.addToCart=function(id){
    var pos= -1;
    for(var i=0;i< $scope.cartObj.yourCart.length;i++){
      if($scope.cartObj.yourCart[i].itemId === id){
        pos=i;break;
      }
    }
    if(pos< 0)
      {$scope.cartObj.yourCart.push({
        itemId : id,
        itemQty : 1
      });}else{
        $scope.cartObj.yourCart[pos].itemQty+=1; 
      }
      var d=new Date();
      d.setDate(d.getDate()+10);
      $cookies.putObject("yourCart",$scope.cartObj.yourCart,{expires:d});
      console.log($scope.cartObj.yourCart);
//    $scope.cartObj.yourCart=JSON.parse($cookies.yourCart);
//    console.log($scope.cartObj.yourCart);
};

$scope.articleModal=function(id){
  var pos=0;$scope.imgArray=[];
  for (var i = 0; i < $scope.db.length; i++) {
    if($scope.db[i]._id==id){
      pos=i;
      $scope.imgArray=$scope.db[i].src;
      break;

    }
  }
  $scope.index = pos;
  var modalInstance = $uibModal.open({
   animation: true,
   templateUrl: 'modals/articleDetails.html',
   controller: 'articleModalInstanceCtrl',
   scope:$scope,
   windowClass: 'article-modal-window'
 });
};

$scope.loginModal=function(){
  var modalInstance = $uibModal.open({
   animation: true,
   templateUrl: 'modals/login.html',
   controller: 'loginModalInstanceCtrl',
   scope:$scope,
   windowClass: 'login-modal-window'
 });
};
}]);

app.controller('articleModalInstanceCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  $scope.Arrayindex=0;
  $scope.thumbArray=function(i){
    $scope.Arrayindex=i;
  };

  $scope.cancel=function(){
    $modalInstance.dismiss('cancel');
  };
}]);

app.controller('loginModalInstanceCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
 $scope.cancel=function(){
  $modalInstance.dismiss('cancel');
};
}]);


app.controller('registerController',['$scope', '$state', '$http', '$rootScope', '$timeout', function($scope,$state,$http,$rootScope,$timeout){

  $scope.registerInfo={
    news:true
  };


  $scope.test=function(form){
    console.log(form);
    $scope.message=[];
    if(form.$error.email){$scope.message.push('email invalid');}

    if(typeof form.$error.pattern !='undefined'){

      for(var i=0;i<form.$error.pattern.length;i++){
        if(form.$error.pattern[i].$name==='password'){
          $scope.message.push('password invalid 6 to 20 aplhanumeric characters and !@#$% can not start with a digit or special character');
        }
        if(form.$error.pattern[i].$name==='nom'){
          $scope.message.push('nom invalid ');
        }
        if(form.$error.pattern[i].$name==='prenom'){
          $scope.message.push('prenom invalid ');
        }
        if(form.$error.pattern[i].$name==='CIN'){
          $scope.message.push('CIN invalid ');
        }
        if(form.$error.pattern[i].$name==='Zip'){
          $scope.message.push('Zip invalid ');
        }
        if(form.$error.pattern[i].$name==='telephone'){
          $scope.message.push('telephone invalid ');
        }
      }}

      if(typeof form.$error.required !='undefined'){
        for(var i=0;i<form.$error.required.length;i++){
          $scope.message.push(form.$error.required[i].$name+' required');

        }}

        if (form.$valid) {send();}
      };

      var send=function(){
        console.log($scope.registerInfo);
        $scope.spinnerClass='fa fa-spinner fa-pulse';
        $http({method:'POST',url:'/signup',data:$scope.registerInfo})
        .then(function(response) {
          $scope.message=response.data;
          if(response.data === 'success !!!'){
            $timeout(function(){window.location.replace('/#/profile');}, 1000);
            $scope.spinnerClass='fa fa-check';
            $rootScope.getUserData();
          }else{
            $scope.spinnerClass='';
          }
        });
      };
    }]);

app.controller('checkoutController',['$scope', '$cookies', '$rootScope', '$http', function($scope,$cookies,$rootScope,$http){

  $scope.cartObj.yourCart=$cookies.getObject('yourCart');
  console.log($scope.cartObj.yourCart);
  $scope.cartEmpty=(typeof $scope.cartObj.yourCart === 'undefined' ||  $scope.cartObj.yourCart.length<=0 );
  console.log("cart empty " + $scope.cartEmpty);
  $scope.subTotal= 0;
  $scope.total =0;
  $scope.subTotal=0;
  $scope.checkoutArticles=[];
  $scope.message='';

  updateTotal=function(){
   $scope.cartEmpty=(typeof $scope.cartObj.yourCart === 'undefined' ||  $scope.cartObj.yourCart.length<=0 );
   if ($scope.cartEmpty) {return;}
   console.log("update");
   $scope.checkoutArticles=[];
   for(var i=0;i< $scope.cartObj.yourCart.length;i++){
    for(var j=0;j< $scope.db.length;j++){
      if($scope.cartObj.yourCart[i].itemId === $scope.db[j]._id){
        $scope.checkoutArticles.push({
          item: $scope.db[j],itemQty:$scope.cartObj.yourCart[i].itemQty});
      }}}
      $scope.subTotal= 0;
      $scope.shipping = 7;
      for (var i = 0; i < $scope.checkoutArticles.length; i++) {
        $scope.subTotal += $scope.checkoutArticles[i].item.prix *
        $scope.checkoutArticles[i].itemQty;
      }
      $scope.total = $scope.shipping + $scope.subTotal;
    };
     updateTotal();
    $scope.itemIncrease=function(id){
      var pos= -1;
      for(var i=0;i< $scope.cartObj.yourCart.length;i++){
        if($scope.cartObj.yourCart[i].itemId === id){
          pos=i;break;
        }
      }
      if(pos>= 0){
        $scope.cartObj.yourCart[pos].itemQty+= 1;
        var d=new Date();
        d.setDate(d.getDate()+10);
        $cookies.putObject("yourCart",$scope.cartObj.yourCart,{expires:d});
        console.log($scope.cartObj.yourCart);
    //
    updateTotal();
  }
};

$scope.itemDecrease=function(id){
  var pos= -1;
  for(var i=0;i< $scope.cartObj.yourCart.length;i++){
    if($scope.cartObj.yourCart[i].itemId === id){
      pos=i;break;
    }
  }
  if(pos>= 0 && $scope.cartObj.yourCart[pos].itemQty>1)
   { $scope.cartObj.yourCart[pos].itemQty-= 1;
    var d=new Date();
    d.setDate(d.getDate()+10);
    $cookies.putObject("yourCart",$scope.cartObj.yourCart,{expires:d});
    console.log($scope.cartObj.yourCart);
    updateTotal();
  }
};

$scope.itemRemove=function(id){
  $scope.cartObj.yourCart= $scope.cartObj.yourCart.filter(function(a){
    return a.itemId !== id;
  });

  var d=new Date();
  d.setDate(d.getDate()+10);
  $cookies.putObject("yourCart",$scope.cartObj.yourCart,{expires:d});
  console.log($scope.cartObj.yourCart);
  updateTotal();
  console.log($scope.cartObj.yourCart);
};



$scope.checkoutMail=function(){
  var user={};
  console.log("xxx");
  $http({method: 'GET',url: '/getuserdata'})
  .then(function(response) {
    user =response.data;
    console.log(user);
    if (!user) {
      $scope.message="login";
      return;
    }
    if (user.pending) {
      $scope.message="account still pending go to profile";
      return;
    }
    if (!(user.verified)) {
      $scope.message="not verified go to profile";
      return;
    }
 })
  .then(function() {
    if($scope.message.length===0){
    $http({
      method: 'GET',
      url: '/sendCheckout',
      params:{
        to: user.email,
        articles : $scope.cartObj.yourCart 
      }
    })
    .then(function(response) {
     console.log(response);
   });
  }}) ;
};

}]);


app.controller('profileController',['$scope', '$http', '$timeout', function($scope,$http,$timeout){
  $scope.isCollapsed=[];
  for (var i = 0; i < 10; i++) {
    $scope.isCollapsed[i]=true;
  }
  $http({method: 'GET',url: '/getuserdata'})
  .then(function(response) {
    $scope.registerInfo=response.data;
    $scope.userNotVerified=response.data.verified;
    $scope.userNotVerified=!($scope.userNotVerified);
    console.log($scope.registerInfo);
  });
  
  $scope.testSendEmail=function(){
    var xx = $scope.testEmail;
    $http({
      method: 'GET',
      url: '/sendVerification',
      params:{to:$scope.registerInfo.email}
    })
    .then(function(response) {
    /*if(response.data.nom){
      $scope.username=response.data.nom+' '+response.data.prenom;
    }else{
      if (response.data.email){
        $scope.username=response.data.email;
      }else{
        $rootScope.isLoggedIn=false;
      }*/
      console.log(response);
    });
  };

  $scope.test=function(form){
    console.log(form);
    $scope.message=[];
    if(form.$error.email){$scope.message.push('email invalid');}

    if(typeof form.$error.pattern !='undefined'){

      for(var i=0;i<form.$error.pattern.length;i++){
        if(form.$error.pattern[i].$name==='password'){
          $scope.message.push('password invalid');
        }
        if(form.$error.pattern[i].$name==='nom'){
          $scope.message.push('nom invalid ');
        }
        if(form.$error.pattern[i].$name==='prenom'){
          $scope.message.push('prenom invalid ');
        }
        if(form.$error.pattern[i].$name==='CIN'){
          $scope.message.push('CIN invalid ');
        }
        if(form.$error.pattern[i].$name==='Zip'){
          $scope.message.push('Zip invalid ');
        }
        if(form.$error.pattern[i].$name==='telephone'){
          $scope.message.push('telephone invalid ');
        }
      }}

      if (form.$valid) {send();}
    };

    var send=function(){
      console.log($scope.registerInfo);
      $scope.spinnerClass='fa fa-spinner fa-pulse';
      $http({method:'POST',url:'/profileupdate',data:$scope.registerInfo})
      .then(function(response) {
        $scope.message=response.data;
        if(response.data === 'success !!!'){
          $timeout(function(){window.location.replace('/#/profile');}, 1000);
          $scope.spinnerClass='fa fa-check';
          $rootScope.getUserData();
        }else{
          $scope.spinnerClass='';
        }
      });
    };
}]);

app.controller('articlesController',['$scope', 'Article', '$uibModal', '$animate', '$rootScope', function($scope,Article,$uibModal,$animate,$rootScope){

  $scope.edit=false;

$scope.deleteArticle=function(xx){
  console.log(xx);
  Article.delete({article_id : xx});
  $rootScope.updateDB();
};

$scope.editModal=function(id){
  $scope.edit=true;
  $scope.editId=id;
  var modalInstance = $uibModal.open({
   animation: true,
   templateUrl: 'modals/articleForm.html',
   controller: 'articleFormInstanceCtrl',
   scope:$scope,
   windowClass: 'article-form-modal-window'
 });
};

$scope.addModal=function(){
  $scope.edit=false;
  var modalInstance = $uibModal.open({
   animation: true,
   templateUrl: 'modals/articleForm.html',
   controller: 'articleFormInstanceCtrl',
   scope:$scope,
   windowClass: 'article-form-modal-window'
 });
};

}]);

app.controller('articleFormInstanceCtrl', ['$scope', '$modalInstance', 'Article', '$rootScope', function ($scope, $modalInstance,Article,$rootScope) {

  $scope.addArticleSrc='';
  $scope.addArticleCat='';
  $scope.addArticleForm={};
  $scope.addArticleSrcTab=[];
  $scope.addArticleCatTab=[];
  console.log($scope.editId);
  for (var i = 0 ;i<$scope.db.length; i++) {
    if($scope.db._id===$scope.editId){
      $scope.index=i;
      console.log(i);
      $scope.addArticleForm=$scope.db[i];
      break;
      
    }}
    $scope.cancel=function(){
      $modalInstance.dismiss('cancel');
    };

    $scope.addSrc=function(){
      if($scope.addArticleSrc==='')return;
      $scope.addArticleSrcTab.push($scope.addArticleSrc);
      $scope.addArticleSrc='';
    };
    $scope.addCat=function(){
      if($scope.addArticleCat==='')return;
      $scope.addArticleCatTab.push($scope.addArticleCat);
      $scope.addArticleCat='';
    };
    $scope.addArticle=function(){
      $scope.addArticleForm.src=$scope.addArticleSrcTab;
      $scope.addArticleForm.categorie=$scope.addArticleCatTab;
      var article= new Article($scope.addArticleForm);
      article.$save().then(function(){
        $rootScope.updateDB();
        $scope.addArticleSrcTab=[];
        $scope.addArticleCatTab=[];
        $modalInstance.dismiss('cancel');
      });
    };

    $scope.editArticle=function(xx){
      console.log(xx);
      $scope.addArticleForm.src=$scope.addArticleSrcTab;
      $scope.addArticleForm.categorie=$scope.addArticleCatTab;
      Article.update({article_id : xx},$scope.addArticleForm).$promise.then(function(){
        $rootScope.updateDB();
        $modalInstance.dismiss('cancel');
      });
    };
  }]);