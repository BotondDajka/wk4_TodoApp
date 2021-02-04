const express = require("express");
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const { Op } = require("sequelize");

const cookieParser = require('cookie-parser');  // Session Auth
const session = require('express-session');     // Session Auth
const bodyParser = require('body-parser');      // Session Auth
const bcrypt = require('bcryptjs');
const cors = require('cors')

const { Board } = require("./Models/Board")
const { Team } = require("./Models/Team")
const { Area } = require("./Models/Area")
const { Task } = require("./Models/Task")
const { User } = require("./Models/User")




const app = express();
const port = 80;

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')


app.use(express.static("public"));

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());


app.use(session({
    key: "user_sid",
    secret: "something",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        expires: new Date(253402300000000)
    }
}));

app.use((request, response, next)=>{
    if (request.cookies.user_sid && !request.session.user){
        response.clearCookie("user_sid")
    }
    next();
})



app.get('/', async (request, response) => {
    bcrypt.hash("user_sid", 10, function(err, hash) {
        console.log(hash)
    });

    
    request.session.user = "Test";
    response.render("homePage");
})


app.get('/board/', async (request, response) => {
    console.log(request.session.user)

    response.render("boardPage");
})

app.get('/boardsList/', async (request, response) => {
    response.render("boardsListPage");
})




app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`);
})