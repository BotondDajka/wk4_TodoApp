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
    const boards = await Board.findAll()
    response.render("boardPage", { boards });
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
        response.redirect('/board')
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
    
            response.sendStatus(200)
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

        const newArea = await Area.create({title: data.title, boardId: boardId});

        await Area.sync()

        //console.log(newArea.id)

        response.json({areaId: newArea.id}).status(200)
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

app.post("/api/board/:boardId/area/:areaId/task/:taskId/delete", async (request, response) =>{
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

                await task.destroy()
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


// This is the delete function for the board
app.post("/api/board/:boardId/delete", async (request, response)=>{
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
        board.destroy();
        response.status(200).end()
        
    }
})

// create a new tasks
app.post("/api/board/:boardId/area/:areaId/task/createTask", async (request, response) =>{
    const boardId = request.params.boardId
    const areaId = request.params.areaId

    let newTask = null;

    const board = await Board.findOne({
        
        where:{
            id : boardId
        }
    })
    if (!board){
        response.status(404).send(`Board with id ${boardId} can not be found`).end()
    }
    else{
        // retrieve all the areas for the board
        const areas = await board.getAreas()
        // loop and find the specific area
        let areaFound = false;
        for (i=0; i<areas.length; i++) {
            if (areas[i].id == areaId) {
                areaFound = true;
                const selectedArea = areas[i];

                const data = request.body;
                console.log(data)
                let title;
                let text;
                let labels;

                if (data.title){
                    title = data.title

                }
                if (data.text){
                    text = data.text
                }
                if (data.labels){
                    if (!(data.labels instanceof Array)){
                        response.status(400).send("Task labels must be an array").end();
                    }
                    else{
                        labels = data.labels
                    }
                }
                newTask = await Task.create({title: title,
                text:text, labels:labels});

                await selectedArea.addTask(newTask);

                break; 
            }
        } // end for

        if (!areaFound){
            response.status(404).send("Error area not found").end
        }       
        
        response.json({taskId: newTask.id}).status(200)
    }
})

