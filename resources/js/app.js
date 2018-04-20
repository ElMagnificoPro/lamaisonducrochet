var app = angular.module('myApp', ['ui.bootstrap', 'ngAnimate', 'ngCookies', 'ngResource', 'ui.router', 'angular-loading-bar']);

app.factory('Article', function ($resource) {

  return $resource("/articles/:article_id", null, {
    'update': {
      method: 'PUT'
    }
  });

});

app.factory('UserService', function ($resource) {

  return $resource("/getuserdata");

});

app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
  // cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.latencyThreshold = 10;
}]);

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'pages/home.ejs',
      controller: 'homeController'
    })
    .state('products', {
      url: '/products',
      templateUrl: 'pages/products.ejs',
      controller: 'productsController',
      params: {
        category: 'deco'
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'pages/login.ejs'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'pages/profile.ejs',
      controller: 'profileController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'pages/signup.ejs',
      controller: 'registerController'
    })
    .state('article_details', {
      url: '/article_details',
      templateUrl: 'pages/article_details.ejs'
    })
    .state('checkout', {
      url: '/checkout',
      templateUrl: 'pages/checkout.ejs',
      controller: 'checkoutController'
    })
    .state('confirmCheckout', {
      url: '/confirm',
      templateUrl: 'pages/confirm_checkout.ejs',
      controller: 'confirmCheckoutController'
    })
    .state('conditions', {
      url: '/conditions',
      templateUrl: 'pages/conditions.ejs'
    });
});

app.directive('imageonload', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('load', function () {
        scope.$apply(attrs.imageonload);
      });
    }
  };
});


app.controller('homeController', function ($scope) {

  $scope.myInterval = 3000;
  $scope.slides = slides;
  /*
    slides=[
    {"src": "/resources/img/no-thumbnail1.png"},
    {"src": "/resources/img/no-thumbnail2.png"},
    {"src": "/resources/img/no-thumbnail3.png"},
    {"src": "/resources/img/no-thumbnail4.png"},
    {"src": "/resources/img/no-thumbnail5.png"}
    ]*/
});

app.controller('loginController', function ($scope, $http, $state, $timeout, $rootScope) {
  $scope.message = "";
  $scope.data = {
    email: '',
    password: ''
  };
  $scope.send = function () {
    //console.log($scope.data);
    $scope.spinnerClass = 'fa fa-spinner fa-pulse';
    $http({
        method: 'POST',
        url: '/login',
        data: $scope.data
      })
      .then(function (response) {
        $scope.message = response.data;
        if (response.data === 'success !!!') {
          $scope.message = '';
          $timeout(function () {
            window.location.replace('/#/profile');

          }, 1000);
          $scope.spinnerClass = 'fa fa-check';
          $rootScope.getUserData();
        } else {
          $scope.spinnerClass = '';
        }
      });
  };

});

app.controller('productsController', function ($scope, $uibModal, $animate, $cookies, $http, $state) {
  var sousCategorie = [];
  $scope.currentPage = 1;
  $scope.pageLimit = 6;
  $scope.sousCategorieModel = {
    nappe: false,
    napperon: false,
    sousplat: false,
    soustasse: false,
    mugcover: false,
    serviettes: false,
    unePlace: false,
    deuxPlaces: false,
    thrown: false,
    chausson: false,
    gant: false,
    bonnet: false,
    couverture: false,
    boucles: false,
    colier: false,
    bracelets: false,
    chauffe: false,
    jambieres: false
  };
  $scope.$watchCollection('sousCategorieModel', function () {
    sousCategorie = [];
    sousCategorie.push($state.params.category);
    angular.forEach($scope.sousCategorieModel, function (value, key) {
      if (value) {
        sousCategorie.push(key);
        console.log(sousCategorie);
      }
    });
  });
  sousCategorie.push($state.params.category);
  $scope.productsCategory = $state.params.category;
  console.log(sousCategorie);
  $scope.filterFn = function (thumb) {
    var i = 0,
      flag = true;
    while (i < sousCategorie.length && flag) {
      if (thumb.categorie.indexOf(sousCategorie[i]) < 0) {
        flag = false;
      } else {
        i++;
      }
    }
    return flag;
  };
});

