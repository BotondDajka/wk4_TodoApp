const container = document.getElementById('container')
let boardId = null;

// generate board when board is selected from navbar
function generateBoard(id) {
    document.getElementById('container').innerHTML = ""
    document.getElementById('delete-board-button').innerHTML = `<img onclick="deleteBoard(${id})" style="float: right; margin: 0; padding: 10px 5px" class="cross" />`
    const boardId = id;
    $.get(`http://localhost:3000/api/board/${id}`, function(data) {
        document.getElementById('boardName').value = data.name
        const boardTitle = document.getElementById('boardName')
        boardTitle.value = data.name
        boardTitle.onchange = function() { // function whenever title is updated
            const textToUpdateTo = boardTitle.value
            // update board record with new title

            if (/^[a-z0-9, .-]+$/i.test(textToUpdateTo)){
                var xhr = new XMLHttpRequest();
                xhr.open("POST", `http://localhost:3000/api/board/${boardId}/editTitle`, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    boardTitle: textToUpdateTo
                }));
                document.getElementById(`dropdown${boardId}`).innerText = textToUpdateTo
            }
            else{
                alert("Please only use alphanumeric characters or punctuation symbols");
            }
        }

        for(let i = 0; i < data.areas.length; i++) {
            const currentArea = data.areas[i]
            const column = document.createElement('div')
            column.classList.add('column')

            column.id = `column${currentArea.id}`


            const columnTitle = document.createElement('textarea')
            columnTitle.innerHTML = currentArea.title
            columnTitle.classList.add('edit')
            columnTitle.style.fontSize = '30px'
            columnTitle.onchange = function() { // function whenever title is updated
                const id = column.id.replace('column', '') // grab id and convert from string
                const textToUpdateTo = columnTitle.value
                if (/^[a-z0-9, .-]+$/i.test(textToUpdateTo)){
                    var xhr = new XMLHttpRequest();
                    // update area record with new title
                    xhr.open("POST", `http://localhost:3000/api/board/${boardId}/area/${id}/editTitle`, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({
                        name: textToUpdateTo
                    }));
                }
                else{
                    alert("Please only use alphanumeric characters or punctuation symbols");
                }
                
            }
            column.append(columnTitle)

            const ul = document.createElement('ul')
            ul.classList.add('connectedSortable')
            column.append(ul)

            const plus = document.createElement('img')
            plus.classList.add('plus')
            plus.onclick = function() {addTask(boardId, column.id)}

            column.append(plus)

            const cross = document.createElement('img')
            cross.classList.add('cross')
            cross.onclick = function(){deleteColumn(id, currentArea.id)}
            column.append(cross)

            container.append(column)

        
            for(let j = 0; j < data.areas[i].tasks.length; j++) {
                const currentTask = currentArea.tasks[j]
                const li = document.createElement('li')
                li.classList.add('task')
              
                li.id = `task${currentTask.id}`


                const taskTitle = document.createElement('textarea')
                taskTitle.classList.add('edit')
                taskTitle.style.fontSize = '22px'
                taskTitle.innerHTML = currentTask.title
                taskTitle.onchange = function() { // function whenever title is updated
                    const taskId = li.id.replace('task', '') // grab id and convert from string
                    const textToUpdateTo = taskTitle.value
                    const areaId = document.getElementById(li.id).parentNode.parentNode.id.replace('column', '')
                    if (/^[a-z0-9, .-]+$/i.test(textToUpdateTo)){
                        // update task title in task record
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", `http://localhost:3000/api/board/${boardId}/area/${areaId}/task/${taskId}/editTask`, true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({
                            title: textToUpdateTo
                        }));
                    }
                    else{
                        alert("Please only use alphanumeric characters or punctuation symbols");
                    }
                    
                }

                const taskText = document.createElement('textarea')
                taskText.classList.add('edit')
                taskText.style.fontSize = '14px'
                taskText.innerHTML = currentTask.text
                taskText.onchange = function() { // function whenever title is updated
                    const taskId = li.id.replace('task', '') // grab id and convert from string
                    const textToUpdateTo = taskText.value
                    const areaId = document.getElementById(li.id).parentNode.parentNode.id.replace('column', '')
                    if (/^[a-z0-9, .-]+$/i.test(textToUpdateTo)){
                        // update task text/description in task record
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", `http://localhost:3000/api/board/${boardId}/area/${areaId}/task/${taskId}/editTask`, true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({
                            text: textToUpdateTo
                        }));
                    }
                    else{
                        alert("Please only use alphanumeric characters or punctuation symbols");
                    }
                }

                const avatar = document.createElement('img')
                avatar.src = 'https://www.w3schools.com/howto/img_avatar.png'
                avatar.classList.add('avatar')

                li.append(taskTitle)
                li.append(taskText)
                li.append(avatar)

                ul.append(li)
            }
        }
        const plus = document.createElement('img')
        plus.classList.add('plus')
        plus.id = "addBoard"
        plus.style.margin = '2%'
        plus.onclick = function(){addColumn(id)}
        container.append(plus)

        $( function() {
            $( ".connectedSortable, .connectedSortable" ).sortable({
                connectWith: ".connectedSortable",
                dropOnEmpty: true,
                receive: function( event, ui ) {


                    const itemId = ui.item["0"].id.replace("task","")
                    const oldColumnId = lastParent.id.replace("column","")
                    const newColumnId = ui.item["0"].parentNode.parentNode.id.replace("column","")

                    console.log(newColumnId)
                    
                    $.ajax({
                        type: "POST",
                        url: `http://localhost:3000/api/board/${boardId}/area/${oldColumnId}/task/${itemId}/move`,
                        // The key needs to match your method's input parameter (case-sensitive).
                        data: JSON.stringify({ "columnId" : newColumnId }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                    });

                },
                start: function( event, ui ) {   
                    lastParent = this.parentNode
                }
            
            }).disableSelection();
        } );

        $(".edit").on("keydown keyup click", function(){
            this.style.height = "1px";
            this.style.height = (this.scrollHeight) + "px"; 
        });
    })
}

