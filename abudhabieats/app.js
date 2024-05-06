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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