app.controller('mainController', function ($scope, $uibModal, $animate, $cookies, $http, $rootScope,$document, Article) {

  $rootScope.$on('$stateChangeSuccess', function() {
    $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
 });

  Article.query(function (data) {
    $scope.db = data;
    console.log($scope.db);
  });

  $scope.newsletterMail = '';

  $scope.addNewsletter = function () {

    $http({
        method: 'POST',
        url: '/add_newsletter',
        data: {
          email: $scope.newsletterMail
        }
      })
      .then(function (response) {
        if (response.status === 200) {
          alert("SUCCESS");
        }
      });
  };


  $scope.productCategory = function (x) {
    $scope.productCategoryNumber = x;
    console.log($scope.productCategoryNumber);
  };

  $scope.testEmail = {
    to: ''
  };
  $scope.cartObj = {};
  $scope.cartObj.yourCart = [];

  $scope.imgLoading = "imgLoading";
  $scope.doThis = function () {
    $scope.imgLoading = "imgloaded";
  };

  $rootScope.isLoggedIn = false;
  $rootScope.isAdmin = false;

  $scope.name = "";
  $scope.items = [
    'Item 1',
    'Item 2',
    'Item 3'
  ];


  $rootScope.getUserData = function () {
    $http({
      method: 'GET',
      url: '/getuserdata'
    }).then(function (response) {
      $rootScope.isLoggedIn = true;
      if (response.data.nom === 'admin' &&
        response.data.prenom === 'admin' &&
        response.data.email === 'admin@admin.com') {
        $rootScope.isAdmin = true;
      }

      if (response.data.nom) {
        $scope.username = response.data.nom + ' ' + response.data.prenom;
      } else {
        if (response.data.email) {
          $scope.username = response.data.email;
        } else {
          $rootScope.isLoggedIn = false;
        }
      }
      return (response.data);
    });
  };

  $rootScope.updateDB = function () {
    Article.query(function (data) {
      $scope.db = data;
      console.log($scope.db);
    });
  };
  $rootScope.getUserData();
  $scope.index = 0;
  $scope.cartObj.yourCart = $cookies.getObject('yourCart');
  if (typeof $scope.cartObj.yourCart === 'undefined' || $scope.cartObj.yourCart.length <= 0) {
    $scope.cartObj.yourCart = [];
  }

  $scope.addToCart = function (id) {
    $scope.cartObj.yourCart = $cookies.getObject('yourCart');
    if (typeof $scope.cartObj.yourCart === 'undefined' || $scope.cartObj.yourCart.length <= 0) {
      $scope.cartObj.yourCart = [];
    }
    var pos = -1;
    for (var i = 0; i < $scope.cartObj.yourCart.length; i++) {
      if ($scope.cartObj.yourCart[i].itemId === id) {
        pos = i;
        break;
      }
    }
    if (pos < 0) {
      $scope.cartObj.yourCart.push({
        itemId: id,
        itemQty: 1
      });
    } else {
      $scope.cartObj.yourCart[pos].itemQty += 1;
    }
    var d = new Date();
    d.setDate(d.getDate() + 10);
    $cookies.putObject("yourCart", $scope.cartObj.yourCart, {
      expires: d
    });
    console.log($scope.cartObj.yourCart);
    //    $scope.cartObj.yourCart=JSON.parse($cookies.yourCart);
    //    console.log($scope.cartObj.yourCart);
  };

  $scope.articleModal = function (id) {
    var pos = 0;
    $scope.imgArray = [];
    for (var i = 0; i < $scope.db.length; i++) {
      if ($scope.db[i]._id == id) {
        pos = i;
        $scope.imgArray = $scope.db[i].src;
        break;

      }
    }
    $scope.index = pos;
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'modals/articleDetails.html',
      controller: 'articleModalInstanceCtrl',
      scope: $scope,
      windowClass: 'article-modal-window'
    });
  };

  $scope.loginModal = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'modals/login.html',
      controller: 'loginModalInstanceCtrl',
      scope: $scope,
      windowClass: 'login-modal-window'
    });
  };

  $scope.confirmModal = function (link) {
    $scope.confirmModalLink = link;
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'modals/confirm.html',
      controller: 'confirmModalInstanceCtrl',
      scope: $scope,
      windowClass: 'confirm-modal-window'
    });
  };

  $scope.contactModal = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'modals/contact.html',
      controller: 'ContactModalInstanceCtrl',
      scope: $scope,
      windowClass: 'contact-modal-window'
    });
  };

  $scope.partenaireModal = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'modals/partenaire_modal.html',
      controller: 'PartenaireModalInstanceCtrl',
      scope: $scope,
      windowClass: 'partenaire-modal-window'
    });
  };

  $scope.partenaire2Modal = function () {
    alert("coming Soon");
  };

});

