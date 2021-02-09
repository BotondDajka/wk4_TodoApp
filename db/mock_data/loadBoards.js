const fs = require('fs')
const { Board } = require('../../Models/Board')
const { Area } = require('../../Models/Area')
const { Task } = require('../../Models/Task')

fs.readFile('./db/mock_data/board.json', (err, data) => {
    if(err) {
        throw new Error(err)
    }
    const parsedData = JSON.parse(data)
    loadBoards(parsedData)
})

async function loadBoards(data) {
    let areaIndex = 1
    for(let i = 0; i < data.length; i++) {
        const currentBoard = data[i]
        await Board.create({name: currentBoard.name, assignedTeamId: currentBoard.team})

        for(let j = 0; j < currentBoard.areas.length; j++) {
            const currentArea = currentBoard.areas[j]
            await Area.create({title: currentArea.title, boardId: i+1})

            for(let k = 0; k < currentArea.tasks.length; k++) {
                const currentTask = currentArea.tasks[k]
                await Task.create({title: currentTask.taskTitle, text: currentTask.text, areaId: areaIndex, labels: currentTask.labels})
            }
            areaIndex++
        }
    }
}