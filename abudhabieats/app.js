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

app.get('/', (req, res) => {
    res.render('landingpage', { style: '/css/landingpage.css' });
});

// Route for the create profile page
app.get('/createprofile1', (req, res) => {
    res.render('createprofile1', { style: '/css/createprofile1.css' });  // Assuming you have separate CSS for this page
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
