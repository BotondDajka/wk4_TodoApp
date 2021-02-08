const express = require("express");
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const { Op } = require("sequelize");
const { request, response } = require("express");

const bodyParser = require('body-parser');
const cors = require('cors')

const { Board } = require('./Models/Board')
const { Area } = require('./Models/Area')
const { Task } = require('./Models/Task')


const app = express();
const port = 3000;

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')


app.use(express.static("public"));

app.use(cors())


// read data as if it is JSON
app.use(bodyParser.json({type:"application/json"}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', async (request, response) => {
    response.render("homePage");
})


app.get('/board/', async (request, response) => {
    response.render("boardPage");
})

app.get('/boardsList/', async (request, response) => {
    response.render("boardsListPage");
})

app.post('/api/board/createBoard', async (request, response) => {
    const data = request.body
    if(!data.name) { // ensure some sort of data is given
        throw new Error('Board must have name in order to be added.')
    } else {
        console.log(data)
        await Board.create({name: data.name})
        response.redirect('/boardsList')
    }
})

app.route("/api/board/:boardId")
.get(async (request, response) =>{
    const boardId = request.params.boardId
    if (boardId == "all"){
        await Board.findAll({
            include: [
                {model: Area, as: "areas",
                include:[
                    {model: Task, as: "tasks"}
                ]}
            ]
        }).then(board=>{
            response.json(board).status(200).end()
        }).catch(error =>{
            response.status(404).send("Error 404").end()
        })
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
        console.log(data[Object.keys(data)[0]])
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

                if (!(Object.keys(data)[0] == "title")){
                    response.status(400).send("Task object must contain property called 'title' ").end();
                }
                else if (!(Object.keys(data)[1] == "text")){
                    response.status(400).send("Task object must contain property called 'text' ").end();
                }
                else if (!(Object.keys(data)[2] == "labels")){
                    response.status(400).send("Task object must contain property called 'labels' ").end();
                }
                else if (!(data.labels instanceof Array)){
                    response.status(400).send("Task labels must be an array").end();
                }
                else{
                    task.title = data.title
                    task.text = data.text
                    task.labels = data.labels
                    
                    task.save();

                    response.status(200).end()
                }

            }
        }
    }

})


app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`);
})