function addColumn(id) {
    const column = document.createElement('div')
    column.classList.add('column')

    const columnTitle = document.createElement('textarea')
    columnTitle.innerHTML = "New Column"
    columnTitle.classList.add('edit')
    columnTitle.style.fontSize = '30px'
    column.append(columnTitle)

    const ul = document.createElement('ul')
    ul.classList.add('connectedSortable')
    column.append(ul)

    const plus = document.createElement('img')
    plus.classList.add('plus')
    column.append(plus)

    const cross = document.createElement('img')
    cross.classList.add('cross')
    column.append(cross)

    document.getElementById("addBoard").before(column)
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `http://localhost:3000/api/board/${id}/area/create`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        title: "New Column"
    }));

    generateBoard(id)
}

function addTask(boardId, columnId) {
    const queryColumnId = columnId.replace('column', '')

    const task = document.createElement('li')
    task.classList.add('task')
    task.classList.add('ui-sortable-handle')
    
    const taskTitle = document.createElement('textarea')
    taskTitle.classList.add('edit')
    taskTitle.style.fontSize = '22px'
    taskTitle.value = "New task"

    const taskText = document.createElement('textarea')
    taskText.classList.add('edit')
    taskText.style.fontSize = '14px'
    taskText.value = "Add task description here"

    taskTitle.onchange = function() { // function whenever title is updated
        const taskId = li.id.replace('task', '') // grab id and convert from string
        const textToUpdateTo = taskTitle.value
        const areaId = document.getElementById(li.id).parentNode.parentNode.id.replace('column', '')
        // update task title in task record
        var xhr = new XMLHttpRequest();
        xhr.open("POST", `http://localhost:3000/api/board/${boardId}/area/${areaId}/task/${taskId}/editTask`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            title: textToUpdateTo
        }));
    }

    taskText.onchange = function() { // function whenever title is updated
        const taskId = li.id.replace('task', '') // grab id and convert from string
        const textToUpdateTo = taskText.value
        const areaId = document.getElementById(li.id).parentNode.parentNode.id.replace('column', '')
        // update task text/description in task record
        var xhr = new XMLHttpRequest();
        xhr.open("POST", `http://localhost:3000/api/board/${boardId}/area/${areaId}/task/${taskId}/editTask`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            text: textToUpdateTo
        }));
    }

    task.append(taskTitle)
    task.append(taskText)
    document.getElementById(columnId).append(task)

    var xhr = new XMLHttpRequest();
    xhr.open("POST", `http://localhost:3000/api/board/${boardId}/area/${queryColumnId}/task/createTask`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        title: taskTitle.value,
        text: taskText.value
    }));

    generateBoard(boardId)
}

function displayNewBoardForm() {
    const form = document.querySelector('#new-board-form')
    form.style.display === "none" ? form.style.display = "block" : form.style.display = "none"
}


function deleteColumn(id, areaId) {
   $.ajax({
    type: "POST",
    url: `http://localhost:3000/api/board/${id}/area/${areaId}/delete`,
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify({}),
    success: function(){
        generateBoard(id)
    },
    contentType: "application/json; charset=utf-8",
});
}



function deleteBoard(id) {
    $.ajax({
        type: "POST",
        url: `http://localhost:3000/api/board/${id}/delete`,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify({}),
        success: function(){
            window.location.href = "http://localhost:3000/board";
        },
        contentType: "application/json; charset=utf-8",
    });
}
