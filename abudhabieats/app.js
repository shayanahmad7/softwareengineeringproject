const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
const port = 3000;

app.engine('hbs', engine({
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


app.get('/', (req, res) => {
    res.render('landingpage', {
        style: '/css/landingpage.css',
        landingHeader: true
    });
});

app.get('/login', (req, res) => {
    res.render('login', { style: '/css/login.css' });  
});
app.post('/login', (req, res) => {
    // Here, you would handle the authentication logic.
    // For now, simply redirect to the home page after login.
    res.redirect('/home');
});

// Routes for the create profile pages
app.get('/createprofile1', (req, res) => {
    res.render('createprofile1', { style: '/css/createprofile1.css' });  // Assuming you have separate CSS for this page
});

app.post('/createprofile2', (req, res) => {
    // Process the form data here
    // For now, just redirect to the createprofile2 page
    res.redirect('/createprofile2');
});


app.get('/createprofile2', (req, res) => {
    res.render('createprofile2', { style: '/css/createprofile2.css' });
});

app.post('/createprofile3', (req, res) => {
    // Process the form data here
    // For now, just redirect to the createprofile2 page
    res.redirect('/createprofile3');
});

app.get('/createprofile3', (req, res) => {
    res.render('createprofile3', { style: '/css/createprofile3.css' });
});

app.post('/createprofile4', (req, res) => {
    // Process the form data here
    // For now, just redirect to the createprofile2 page
    res.redirect('/createprofile4');
});

app.get('/createprofile4', (req, res) => {
    res.render('createprofile4', { style: '/css/createprofile4.css' });
});

app.post('/createprofile5', (req, res) => {
    // Process the form data here
    // For now, just redirect to the createprofile2 page
    res.redirect('/createprofile5');
});

app.get('/createprofile5', (req, res) => {
    res.render('createprofile5', { style: '/css/createprofile5.css' });
});

app.post('/createprofile6', (req, res) => {
    // Process the form data here
    // For now, just redirect to the createprofile2 page
    res.redirect('/createprofile6');
});


app.get('/createprofile6', (req, res) => {
    res.render('createprofile6', { style: '/css/createprofile6.css' });
});

app.post('/createprofile7', (req, res) => {
    // Process the form data here
    // For now, just redirect to the createprofile2 page
    res.redirect('/createprofile7');
});

app.get('/createprofile7', (req, res) => {
    res.render('createprofile7', { style: '/css/createprofile7.css' });
});

app.post('/createprofile7', (req, res) => {
    res.redirect('/home');
});

// Route for the home page
app.get('/home', (req, res) => {
    res.render('home', {
        style: '/css/home.css',
        extendedHeader: true
    });
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
