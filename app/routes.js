var Article = require('../app/models/article');
var User = require('../app/models/user');
var NewsLetter = require('../app/models/newsletter');
var ContactUs = require('../app/models/contactus');

var fs = require('fs');
var validator = require('validator');

module.exports = function (app, passport, nodemailer, smtpTransport, request) {


    // normal routes ===============================================================
    app.use(function (req, res, next) {
        res.locals.login = req.isAuthenticated();
        next();
    });

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    // HOME SECTION =========================
    app.get('/pages/home.ejs', function (req, res) {
        res.render('pages/home.ejs');
    });

    // PRODUCTS SECTION =========================
    app.get('/pages/products.ejs', function (req, res) {
        res.render('pages/products.ejs');
    });

    // CHECKOUT SECTION =========================
    app.get('/pages/checkout.ejs', function (req, res) {
        res.render('pages/checkout.ejs');
    });
    // CONFIRM CHECKOUT SECTION =========================
    app.get('/pages/confirm_checkout.ejs', function (req, res) {
        res.render("pages/confirm_checkout.ejs");
    });

    // Conditions generales SECTION =========================
    app.get('/pages/conditions.ejs', function (req, res) {
        res.render('pages/conditions.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/pages/profile.ejs', isLoggedIn, function (req, res) {
        var xxx = "";
        if (req.user.pending) {
            xxx = "profile is still pending";
        }
        res.render('pages/profile.ejs', {
            user: req.user,
            message: xxx
        });
    });

    // CONTACT MODAL =========================
    app.get('/modals/contact.html', function (req, res) {
        res.render('modals/contact.ejs');
    });

    // CONFIRM MODAL =========================
    app.get('/modals/confirm.html', function (req, res) {
        res.render('modals/confirm.ejs');
    });


    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    // ARTICLE DETAILS MODAL =========================
    app.get('/modals/articleDetails.html', function (req, res) {
        res.render('modals/articleDetails.ejs');
    });

    // LOGIN MODAL =========================
    app.get('/modals/login.html', function (req, res) {
        res.render('modals/login.ejs');
    });

    // ARTICLE DETAILS PAGE =========================
    app.get('/pages/article_details.ejs', isAdmin, function (req, res) {
        //    app.get('/pages/article_details.ejs',function(req,res){
        res.render('pages/article_details.ejs');
    });

    // ARTICLE DETAILS PAGE =========================
    app.get('/modals/articleForm.html', isAdmin, function (req, res) {
        res.render('modals/articleForm.ejs');
    });

    app.get('/modals/partenaire_modal.html', function (req, res) {
        res.render('modals/partenaire_modal.ejs');
    });
    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/pages/login.ejs', function (req, res) {
        res.render('pages/login.ejs', {
            message: req.flash('loginMessage')
        });
        //console.log(req.flash('loginMessage'));
    });

    // process the login form

    app.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json('ERROR !!! ' + req.flash('loginMessage'));
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.json('success !!!');
            });
        })(req, res, next);
    });

    // SIGNUP =================================
    // show the signup form
    app.get('/pages/signup.ejs', function (req, res) {
        res.render('pages/signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    //   app.post('/signup', passport.authenticate('local-signup',function(err, user, info) {

    app.post('/signup', function (req, res, next) {
        passport.authenticate('local-signup', function (err, user, info) {
            if (err) {
                return next(err);
            } else if (!user) {
                return res.json('ERROR !!! ' + req.flash('signupMessage'));
            }
            req.login(user, function (err) {
                if (!err) {
                    return res.json('success !!!');
                }
            });
        })(req, res, next);
    });


    /*{
       successRedirect : '/#/profile', // redirect to the secure profile section
       failureRedirect : '/#/signup', // redirect back to the signup page if there is an error
       failureFlash : true // allow flash messages*/

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/#/profile',
            failureRedirect: '/'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/auth/twitter', passport.authenticate('twitter', {
        scope: 'email'
    }));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/#/profile',
            failureRedirect: '/'
        }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/#/profile',
            failureRedirect: '/'
        }));


    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // locally  --------------------------------
    app.get('/connect/local', function (req, res) {
        res.render('connect-local.ejs', {
            message: req.flash('loginMessage')
        });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/#/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/#/profile',
            failureRedirect: '/'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', {
        scope: 'email'
    }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect: '/#/profile',
            failureRedirect: '/'
        }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', {
        scope: ['profile', 'email']
    }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect: '/#/profile',
            failureRedirect: '/'
        }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/#/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function (req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function (err) {
            res.redirect('/#/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function (req, res) {
        var user = req.user;
        user.twitter.token = undefined;
        user.save(function (err) {
            res.redirect('/#/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function (req, res) {
        var user = req.user;
        user.google.token = undefined;
        user.save(function (err) {
            res.redirect('/#/profile');
        });
    });
    // =============================================================================
    // GET ACCOUNT =================================================================
    // =============================================================================

    app.get('/getuserdata', isLoggedIn, function (req, res) {
        var user = req.user;
        //console.log(user);
        if(user.local.password)
            user.local.password = "x";
        res.json(user);
    });

    // =============================================================================
    // DELETE ACCOUNT =================================================================
    // =============================================================================


    app.get('/delete_user', isLoggedIn, function (req, res) {
        var user = req.user;
        User.remove({
                _id: user._id
            },
            function (err, article) {
                if (err)
                    res.send(err);
                req.logout();
                res.redirect('/#/home');
            });
    });

    // =============================================================================
    // UPDATE ACCOUNTS =============================================================
    // =============================================================================

    app.post('/profileupdate', isLoggedIn, function (req, res) {
        var user = req.user;
        if (req.bodyEmail("email") !== '') {
            user.email = req.bodyEmail("email");
        }
        if (req.bodyString("password") !== undefined && req.bodyString("password") !== '') {
            if (user.local.password) {
                if (user.validPassword(req.bodyString("oldPassword"))) {
                    user.local.password = user.generateHash(req.bodyString("password"));
                } else {
                    console.log("invalid pass");
                }
            } else {
                user.local.password = user.generateHash(req.bodyString("password"));
            }
        }


        if (req.bodyString("nom") !== '') {
            user.nom = req.bodyString("nom");
        }

        if (req.bodyString("prenom") !== '') {
            user.prenom = req.bodyString("prenom");
        }

        if (req.bodyString("CIN") !== '') {
            user.CIN = req.bodyString("CIN");
        }

        if (req.bodyString("adresse") !== '') {
            user.adresse = req.bodyString("adresse");
        }

        if (req.bodyString("Zip") !== '') {
            user.Zip = req.bodyString("Zip");
        }

        if (req.bodyString("etat") !== '') {
            user.etat = req.bodyString("etat");
        }

        if (req.bodyString("ville") !== '') {
            user.ville = req.bodyString("ville");
        }

        if (req.bodyString("telephone") !== '') {
            user.telephone = req.bodyString("telephone");
        }

        if (typeof (req.body.news) === 'boolean') {
            user.news = req.body.news;
            if (user.news && user.email) {
                var newsletter = new NewsLetter();
                newsletter.email = user.email;
                newsletter.save(function (err) {
                    if (err)
                        res.send(err);

                    // res.send({
                    //     message: 'email added to newsletter'
                    // });
                });
            }
        }

        if ((user.email !== '') &&
            (user.nom !== '') &&
            (user.prenom !== '') &&
            (user.CIN !== '') &&
            (user.adresse !== '') &&
            (user.Zip !== '') &&
            (user.etat !== '') &&
            (user.ville !== '') &&
            (user.telephone !== '')) {
            user.pending = false;
        }
        user.save(function (err) {
            if (err)
                res.send(err);
            res.json('success');
        });
    });

    // =============================================================================
    // NEWSLETTER       ============================================================
    // =============================================================================

    app.post('/add_newsletter', function (req, res) {
        if (req.body.email) {
            var newsletter = new NewsLetter();
            newsletter.email = req.bodyEmail("email");
            if (!validator.isEmail(newsletter.email))
                return;
            newsletter.save(function (err) {
                if (err)
                    res.send(err);

                res.send({
                    message: 'email addded'
                });
            });
        }
    });


    // =============================================================================
    // ContactUs       ============================================================
    // =============================================================================

    app.post('/contactUs', function (req, res) {
        var url = {};
        if (process.env.production) {
            url = {
                url: 'https://www.google.com/recaptcha/api/siteverify?secret=6LcKuQgUAAAAANJshFDexv3aC7m3IFP45_ILlBqh&response=' + req.body.response
            };
        } else {
            url = {
                url: 'https://www.google.com/recaptcha/api/siteverify?secret=6LeRmhMTAAAAAPKG38U_oXGwJiylfNlQEuEh3TF-&response=' + req.body.response
            };
        }
        request.post(url, function (err, httpResponse, body) {
            console.log(body);
            if (JSON.parse(body).success) {
                var contactus = new ContactUs();
                contactus.email = req.bodyEmail("email");
                if (!validator.isEmail(contactus.email)) {
                    res.send({
                        message: 'email invalide'
                    });
                    return;
                }

                contactus.name = req.bodyString("name");
                contactus.message = req.bodyString("message");

                contactus.save(function (err) {
                    if (err)
                        res.send({
                            message: 'erreur:' + err
                        });

                    res.send({
                        message: 'message envoyé avec succes'
                    });
                });
            } else {
                res.send({
                    message: 'reCaptcha invalide'
                });
            }
        });
    });



    // =============================================================================
    // ARTICLE ROUTE    ============================================================
    // =============================================================================
    app.route('/articles')

        //TODO get -> post   Add Article
        .post(function (req, res) {

            var article = new Article();
            article.nom = req.bodyString("nom");
            article.src = req.body.src;
            article.description = req.bodyString("description");
            article.categorie = req.body.categorie;
            article.prix = req.bodyFloat("prix");
            article.solde = req.bodyFloat("solde");
            article.isSolde = req.body.isSolde;
            article.featured = req.body.featured;
            article.save(function (err) {
                if (err)
                    res.send(err);

                res.send({
                    message: 'article created'
                });
            });
        })
        //get all articles
        .get(function (req, res) {
            Article.find(function (err, articles) {
                if (err)
                    res.send(err);
                //console.log(articles);
                res.json(articles);
            });
        });
    // get single article
    app.route('/articles/:article_id')

        // get article with id
        .get(function (req, res) {
            Article.findById(req.params.article_id,
                function (err, article) {
                    if (err)
                        res.send(err);
                    console.log(article);
                    res.json(article);

                });
        })

        // article Put
        .put(function (req, res) {

            Article.findById(req.params.article_id, function (err, article) {

                if (err)
                    res.send(err);

                article.nom = req.bodyString("nom");
                article.src = req.body.src;
                article.description = req.bodyString("description");
                article.categorie = req.body.categorie;
                article.prix = req.bodyFloat("prix");
                article.solde = req.bodyFloat("solde");
                article.isSolde = req.body.isSolde;
                article.featured = req.body.featured;

                article.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json({
                        message: 'successfully updated'
                    });
                });

            });
        })
        // delete article by id

        .delete(function (req, res) {
            Article.remove({
                    _id: req.params.article_id
                },
                function (err, article) {
                    if (err)
                        res.send(err);
                    res.json({
                        message: 'successfully deleted'
                    });
                });
        });

    var Transport = nodemailer.createTransport(smtpTransport({
        service: "Gmail",
        auth: {
            user: "la.maison.du.crochet.test@gmail.com",
            pass: "test123456789"
        }
    }));

    // =============================================================================
    // CAROUSEL ROUTE    ============================================================
    // =============================================================================

    app.route('/carousel')
        .get(function (req, res) {
            fs.readFile('resources/js/carousel.js', function (err, data) {
                if (err) {
                    return console.error(err);
                }
                var response = JSON.parse(data.toString().slice(data.toString().indexOf('[')));
                console.log(response);
                res.json(response);

            });
        })
        .post(function (req, res) {
            var xxx = 'slides= ' + JSON.stringify(req.body);
            console.log(req.body);
            console.log(xxx);
            fs.writeFile('resources/js/carousel.js', xxx, function (err) {
                if (err) {
                    return console.error(err);
                }
                res.send(200);
            });
        });



    // =============================================================================
    // Mail ROUTE    ============================================================
    // =============================================================================
    var rand, mailOptions, host, link;

    app.get('/sendVerification', function (req, res) {

        rand = Math.floor((Math.random() * 100000) + 11);
        host = req.get('host');
        req.user.verifyMail = rand;
        req.user.save(function (err) {
            console.log(err);
        });
        link = "http://" + req.get('host') + "/verify?id=" + rand;

        var template = "<table width='600' cellpadding='0' cellspacing='0' align='center' style='border:1px solid rgba(53,53,53,0.5);font-weight:100;font-size:14px;color:#000000 !important;font-family: georgia!important;'>" +
            "<tr height='400'>" +
            "<td style='padding: 35px;'>" +
            "<div style='text-align:center;'>" +
            "<img src='https://lh3.googleusercontent.com/-g_GDRS20eaA/VjUZnVzNvgI/AAAAAAAAAIc/JmQgiwxNxKs/s288-Ic42/Logo1up.png'>" +
            "</div>" +
            "<p style='margin-left:25px;'>Bienvenu " + req.query.nom + "</p>" +
            "<table style='font-weight:100;font-size:14px;'><tr>" +
            "<td>sur notre site  </td>" +
            "<td><a href='" + "http://" + req.get('host') + "'><img src='https://lh3.googleusercontent.com/-7Wi9g0exp6s/VjUkyAACFCI/AAAAAAAAAI8/kWHcOcuFkG8/s200-Ic42/nom.png'/></a></td>" +
            "</tr>" +
            "</table>" +
            "<p>Il ne vous reste qu'un pas à faire pour ouvrir votre compte.</p>" +
            "<p>Il vous suffit de confirmer votre adresse e-mail en cliquant sur le lien suivant : </p>" +
            "<a href='" + link + "'>" + link +
            "</a>" +
            "<p>Merci de vous être inscrit</p>" +
            "<table style='font-weight:100;font-size:14px;'><tr>" +
            "<td>Nous vous souhaitons un shopping plaisant sur </td>" +
            "<td><a href='" + "http://" + req.get('host') + "'><img src='https://lh3.googleusercontent.com/-7Wi9g0exp6s/VjUkyAACFCI/AAAAAAAAAI8/kWHcOcuFkG8/s200-Ic42/nom.png'/></a></td>" +
            "</tr>" +
            "</table>" +
            "<div style='text-align:center;'>" + "<img style='text-align:center' src='https://lh3.googleusercontent.com/-S11WSjHgtcc/VjUZnCnk3DI/AAAAAAAAAIY/5eFIDo8MfDw/s288-Ic42/Logo1down.png'>" +
            "</div></td></tr></table>";
        mailOptions = {
            from: 'la.maison.du.crochet.test@gmail.com',
            to: req.query.to,
            subject: "Please confirm your Email account",
            html: template
        };
        Transport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                res.send("error");
            } else {
                console.log("Message sent: " + response.message);
                res.send("sent");
            }
        });
    });

    app.post('/sendCheckout', function (req, res) {

        var cart = req.body.articles;
        var totProd = 0;
        var totPay = 0;
        var remise = 0;
        var totRemise = 0;

        var tableau1 = "<table width='600' cellpadding='0' cellspacing='0' style='padding-top:20px;'>" +
            "<tr><th style='border-bottom:1px solid #ec007c;'>reference</th>" +
            "<th style='border-bottom:1px solid #ec007c;'>article</th>" +
            "<th style='border-bottom:1px solid #ec007c;'>quantité</th>" +
            "<th style='border-bottom:1px solid #ec007c;'>prix</th>" +
            "<th style='border-bottom:1px solid #ec007c;'>solde</th>" +
            "<th style='border-bottom:1px solid #ec007c;'> total" +
            "</th style='border-bottom:1px solid #ec007c;'></tr>";
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].isSolde) {
                remise = cart[i].solde;
            } else {
                remise = 0;
            }
            tableau1 += "<tr><td align='center' style='border-bottom:1px solid #353535;'>" +
                cart[i]._id +
                "</td><td align='center' style='border-bottom:1px solid #353535;'>" +
                cart[i].nom +
                "</td><td align='center' style='border-bottom:1px solid #353535;'>" +
                cart[i].itemQty +
                "</td><td align='center' style='border-bottom:1px solid #353535;'>" +
                cart[i].prix +
                "DT</td><td align='center' style='border-bottom:1px solid #353535;'>" +
                cart[i].solde +
                " DT</td><td align='center' style='border-bottom:1px solid #353535;'>" +
                (cart[i].itemQty * (cart[i].prix - remise)) + " DT</td></tr>";


            totProd += cart[i].itemQty;
            totPay += (cart[i].itemQty * cart[i].prix);
            totRemise += (cart[i].itemQty * remise);
        }

        tableau1 += "</table>";

        template = "<table width='600' cellpadding='0' cellspacing='0' align='center'><tr>" +
            "<td width='600' style='background:#353535;'>" +
            "<img src='https://lh3.googleusercontent.com/-cnCVpE9WdJA/Vjuy9KalSqI/AAAAAAAAAKU/mfp-fS7La-I/s288-Ic42/logo2.png'/>" +
            "</td></tr><tr><td>" +
            "<br>Bonjour " + req.body.nom + "<table><tr><td>Merci pour votre shopping sur notre site</td><td><a href='#'>" +
            "<img src='https://lh3.googleusercontent.com/-7Wi9g0exp6s/VjUkyAACFCI/AAAAAAAAAI8/kWHcOcuFkG8/s200-Ic42/nom.png'/></a>" +
            "</td><tr></table></td></tr><tr><th>order details</th></tr><tr><td>" +
            "N° de l'ordre xxxxx placé au xxxxx " +
            "<br>payement : cash on delivery (COD)</td></tr><tr><td>" +
            tableau1 +
            "</td></tr><tr><td><table width='300' cellpadding='0' cellspacing='0' style='padding-top:20px;'>" +
            "<tr><th style='border-bottom:1px solid #ec007c;'>total produits</th>" +
            "<td style='border-bottom:1px solid #ec007c;'>" +
            totProd +
            "</td></tr><tr><th style='border-bottom:1px solid #353535;'>Total brut" +
            "</th><td style='border-bottom:1px solid #353535;'>" +
            totPay +
            " DT</td></tr><tr><th style='border-bottom:1px solid #353535;'>Remise" +
            "</th><td style='border-bottom:1px solid #353535;'>" +
            totRemise +
            " DT</td></tr><tr><th style='border-bottom:1px solid #353535;'>Cadeau</th>" +
            "<td style='border-bottom:1px solid #353535;'>" +
            0 +
            " DT</td></tr><tr><th style='border-bottom:1px solid #353535;'>Shipping" +
            "</th><td style='border-bottom:1px solid #353535;'>" +
            7 +
            " DT</td></tr><tr><th style='border-bottom:1px solid #353535;'>Total a payé" +
            "</th><td style='border-bottom:1px solid #353535;'>" +
            (totPay - totRemise + 7) +
            " DT</td></tr></table></td></tr>" +
            "<tr><td><table width='300' cellpadding='0' cellspacing='0' style='padding-top:20px;'>" +
            "<tr><th style='border-bottom:1px solid #ec007c;'>Shipping Adress</th>" +
            "</tr><tr><td style='border-bottom:1px solid #353535;'>" +
            req.body.shipping + "</td></tr></table></td></tr></table>";

        mailOptions = {
            from: 'la.maison.du.crochet.test@gmail.com',
            to: req.body.to,
            subject: "Checkout recipe",
            html: template
        };

        //console.log(mailOptions);

        Transport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                res.send("error");
            } else {
                console.log("Message sent: " + response.message);
                res.send("sent");

                var user = req.user;
                var tempUser = {};

                tempUser.order_id = "";
                tempUser.date = "";
                tempUser.order_items = [];
                tempUser.order_details = {};
                for (var i = 0; i < cart.length; i++) {
                    tempUser.order_items[i] = {};
                }


                for (var i = 0; i < cart.length; i++) {
                    var d = new Date();
                    tempUser.order_id = d.valueOf();
                    tempUser.date = d.toUTCString();
                    tempUser.order_items[i].article_id = cart[i]._id;
                    tempUser.order_items[i].article_name = cart[i].nom;
                    tempUser.order_items[i].article_prix = cart[i].prix;
                    tempUser.order_items[i].article_qty = cart[i].itemQty;
                    if (cart[i].isSolde) {
                        tempUser.order_details.discount = cart[i].solde;
                    } else {
                        tempUser.order_details.discount = 0;
                    }
                    tempUser.order_details.gift = 0;
                    tempUser.order_details.shipping = 7;
                    tempUser.order_details.adresse_livraison = req.body.shipping;
                }
                user.historique.push(tempUser);
                user.save(function (err) {
                    if (err)
                        res.send(err);
                });
            }
        });
    });


    app.get('/verify', function (req, res) {
        rand = req.user.verifyMail;
        console.log(req.protocol + ":/" + req.get('host'));
        if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
            console.log("Domain is matched. Information is from Authentic email");
            console.log(rand);
            console.log(req.query.id);
            if (req.query.id == rand) {
                console.log("email is verified");
                req.user.verified = true;
                req.user.save(function (err) {
                    console.log(err + "   " + req.user);
                });
                res.end("<h1>Email " + mailOptions.to + " has been Successfully verified");
            } else {
                console.log("email is not verified");
                res.end("<h1>Bad Request</h1>");
            }
        } else {
            res.end("<h1>Request is from unknown source");
        }
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.sendStatus(401);
}

function isPending(req, res, next) {
    if (req.user.pending)
        return next();
    res.redirect('/');
}


// TODO find a better way
function isAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.email === "admin@admin.com" &&
            req.user.nom === "admin" &&
            req.user.prenom === "admin") {
            return next();
        }
    }
    res.send(401);
}