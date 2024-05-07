const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const Meal = require('./models/Meals');  
const User = require('./models/User'); 
const connectDB = require('./config/db');


const app = express();
const port = 4000;

(async () => {
    try {
        await connectDB();  // Ensure MongoDB is connected before starting the server
        
        // Setup handlebars and views
        app.engine('hbs', engine({
            defaultLayout: 'main',
            layoutsDir: 'views/layouts',
            extname: '.hbs'
        }));
        app.set('view engine', 'hbs');
        app.set('views', './views');

        // Middleware setup
        app.use(express.static('public'));
        app.use(express.urlencoded({ extended: true }));
        app.use(flash());

        app.use(session({
            secret: 'some secret',
            resave: false,
            saveUninitialized: false
        }));



        // Route definitions
        app.get('/', (req, res) => {
            res.render('landingpage', { style: '/css/landingpage.css', landingHeader: true });
        });


        passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match user
            User.findOne({ email: email }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'That email is not registered' });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            }).catch(err => console.log(err));
        }));

        // Serialize User
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        // Deserialize User
        passport.deserializeUser((id, done) => {
            User.findById(id)
                .then(user => {
                    done(null, user);
                })
                .catch(err => {
                    done(err, null);
                });
        });


        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            res.locals.error = req.flash('error');
            next();
        });



        app.use(session({
            secret: 'some secret',
            resave: false,
            saveUninitialized: false
        }));
        
        // Initialize Passport and its session
        app.use(passport.initialize());
        app.use(passport.session());


        app.get('/login', (req, res) => {
            if (req.isAuthenticated()) {
                res.redirect('/home');
            } else {
                res.render('login', { style: '/css/login.css' });
            }
        });

        app.post('/login', passport.authenticate('local', {
            successRedirect: '/home',
            failureRedirect: '/login',
            failureFlash: true
        }));

        // Profile creation stages
        app.get('/createprofile1', (req, res) => {
            res.render('createprofile1', { style: '/css/createprofile1.css' });
        });

        app.post('/createprofile1', (req, res) => {
            if (!req.session.userProfile) {
                req.session.userProfile = {};
            }
            // Save firstname from previous form, now store in session
            req.session.userProfile.firstname = req.body.firstName
            res.redirect('/createprofile2');
        });

        app.get('/createprofile2', (req, res) => {
            res.render('createprofile2', { style: '/css/createprofile2.css' });
        });

        app.post('/createprofile2', (req, res) => {
            // Save goals and carry forward firstname
            const selectedGoals = req.body.goals || [];
            
            // Ensure `selectedGoals` is an array, which it will be if multiple checkboxes are checked
            // If only one checkbox is checked, make sure it's treated as an array
            const goalsArray = Array.isArray(selectedGoals) ? selectedGoals : [selectedGoals].filter(Boolean);

            // Save or process these goals as needed, e.g., store them in the session
            req.session.userProfile = req.session.userProfile || {};
            req.session.userProfile.goals = goalsArray;
            res.redirect('/createprofile3');
        });


        app.get('/createprofile3', (req, res) => {
            res.render('createprofile3', { style: '/css/createprofile3.css' });
        });
        app.post('/createprofile3', (req, res) => {
            // Save restrictions and carry forward previous data
            const selectedRestrictions = req.body.restrictions || [];
            
            // Ensure `selectedRestrictions` is an array
            const restrictionsArray = Array.isArray(selectedRestrictions) ? selectedRestrictions : [selectedRestrictions].filter(Boolean);

            // Save or process these restrictions, typically storing them in the session
            req.session.userProfile = req.session.userProfile || {};
            req.session.userProfile.restrictions = restrictionsArray
            res.redirect('/createprofile4');
        });

        // Continue similar modifications for remaining steps...
        app.get('/createprofile4', (req, res) => {
            res.render('createprofile4', { style: '/css/createprofile4.css' });
        });

        app.post('/createprofile4', (req, res) => {
            // Save allergies and carry forward previous data

            const selectedAllergies = req.body.allergies || [];
            
            // Ensure `selectedRestrictions` is an array
            const allergiesArray = Array.isArray(selectedAllergies) ? selectedAllergies : [selectedAllergies].filter(Boolean);

            // Save or process these restrictions, typically storing them in the session
            req.session.userProfile = req.session.userProfile || {};
            req.session.userProfile.allergies = allergiesArray
            
            res.redirect('/createprofile5');
        });

        app.get('/createprofile5', (req, res) => {
            res.render('createprofile5', { style: '/css/createprofile5.css' });
        });

        app.post('/createprofile5', (req, res) => {
            // Save height, weight, goalWeight, sex, and birthDate
            req.session.userProfile.height = req.body.height;
            req.session.userProfile.weight = req.body.weight;
            req.session.userProfile.goalWeight = req.body.goal_weight;
            req.session.userProfile.sex = req.body.sex;
            req.session.userProfile.birthDate = req.body.birthdate;
            console.log(req.session.userProfile.height)
            res.redirect('/createprofile6');
        });

        app.get('/createprofile6', (req, res) => {
            res.render('createprofile6', { style: '/css/createprofile6.css' });
        });

        app.post('/createprofile6', (req, res) => {
            // Save email and password and finally create the user
            req.session.userProfile.email = req.body.email;
            // Store raw password temporarily (encrypt before saving)
            const rawPassword = req.body.password;
            console.log(req.session.userProfile)

            // Encrypt the password and save the user
            bcrypt.hash(rawPassword, 10, async (err, hashedPassword) => {
                if (err) {
                    return res.status(500).render('error', { message: "Failed to encrypt password." });
                }
                req.session.userProfile.password = hashedPassword;

                // Create a new user with the data stored in session
                const userData = {
                    ...req.session.userProfile,
                    height: parseInt(req.session.userProfile.height, 10),
                    weight: parseInt(req.session.userProfile.weight, 10),
                    goalWeight: parseInt(req.session.userProfile.goalWeight, 10), // ensure this is a number, even if optional
                    birthDate: new Date(req.session.userProfile.birthDate) // converting string to Date object
                };

                // Create a new user instance
                const newUser = new User(userData);
                console.log(newUser)
                //const newUser = new User(req.session.userProfile);
                try {
                    await newUser.save();
                    console.log(newUser)
                    req.session.userProfile = null; // Clear the stored profile data
                    res.redirect('/createprofile7'); // Redirect to the home page after successful registration

                } catch (error) {
                    console.error('Failed to create user:', error.message);  // Log the actual error message
                    res.status(500).render('error', { message: "Failed to create profile: " + error.message });


                    // console.error('Failed to create user:');
                    // res.status(500).render('error', { message: "Failed to create profile." });
                }
            });
        });

        app.get('/createprofile7', (req, res) => {
            res.render('createprofile7', { style: '/css/createprofile7.css' });
        });




        app.get('/home', (req, res) => {
            if (!req.isAuthenticated()) {
                // If the user is not authenticated, redirect to login
                return res.redirect('/login');
            }
            // If a user is authenticated, render the home page with user and styling info
            res.render('home', {
            style: '/css/home.css',
            extendedHeader: true,
            user: req.user  // Passport adds the user to req.user when authenticated
            });
        });

        // Route for the meal-feeling-hungry page
        app.get('/meal-feeling-hungry', async (req, res) => {
            try {
                console.log("Attempting to fetch meals...");
                const meals = await Meal.aggregate([
                    { $match: { description: { $regex: /^.{10,}$/ } } },  // Filter for descriptions at least 50 characters long
                    { $sample: { size: 3 } }  // Get 3 random documents
                ]);
                console.log("Meals fetched:", meals); // Log the fetched meals to see what we get from the database
                if (meals.length === 0) {
                    console.log("No meals fetched. Check database data and query filters.");
                }
                res.render('meal-feeling-hungry', {
                    style: '/css/meal-feeling-hungry.css',
                    extendedHeader: true,
                    meals: meals  // Pass the meals data to the template
                });
            } catch (err) {
                console.error("Error fetching meals from database:", err);
                res.status(500).send('Error rendering the page');
            }
        });


        // Route for the meal-plan-pre-generate-hungry page
        app.get('/meal-plan-pre-generate', (req, res) => {
            res.render('meal-plan-pre-generate', {
                style: '/css/meal-plan-pre-generate.css',
                extendedHeader: true
            }, function(err, html) {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error rendering the page');
                } else {
                    res.send(html);
                }
            });
        });

        // Route for the meal-plan-post-generate-hungry page
        app.get('/meal-plan-post-generate', (req, res) => {
            res.render('meal-plan-post-generate', {
                style: '/css/meal-plan-post-generate.css',
                extendedHeader: true
            }, function(err, html) {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error rendering the page');
                } else {
                    res.send(html);
                }
            });
        });

        // Route for the meal-plan-post-generate-hungry page
        app.get('/reports', (req, res) => {
            res.render('reports', {
                style: '/css/reports.css',
                extendedHeader: true
            }, function(err, html) {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error rendering the page');
                } else {
                    res.send(html);
                }
            });
        });
        // Route for the meal-plan-post-generate-hungry page
        app.get('/update-profile', (req, res) => {
            res.render('update-profile', {
                style: '/css/update-profile.css',
                extendedHeader: true
            }, function(err, html) {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error rendering the page');
                } else {
                    res.send(html);
                }
            });
        });


        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
})();



 
