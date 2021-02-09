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

// homepage
app.get('/', async (request, response) => {
    response.render("homePage");
})

// retrive board
app.get('/board/', async (request, response) => {
    response.render("boardPage");
})

// retrive all boards
app.get('/boardsList/', async (request, response) => {
    response.render("boardsListPage");
})




app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`);
})


app.post("/api/board/:boardId/delete", async (request, response)=>{
    const boardId = request.params.boardId
    const board = await Board.findOne({
        where:{
            id : boardId
        }