app.controller('ContactModalInstanceCtrl', function ($scope, $modalInstance, $http, $timeout) {
  // recaptcha
  var script = document.createElement('script');
  script.src = "https://www.google.com/recaptcha/api.js";
  script.onload = function () {
    //alert("script loaded")
  };

  document.head.appendChild(script);

  $scope.message = "";
  $scope.data = {
    email: '',
    name: '',
    message: '',
    response: ''
  };
  $scope.send = function () {
    if ($scope.message) $scope.message = '';
    var response = grecaptcha.getResponse();
    console.log('g-recaptcha-response: ' + response);
    $scope.data.response = response;
    if (response.length === 0) {
      $scope.message = 'complete captcha';
    } else {
      console.log($scope.data);
      $scope.spinnerClass = 'fa fa-spinner fa-pulse';
      $http({
          method: 'POST',
          url: '/contactUs',
          data: $scope.data
        })
        .then(function (response) {
          $scope.message = response.data.message;
          $scope.spinnerClass = 'fa fa-check';
          $timeout(function () {
            $scope.cancel();
          }, 3000);
        });

    }

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.controller('confirmModalInstanceCtrl', function ($scope, $modalInstance, $http, $window) {
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  $scope.confirm = function () {
    $http({
        method: 'GET',
        url: '/logout'
      })
      .then(function () {
        $window.location.reload();
      });

  };

});

app.controller('PartenaireModalInstanceCtrl', function ($scope, $modalInstance) {
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});



app.controller('articleModalInstanceCtrl', function ($scope, $modalInstance) {
  $scope.Arrayindex = 0;
  $scope.thumbArray = function (i) {
    $scope.Arrayindex = i;
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.controller('loginModalInstanceCtrl', function ($scope, $modalInstance) {
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


app.controller('registerController', function ($scope, $state, $http, $rootScope, $timeout) {

  $scope.registerInfo = {
    news: true
  };


  $scope.test = function (form) {
    console.log(form);
    $scope.message = [];
    var i = 0;
    if (form.$error.email) {
      $scope.message.push('email invalid');
    }

    if (typeof form.$error.pattern != 'undefined') {

      for (i = 0; i < form.$error.pattern.length; i++) {
        if (form.$error.pattern[i].$name === 'password') {
          $scope.message.push('password invalid 6 to 20 alphanumeric characters and !@#$% can not start with a digit or special character');
        }
        if (form.$error.pattern[i].$name === 'nom') {
          $scope.message.push('nom invalid ');
        }
        if (form.$error.pattern[i].$name === 'prenom') {
          $scope.message.push('prenom invalid ');
        }
        if (form.$error.pattern[i].$name === 'CIN') {
          $scope.message.push('CIN invalid ');
        }
        if (form.$error.pattern[i].$name === 'Zip') {
          $scope.message.push('Zip invalid ');
        }
        if (form.$error.pattern[i].$name === 'telephone') {
          $scope.message.push('telephone invalid ');
        }
      }
    }

    if (typeof form.$error.required != 'undefined') {
      for (i = 0; i < form.$error.required.length; i++) {
        $scope.message.push(form.$error.required[i].$name + ' required');

      }
    }

    if (form.$valid) {
      send();
    }
  };

  var send = function () {
    console.log($scope.registerInfo);
    $scope.spinnerClass = 'fa fa-spinner fa-pulse';
    $http({
        method: 'POST',
        url: '/signup',
        data: $scope.registerInfo
      })
      .then(function (response) {
        $scope.message = response.data;
        if (response.data === 'success !!!') {
          $timeout(function () {
            window.location.replace('/#/profile');
          }, 1000);
          $scope.spinnerClass = 'fa fa-check';
          $rootScope.getUserData();
        } else {
          $scope.spinnerClass = '';
        }
      });
  };
});

app.controller('checkoutController', function ($scope, $cookies, $rootScope, $http) {

  $scope.cartObj.yourCart = $cookies.getObject('yourCart');
  console.log($scope.cartObj.yourCart);
  $scope.cartEmpty = (typeof $scope.cartObj.yourCart === 'undefined' || $scope.cartObj.yourCart.length <= 0);
  console.log("cart empty " + $scope.cartEmpty);
  $scope.subTotal = 0;
  $scope.total = 0;
  $scope.subTotal = 0;
  $scope.checkoutArticles = [];
  $scope.message = '';

  updateTotal = function () {
    $scope.cartEmpty = (typeof $scope.cartObj.yourCart === 'undefined' || $scope.cartObj.yourCart.length <= 0);
    if ($scope.cartEmpty) {
      return;
    }
    console.log("update");
    $scope.checkoutArticles = [];
    for (var i = 0; i < $scope.cartObj.yourCart.length; i++) {
      for (var j = 0; j < $scope.db.length; j++) {
        if ($scope.cartObj.yourCart[i].itemId === $scope.db[j]._id) {
          $scope.checkoutArticles.push({
            item: $scope.db[j],
            itemQty: $scope.cartObj.yourCart[i].itemQty
          });
        }
      }
    }
    $scope.subTotal = 0;
    $scope.shipping = 7;
    for (i = 0; i < $scope.checkoutArticles.length; i++) {
      $scope.subTotal += $scope.checkoutArticles[i].item.prix *
        $scope.checkoutArticles[i].itemQty;
    }
    $scope.total = $scope.shipping + $scope.subTotal;
  };

  updateTotal();
  $scope.itemIncrease = function (id) {
    var pos = -1;
    for (var i = 0; i < $scope.cartObj.yourCart.length; i++) {
      if ($scope.cartObj.yourCart[i].itemId === id) {
        pos = i;
        break;
      }
    }
    if (pos >= 0) {
      $scope.cartObj.yourCart[pos].itemQty += 1;
      var d = new Date();
      d.setDate(d.getDate() + 10);
      $cookies.putObject("yourCart", $scope.cartObj.yourCart, {
        expires: d
      });
      console.log($scope.cartObj.yourCart);
      //
      updateTotal();
    }
  };

  $scope.itemDecrease = function (id) {
    var pos = -1;
    for (var i = 0; i < $scope.cartObj.yourCart.length; i++) {
      if ($scope.cartObj.yourCart[i].itemId === id) {
        pos = i;
        break;
      }
    }
    if (pos >= 0 && $scope.cartObj.yourCart[pos].itemQty > 1) {
      $scope.cartObj.yourCart[pos].itemQty -= 1;
      var d = new Date();
      d.setDate(d.getDate() + 10);
      $cookies.putObject("yourCart", $scope.cartObj.yourCart, {
        expires: d
      });
      console.log($scope.cartObj.yourCart);
      updateTotal();
    }
  };

  $scope.itemRemove = function (id) {
    $scope.cartObj.yourCart = $scope.cartObj.yourCart.filter(function (a) {
      return a.itemId !== id;
    });

    var d = new Date();
    d.setDate(d.getDate() + 10);
    $cookies.putObject("yourCart", $scope.cartObj.yourCart, {
      expires: d
    });
    console.log($scope.cartObj.yourCart);
    updateTotal();
    console.log($scope.cartObj.yourCart);
  };



  $scope.checkoutMail = function () {
    var user = {};
    console.log("xxx");
    $http({
        method: 'GET',
        url: '/getuserdata'
      })
      .then(function (response) {
        user = response.data;
        console.log(user);
        if (!user) {
          $scope.message = "login";
          return;
        }
        if (user.pending) {
          $scope.message = "account still pending go to profile";
          return;
        }
        if (!(user.verified)) {
          $scope.message = "not verified go to profile";
          return;
        }
      })
      .then(function () {
        if ($scope.message.length === 0) {
          window.location.replace('/#/confirm');
        }
      });
  };

});


app.controller('confirmCheckoutController', function ($scope, $cookies, $rootScope, $http) {

  $scope.cartObj.yourCart = $cookies.getObject('yourCart');
  console.log($scope.cartObj.yourCart);
  $scope.cartEmpty = (typeof $scope.cartObj.yourCart === 'undefined' || $scope.cartObj.yourCart.length <= 0);
  console.log("cart empty " + $scope.cartEmpty);
  $scope.subTotal = 0;
  $scope.total = 0;
  $scope.subTotal = 0;
  $scope.checkoutArticles = [];
  $scope.message = '';

  for (var i = 0; i < $scope.cartObj.yourCart.length; i++) {
    for (var j = 0; j < $scope.db.length; j++) {
      if ($scope.cartObj.yourCart[i].itemId === $scope.db[j]._id) {
        $scope.checkoutArticles.push({
          item: $scope.db[j],
          itemQty: $scope.cartObj.yourCart[i].itemQty
        });
      }
    }
  }
  $scope.subTotal = 0;
  $scope.shipping = 7;
  for (i = 0; i < $scope.checkoutArticles.length; i++) {
    $scope.subTotal += $scope.checkoutArticles[i].item.prix *
      $scope.checkoutArticles[i].itemQty;
  }
  $scope.total = $scope.shipping + $scope.subTotal;

  $http({
      method: 'GET',
      url: '/getuserdata'
    })
    .then(function (response) {
      user = response.data;
      console.log(user);
      if (!user) {
        $scope.message = "login";
        return;
      }
      if (user.pending) {
        $scope.message = "account still pending go to profile";
        return;
      }
      if (!(user.verified)) {
        $scope.message = "not verified go to profile";
        return;
      }
    })
    .then(function () {
      if ($scope.message.length === 0) {
        $scope.nom = user.nom + ' ' + user.prenom;
        $scope.adresse = user.Zip + " " + user.adresse + " " + user.etat + " " + user.ville;
        $scope.telephone = user.telephone;
      }
    });

  $scope.checkoutMail = function () {
    var user = {};
    console.log("xxx");
    $http({
        method: 'GET',
        url: '/getuserdata'
      })
      .then(function (response) {
        user = response.data;
        console.log(user);
        if (!user) {
          $scope.message = "login";
          return;
        }
        if (user.pending) {
          $scope.message = "account still pending go to profile";
          return;
        }
        if (!(user.verified)) {
          $scope.message = "not verified go to profile";
          return;
        }
      })
      .then(function () {
        if ($scope.message.length === 0) {
          var nom = (user.nom === '') ? user.email : (user.nom + ' ' + user.prenom);
          var adresse = user.Zip + " " + user.adresse + " " + user.etat + " " + user.ville;
          var cart = [];
          var article = {};
          for (var i = 0; i < $scope.cartObj.yourCart.length; i++) {
            for (var j = 0; j < $scope.db.length; j++) {
              if ($scope.db[j]._id === $scope.cartObj.yourCart[i].itemId) {
                article = $scope.db[j];
                article.itemQty = $scope.cartObj.yourCart[i].itemQty;
                cart.push(article);
              }
            }
          }
          console.log(cart);
          $http({
              method: 'POST',
              url: '/sendCheckout',
              data: {
                to: user.email,
                nom: nom,
                shipping: adresse,
                articles: cart
              }
            })
            .then(function (response) {
              console.log(response);
              $cookies.remove('yourCart');
            });
        }
      });
  };

});


app.controller('profileController', function ($scope, $http, $timeout) {
  $scope.isCollapsed = [];
  for (var i = 0; i < 10; i++) {
    $scope.isCollapsed[i] = true;
  }
  $http({
      method: 'GET',
      url: '/getuserdata'
    })
    .then(function (response) {
      $scope.registerInfo = response.data;
      $scope.registerInfo.password = $scope.registerInfo.local.password;
      $scope.userNotVerified = response.data.verified;
      $scope.userNotVerified = !($scope.userNotVerified);
      console.log($scope.registerInfo);
    });

  $scope.deleteAccount = function () {
    var r = confirm("cette action est irreversible");
    if (r == true) {
      $http({
        method: 'GET',
        url: '/delete_user'
      });
    }
  };

  $scope.testSendEmail = function () {
    var nom = ($scope.registerInfo.nom === '') ? $scope.registerInfo.email : ($scope.registerInfo.nom + ' ' + $scope.registerInfo.prenom);
    $http({
        method: 'GET',
        url: '/sendVerification',
        params: {
          to: $scope.registerInfo.email,
          nom: nom
        }
      })
      .then(function (response) {
        alert("email envoyé avec succes");
        console.log(response);
      });
  };

  $scope.test = function (form) {
    console.log(form);
    $scope.message = [];
    if (form.$error.email) {
      $scope.message.push('email invalid');
    }

    if (typeof form.$error.pattern != 'undefined') {

      for (var i = 0; i < form.$error.pattern.length; i++) {
        if (form.$error.pattern[i].$name === 'password') {
          $scope.message.push('password invalid');
        }
        if ($scope.registerInfo.password !== $scope.registerInfo.password2) {
          $scope.message.push('passwords dont match');
        }
        if (form.$error.pattern[i].$name === 'nom') {
          $scope.message.push('nom invalid ');
        }
        if (form.$error.pattern[i].$name === 'prenom') {
          $scope.message.push('prenom invalid ');
        }
        if (form.$error.pattern[i].$name === 'CIN') {
          $scope.message.push('CIN invalid ');
        }
        if (form.$error.pattern[i].$name === 'Zip') {
          $scope.message.push('Zip invalid ');
        }
        if (form.$error.pattern[i].$name === 'telephone') {
          $scope.message.push('telephone invalid ');
        }
      }
    }

    if (form.$valid) {
      send();
    }
  };

  var send = function () {
    console.log($scope.registerInfo);
    $scope.spinnerClass = 'fa fa-spinner fa-pulse';
    $http({
        method: 'POST',
        url: '/profileupdate',
        data: $scope.registerInfo
      })
      .then(function (response) {
        $scope.message = response.data;
        if (response.data === 'success !!!') {
          $timeout(function () {
            window.location.replace('/#/home');
          }, 1000);
          $scope.spinnerClass = 'fa fa-check';
          $rootScope.getUserData();
        } else {
          $scope.spinnerClass = '';
        }
      });
  };
});

app.controller('articlesController', function ($scope, Article, $uibModal, $animate, $rootScope, $http) {

  $scope.edit = false;

  $scope.carouselTab = [];
  $http({
    method: 'GET',
    url: '/carousel'
  }).then(function (response) {
    $scope.carouselTab = response.data;
  });

  $scope.addImg = function () {
    if ($scope.imgSrc.length > 0) {
      $scope.carouselTab.push({
        "src": $scope.imgSrc
      });
      console.log($scope.carouselTab);
    }
  };

  $scope.deleteImg = function (index) {
    for (var i = 0; i < $scope.carouselTab.length; i++) {
      if (i === index) {
        $scope.carouselTab.splice(i, 1);
      }
    }
    console.log($scope.carouselTab);
  };

  $scope.sendCarousel = function () {
    console.log($scope.carouselTab);
    var xx = $scope.carouselTab;
    $http({
        method: 'POST',
        url: '/carousel',
        data: xx
      })
      .then(function (response) {
        console.log(response);
      });
  };



  $scope.deleteArticle = function (xx) {
    console.log(xx);
    Article.delete({
      article_id: xx
    });
    $rootScope.updateDB();
  };

  $scope.editModal = function (id) {
    $scope.edit = true;
    $scope.editId = id;
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      templateUrl: 'modals/articleForm.html',
      controller: 'articleFormInstanceCtrl',
      scope: $scope,
      windowClass: 'article-form-modal-window'
    });
  };

  $scope.addModal = function () {
    $scope.edit = false;
    $scope.addArticleForm = {};
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      templateUrl: 'modals/articleForm.html',
      controller: 'articleFormInstanceCtrl',
      scope: $scope,
      windowClass: 'article-form-modal-window'
    });
  };

});

app.controller('articleFormInstanceCtrl', function ($scope, $modalInstance, Article, $rootScope) {


  $scope.addArticleSrc = '';
  $scope.addArticleCat = '';
  $scope.addArticleForm = {};
  $scope.addArticleForm.nom = '';
  $scope.addArticleForm.description = '';
  $scope.addArticleForm.prix = 0;
  $scope.addArticleForm.solde = 0;
  $scope.addArticleForm.isSolde = false;
  $scope.addArticleForm.featured = false;
  $scope.addArticleSrcTab = [];
  $scope.addArticleCatTab = [];

  console.log($scope.editId);

  for (var i = 0; i < $scope.db.length; i++) {
    if (!($scope.edit)) {
      break;
    }
    if ($scope.db[i]._id === $scope.editId) {
      $scope.index = i;
      console.log(i);
      $scope.addArticleForm = $scope.db[i];
      $scope.addArticleSrcTab = $scope.db[i].src;
      $scope.addArticleCatTab = $scope.db[i].categorie;
      break;

    }
  }
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.addSrc = function () {
    if ($scope.addArticleSrc === '') return;
    $scope.addArticleSrcTab.push($scope.addArticleSrc);
    $scope.addArticleSrc = '';
  };
  $scope.addCat = function () {
    if ($scope.addArticleCat === '') return;
    if ($scope.addArticleCatTab.indexOf($scope.addArticleCat) > -1) return;
    var sousCategorieTab = [
      ["deco", "nappe", "napperon"],
      ["cuisine", "sousplat", "soustasse", "mugcover", "serviettes"],
      ["parures_de_lit", "unePlace", "deuxPlaces", "thrown"],
      ["bebe", "chausson", "gant", "bonnet", "couverture"],
      ["accessoires", "boucles", "colier", "bracelets", "chauffe", "jambieres"]
    ];
    for (var i = 0; i < sousCategorieTab.length; i++) {
      if (sousCategorieTab[i].indexOf($scope.addArticleCat) >= 0) {
        if ($scope.addArticleCatTab.indexOf(sousCategorieTab[i][0]) >= 0) {
          $scope.addArticleCatTab.push($scope.addArticleCat);
          $scope.addArticleCat = '';
        } else {
          $scope.addArticleCatTab.push(sousCategorieTab[i][0]);
          $scope.addArticleCatTab.push($scope.addArticleCat);
          $scope.addArticleCat = '';
        }
      }
    }
    return;
  };
  $scope.addArticle = function () {
    $scope.addArticleForm.src = $scope.addArticleSrcTab;
    $scope.addArticleForm.categorie = $scope.addArticleCatTab;
    var article = new Article($scope.addArticleForm);
    article.$save().then(function () {
      $rootScope.updateDB();
      $scope.addArticleSrcTab = [];
      $scope.addArticleCatTab = [];
      $modalInstance.dismiss('cancel');
    });
  };

  $scope.itemRemove = function (cat, item) {
    if (cat == "cat") {
      $scope.addArticleCatTab = $scope.addArticleCatTab.filter(function (a) {
        return a !== item;
      });
    }
    if (cat == "img") {
      $scope.addArticleSrcTab = $scope.addArticleSrcTab.filter(function (a) {
        return a !== item;
      });
    }
  };
  $scope.editArticle = function (xx) {
    console.log(xx);
    $scope.addArticleForm.src = $scope.addArticleSrcTab;
    $scope.addArticleForm.categorie = $scope.addArticleCatTab;
    Article.update({
      article_id: xx
    }, $scope.addArticleForm).$promise.then(function () {
      $rootScope.updateDB();
      $modalInstance.dismiss('cancel');
    });
  };


});



//"scripts": {
//  "start": "node server.js"
//},