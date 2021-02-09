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

const { Board } = require('./Models/Board')
const { Area } = require('./Models/Area')
const { Task } = require('./Models/Task')

const { User } = require("./Models/User")
const { Team } = require("./Models/Team")


const app = express();
const port = 3000;

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')


app.use(express.static("public"));

app.use(cors())

app.use(cookieParser());


// read data as if it is JSON
app.use(bodyParser.json({type:"application/json"}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

// Clear cookies on server restart
app.use((request, response, next)=>{
    if (request.cookies.user_sid && !request.session.user){
        response.clearCookie("user_sid")
    }
    next();
})

app.route("/")
    .get(async (request, response) => {
        response.render("homePage");
    })
    .post(async (request, response) =>{
        console.log(request.body)
        const username = request.body.username;
        const password = request.body.password;

        User.findOne({
            where:{
                [Op.and]: [
                    {username: username},
                    {password: password}
                ]
            }
        }).then((user)=>{
            if (!user){
                response.redirect("/")
            }
            else { 
                request.session.user = user.dataValues;
                response.redirect("/board")
            }

        }).catch((err)=>{
            response.redirect("/")
        })
    })

app.post("/register", async (request, response) =>{

})

app.get("/logout", async (request, response) => {
    if (request.session.user && request.cookies.user_sid) {
        response.clearCookie('user_sid');
        response.redirect('/');
    } else {
        response.redirect('/');
    }
});


app.get('/board/', async (request, response) => {
    const boards = await Board.findAll()
    
    if (request.session.user && request.cookies.user_sid) {
        User.findOne({
            where:{
                [Op.and]: [
                    {username: request.session.user.username},
                    {password: request.session.user.password}
                ]
            }
        }).then(async (user)=>{
            if (!user){
                response.redirect("/")
            }
            else {
                let boards = [];
                let teamIds = []
                if (typeof(user.teamIdAssignedTo) == "number") teamIds = [user.teamIdAssignedTo]
                for (let i = 0; i <teamIds.length; i++){
                    const teamId = teamIds[i]
                    const board = await Board.findOne({
                        where:{
                            assignedTeamId: teamId
                        }
                    })
                    boards.push(board) 
                }
                response.render("boardPage", { boards: boards, displayName: user.displayName});
            }

        }).catch((err)=>{
            response.redirect("/")
        })
    }
    else{
        response.redirect("/")
    }


})

app.get('/boardsList/', async (request, response) => {
    response.render("boardsListPage");
})

app.post('/api/board/createBoard', async (request, response) => {
    const data = request.body
    if(!data.name) { // ensure some sort of data is given
        throw new Error('Board must have name in order to be added.')
    } else {
        await Board.create({name: data.name})
        response.redirect('/boardsList')
    }
})

app.route("/api/board/:boardId")
.get(async (request, response) =>{

    if (request.session.user && request.cookies.user_sid) {
        User.findOne({
            where:{
                [Op.and]: [
                    {username: request.session.user.username},
                    {password: request.session.user.password}
                ]
            }
        }).then(async (user)=>{
            if (!user){
                response.status(403).send("Error 404").end()
            }
            else {
                const boardId = request.params.boardId
                if (boardId == "all"){

                    let boards = [];
                    let teamIds = []
                    if (typeof(user.teamIdAssignedTo) == "number") teamIds = [user.teamIdAssignedTo]
                    for (let i = 0; i <teamIds.length; i++){
                        const teamId = teamIds[i]
                        const board = await Board.findOne({
                            where:{
                                assignedTeamId: teamId
                            },
                            include: [
                                {model: Area, as: "areas",
                                include:[
                                    {model: Task, as: "tasks"}
                                ]}
                            ]
                        })
                        boards.push(board) 
                    }
                    response.json(boards).status(200).end()
                }
                else{
                    await Board.findOne({
                        where:{
                            id : boardId
                        },
                        include: [
                            {model: Area, as: "areas",
                            include:[
                                {model: Task, as: "tasks"}
                            ]}
                        ]
                    }).then(board =>{
                        if (!board){
                            response.status(404).send("Error 404").end()
                        }else{
                            response.json(board).status(200).end()
                        }
                        
                    }).catch(error =>{
                        response.status(404).send("Error 404").end()
                    })
                }
            }
        }).catch((err)=>{
            response.status(403).send("Error 404").end()
        })
    }
    else{
        response.status(403).send("Error 404").end()
    }
})


app.route("/api/board/:boardId/title")
.get(async (request, response) =>{
    const boardId = request.params.boardId
    if (boardId == "all"){
        await Board.findAll({
            attributes: ["id", "name"],
        })
        .then(board=>{
            response.json(board).status(200).end()
        }).catch(error =>{
            response.status(404).send("Error 404").end()
        })
    }
    else{
        await Board.findOne({
            attributes: ["id", "name"],
            where:{
                id : boardId
            },
        }).then(board =>{
            if (!board){
                response.status(404).send("Error 404").end()
            }else{
                response.json(board).status(200).end()
            }
            
        }).catch(error =>{
            response.status(404).send("Error 404").end()
        })
    }
})


app.post("/api/board/:boardId/editTitle", async (request, response)=>{
    const boardId = request.params.boardId
    const board = await Board.findOne({
        where:{
            id : boardId
        }
    })
    if (!board){
        response.status(404).send(`Board with id ${boardId} can not be found`).end()
    }
    else{
        const data = request.body
        board.name = data[Object.keys(data)[0]]
        board.save()
        
        response.status(200).end()
    }
})

app.post("/api/board/:boardId/area/:areaId/editTitle", async (request, response)=>{
    const boardId = request.params.boardId
    const areaId = request.params.areaId

    const board = await Board.findOne({
        where:{
            id : boardId
        }
    })
    if (!board){
        response.status(404).send(`Board with id ${boardId} can not be found`).end()
    }
    else{
        const area = await Area.findOne({
            where:{
                boardId: boardId,
                id: areaId
            }
        })
        if (!area){
            response.status(404).send(`Area with id ${areaId} can not be found on board ${boardId}`).end()
        }
        else{
            const data = request.body

            area.title = data[Object.keys(data)[0]]
    
            area.save();
    
            response.status(200).end()
        }
    }
})


app.post("/api/board/:boardId/area/:areaId/delete", async (request, response)=>{
    const boardId = request.params.boardId
    const areaId = request.params.areaId

    const board = await Board.findOne({
        where:{
            id : boardId
        }
    })
    if (!board){
        response.status(404).send(`Board with id ${boardId} can not be found`).end()
    }
    else{
        const area = await Area.findOne({
            where:{
                boardId: boardId,
                id: areaId
            }
        })
        if (!area){
            response.status(404).send(`Area with id ${areaId} can not be found on board ${boardId}`).end()
        }
        else{
    
            area.destroy();
    
            response.status(200).end()
        }
    }
})

app.post("/api/board/:boardId/area/create", async (request, response)=>{
    const boardId = request.params.boardId
    

    const board = await Board.findOne({
        where:{
            id : boardId
        }
    })
    if (!board){
        response.status(404).send(`Board with id ${boardId} can not be found`).end()
    }
    else{
        const data = request.body

        if (!data.title){
            response.status(400).send("Area must contain property called 'title' ").end();
        }

        Area.create({title: data.title, boardId: boardId});

        Area.sync()

        response.status(200).end()
    }
})



app.post("/api/board/:boardId/area/:areaId/task/:taskId/editTask", async (request, response) =>{
    const boardId = request.params.boardId
    const areaId = request.params.areaId
    const taskId = request.params.taskId

    const board = await Board.findOne({
        where:{
            id : boardId
        }
    })
    if (!board){
        response.status(404).send(`Board with id ${boardId} can not be found`).end()
    }
    else{
        const area = await Area.findOne({
            where:{
                boardId: boardId,
                id: areaId
            }
        })
        if (!area){
            response.status(404).send(`Area with id ${areaId} can not be found on board ${boardId}`).end()
        }
        else{
            const task = await Task.findOne({
                where:{
                    areaId: areaId,
                    id: taskId
                }
            })
            if (!task){
                response.status(404).send(`Task with id ${taskId} can not be found on area ${areaId} at board ${boardId}`).end()
            }
            else{
                const data = request.body

                if (data.title){
                    task.title = data.title
                }
                if (data.text){
                    task.text = data.text
                }
                if (data.labels){
                    if (!(data.labels instanceof Array)){
                        response.status(400).send("Task labels must be an array").end();
                    }
                    else{
                        task.labels = data.labels
                    }
                }
                task.save();

                response.status(200).end()
            }
        }
    }
})

app.post("/api/board/:boardId/area/:areaId/task/:taskId/move", async (request, response)=>{
    const boardId = request.params.boardId
    const areaId = request.params.areaId
    const taskId = request.params.taskId

    const board = await Board.findOne({
        where:{
            id : boardId
        }
    })
    if (!board){
        response.status(404).send(`Board with id ${boardId} can not be found`).end()
    }
    else{
        const area = await Area.findOne({
            where:{
                boardId: boardId,
                id: areaId
            }
        })
        if (!area){
            response.status(404).send(`Area with id ${areaId} can not be found on board ${boardId}`).end()
        }
        else{
            const task = await Task.findOne({
                where:{
                    areaId: areaId,
                    id: taskId
                }
            })
            if (!task){
                response.status(404).send(`Task with id ${taskId} can not be found on area ${areaId} at board ${boardId}`).end()
            }
            else{
                const data = request.body

                if (!data.columnId){
                    response.status(400).send("Sent object must contain property called 'columnId'").end();
                }
                else{
                    const newArea = await Area.findOne({
                        where:{
                            boardId: boardId,
                            id: data.columnId
                        }
                    })
                    if (!newArea){
                        response.status(404).send(`Area with id ${data.columnId} can not be found on board ${boardId}`).end()
                    }
                    else{
                        task.areaId = data.columnId
                        task.save();

                        response.status(200).end()
                    }
                }
            }
        }
    }
})


app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`);
})