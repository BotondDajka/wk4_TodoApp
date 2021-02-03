const express = require("express");
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const { Op } = require("sequelize");



const app = express();
const port = 3000;

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')


app.use(express.static("public"));

app.get('/', async (request, response) => {
    response.render("homePage");
})


app.get('/board/', async (request, response) => {
    response.render("boardPage");
})

app.get('/boardsList/', async (request, response) => {
    response.render("boardsListPage");
})




app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`);
})