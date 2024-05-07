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
const openai = require('openai');
const dotenv = require('dotenv');
const Handlebars = require('handlebars');



const app = express();
const port = 4000;

dotenv.config();
// Get the OpenAI API key from the environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not found. Please add it to your .env file.');
    process.exit(1);
}

// Initialize the OpenAI API client
const client = new openai(OPENAI_API_KEY);

(async () => {
    try {
        await connectDB();  // Ensure MongoDB is connected before starting the server
        
        // Setup handlebars and views
        app.engine('hbs', engine({
            defaultLayout: 'main',
            layoutsDir: 'views/layouts',
            extname: '.hbs',
            helpers: {
                formatMealPlan: function(text) {
                   // Replace **text** with <strong>text</strong>
                    const formattedText = text.replace(/\*\*(.*?)\*\*/gm, '<strong>$1</strong>');
                    // Convert new lines into paragraphs
                    return new Handlebars.SafeString(
                        formattedText.split('\n').map(line => `<p>${line.trim()}</p>`).join('')
                    );
                }
            }
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
                
                const meals = await Meal.aggregate([
                    { $match: { description: { $regex: /^.{20,}$/ } } },  // Filter for descriptions at least 50 characters long
                    { $sample: { size: 3 } }  // Get 3 random documents
                ]);
                
                res.render('meal-feeling-hungry', {
                    style: '/css/meal-feeling-hungry.css',
                    extendedHeader: true,
                    meals: meals  // Pass the meals data to the template
                });
            } catch (err) {
                
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

        
        // Post Route for the meal-plan-pre-generate-hungry page
        app.post('/meal-plan-pre-generate', async (req, res) => {
            const days = parseInt(req.body.days, 10);
            const daysPlan = [];
        
            for (let i = 1; i <= days; i++) {
                const dayMeals = await generateMealsForDay();
                daysPlan.push({ day: `Day ${i}`, meals: dayMeals });  // Label days correctly
            }
            req.session.mealPlan = daysPlan;
            res.redirect('/meal-plan-post-generate');
        });
        
        async function generateMealsForDay() {
            const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];  // Assuming these types are just for labeling
            const meals = [];
        
            for (const type of mealTypes) {
                const meal = await Meal.aggregate([
                    { $match: { description: { $regex: /^.{20,}$/ } } },  // Adjust this if you have specific types in your data
                    { $sample: { size: 1 } }
                ]);
        
                if (meal.length > 0) {
                    meals.push({ ...meal[0], type: type });  // Add the meal type for labeling
                }
            }
        
            return meals;
        }
        

        // Route for the meal-plan-post-generate-hungry page
        app.get('/meal-plan-post-generate', (req, res) => {
            const daysPlan = req.session.mealPlan || []; // Retrieve the plan from the session or another source
        res.render('meal-plan-post-generate', {
            style: '/css/meal-plan-post-generate.css',
            extendedHeader: true,
            daysPlan: daysPlan,
            days: daysPlan.length
        }, function(err, html) {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error rendering the page');
                } else {
                    res.send(html);
                }
            });
        });



        
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
        app.post('/update-profile', (req, res) => {
            if (!req.isAuthenticated()) {
                return res.status(403).send('Not authenticated');
            }
        
            const userId = req.user._id;  // Assuming req.user is populated from the session
            const updatedData = {
                height: parseInt(req.body.height, 10),
                weight: parseInt(req.body.weight, 10),
                goalWeight: parseInt(req.body.goal_weight, 10),
                goals: req.body.goals || [],
                restrictions: req.body.restrictions || [],
                allergies: req.body.allergies || []
            };
        

            User.findByIdAndUpdate(userId, updatedData, { new: true })
            .then(updatedUser => {
                // Redirect to the home page after successful profile update
                res.redirect('/home');
            })
            .catch(error => {
                console.error('Error updating user profile:', error);
                // Optionally, you could use flash messages to show errors
                req.flash('error_msg', 'Failed to update profile.');
                res.redirect('/update-profile');  // Redirect back to the update form
            });
            });

            

            function constructMealPlanPrompt(user) {
                return `As a nutritionist, create a detailed daily meal plan for a ${user.sex} with the following specifics:
                Goals: ${user.goals.join(', ')}
                Height: ${user.height} cm
                Weight: ${user.weight} kg
                Goal Weight: ${user.goalWeight ? user.goalWeight + " kg" : "No specific goal weight"}
                Dietary Restrictions: ${user.restrictions.join(', ') || "None"}
                Allergies: ${user.allergies.join(', ') || "None"}
                Please provide a balanced plan including breakfast, lunch, dinner, and suggested snacks. Each meal should include calculated portion sizes with complete calorie and nutrient information, and consider the dietary restrictions and allergies specified.`;
            }
            
            app.get('/ai', async (req, res) => {
                if (!req.isAuthenticated()) {
                    console.log("User is not authenticated.");
                    return res.redirect('/login');
                }
            
                try {
                    const userId = req.user._id;
                    console.log("Fetching user with ID:", userId);
                    const user = await User.findById(userId);
            
                    if (!user) {
                        console.log("No user found for ID:", userId);
                        return res.status(404).send('User not found');
                    }
            
                    const prompt = constructMealPlanPrompt(user);
                    console.log("Generated prompt for OpenAI:", prompt);
                    const mealPlan = await generateMealPlan(prompt);
            
                    console.log("Meal plan received from OpenAI:", mealPlan);
                    res.render('ai', {
                        style: '/css/ai.css',
                        extendedHeader: true,
                        title: "Here's your daily AI meal-plan",
                        mealPlan
                    }   );
                    
                } catch (error) {
                    console.error('Error in generating AI Meal Plan:', error);
                    res.status(500).send('Failed to generate meal plan due to an internal error');
                }
            });
            
            
            
            // This would be the function to interact with OpenAI's API
            async function generateMealPlan(prompt) {
                const response = await client.chat.completions.create({
                    model: 'gpt-3.5-turbo', 
                    messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
                    max_tokens: 1500
                });
            
                if (response.choices && response.choices.length > 0 && response.choices[0].message) {
                    return response.choices[0].message.content.trim();
                } else {
                    throw new Error('Invalid response from the OpenAI API');
                }
            }
            

            app.listen(port, () => {
                console.log(`Server running on http://localhost:${port}`);
            });
        } catch (error) {
            console.error('Failed to connect to MongoDB', error);
            process.exit(1);
    }
})();



 
