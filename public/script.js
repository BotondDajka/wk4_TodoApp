const container = document.getElementById('container')
let boardId = null;

// generate board when board is selected from navbar
function generateBoard(id) {
    document.getElementById('container').innerHTML = ""
    document.getElementById('delete-board-button').innerHTML = `<img onclick="deleteBoard(${id})" style="float: right; margin: 0; padding: 10px 5px; box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.75);" class="cross" />`
    boardId = id;

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
            plus.onclick = function() {addTask(column.id)}

            column.append(plus)

            const cross = document.createElement('img')
            cross.classList.add('cross')
            cross.alt = "Delete column"
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


                const taskDeleteBtn = document.createElement("img")

                taskDeleteBtn.classList.add("cross")
                taskDeleteBtn.style.position = "absolute"
                taskDeleteBtn.style.right = "-5px"
                taskDeleteBtn.style.top = "-5px"
                taskDeleteBtn.style.width = "20px"
                taskDeleteBtn.style.height = "20px"

                taskDeleteBtn.onclick = function(){deleteTask(column.id, li.id)} 

                li.append(taskDeleteBtn)



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

                    ui.item["0"].querySelector(".cross").onclick =  function(){deleteTask("column"+newColumnId, "task"+itemId)}
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
    const generateColumn = (areaId) =>{

        const column = document.createElement('div')
        column.classList.add('column')
        column.id = `column${areaId}`
        
        const columnTitle = document.createElement('textarea')
        columnTitle.innerHTML = "New Column"
        columnTitle.classList.add('edit')
        columnTitle.style.fontSize = '30px'

        columnTitle.onchange = function() { // function whenever title is updated
            const id = column.id.replace('column', '') // grab id and convert from string
            const textToUpdateTo = columnTitle.value
            var xhr = new XMLHttpRequest();
            // update area record with new title
            xhr.open("POST", `http://localhost:3000/api/board/${boardId}/area/${id}/editTitle`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                name: textToUpdateTo
            }));
        }
        

        column.append(columnTitle)
        
        const ul = document.createElement('ul')
        ul.classList.add('connectedSortable')
        column.append(ul)
        
        const plus = document.createElement('img')
        plus.classList.add('plus')
        
        plus.onclick = function() {addTask(areaId)} 

        column.append(plus)
        
        const cross = document.createElement('img')
        cross.classList.add('cross')
        cross.onclick = function(){deleteColumn(boardId, areaId)}
        cross.style.cursor = "pointer"
        column.append(cross)
        
        document.getElementById("addBoard").before(column)


        $( ".connectedSortable, .connectedSortable" ).sortable({
            connectWith: ".connectedSortable",
            dropOnEmpty: true,
            receive: function( event, ui ) {


                const itemId = ui.item["0"].id.replace("task","")
                const oldColumnId = lastParent.id.replace("column","")
                const newColumnId = ui.item["0"].parentNode.parentNode.id.replace("column","")

                ui.item["0"].querySelector(".cross").onclick =  function(){deleteTask("column"+newColumnId, "task"+itemId)}
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
        
    }

    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", `http://localhost:3000/api/board/${id}/area/create`, true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(JSON.stringify({
    //     title: "New Column"
    // }));

    $.ajax({
        type: "POST",
        url: `http://localhost:3000/api/board/${id}/area/create`,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify({
            title: "New Column"
        }),
        success: function(data){
            
            generateColumn(data.areaId)
        },
        contentType: "application/json; charset=utf-8",
    });


    //generateBoard(id)
}

function addTask(columnId) {
    let generateTask = (areaId, taskId) =>{
        const queryColumnId = typeof(columnId) == "number" ? "column"+columnId : columnId;
        
        const task = document.createElement('li')
        task.classList.add('task')
        task.classList.add('ui-sortable-handle')
        task.id = `task${taskId}`
        
        const taskTitle = document.createElement('textarea')
        taskTitle.classList.add('edit')
        taskTitle.style.fontSize = '22px'
        taskTitle.value = "New task"
        
        const taskText = document.createElement('textarea')
        taskText.classList.add('edit')
        taskText.style.fontSize = '14px'
        taskText.value = "Add task description here"
        
        taskTitle.onchange = function() { // function whenever title is updated  
            //const taskId = li.id.replace('task', '') // grab id and convert from string
            const textToUpdateTo = taskTitle.value
            //const areaId = document.getElementById(li.id).parentNode.parentNode.id.replace('column', '')
            // update task title in task record
            var xhr = new XMLHttpRequest();
            xhr.open("POST", `http://localhost:3000/api/board/${boardId}/area/${areaId}/task/${taskId}/editTask`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                title: textToUpdateTo
            }));
        }
        
        taskText.onchange = function() { // function whenever title is updated
            //const taskId = li.id.replace('task', '') // grab id and convert from string
            const textToUpdateTo = taskText.value
            //const areaId = document.getElementById(li.id).parentNode.parentNode.id.replace('column', '')
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

        const taskDeleteBtn = document.createElement("img")

        taskDeleteBtn.classList.add("cross")
        taskDeleteBtn.style.position = "absolute"
        taskDeleteBtn.style.right = "-5px"
        taskDeleteBtn.style.top = "-5px"
        taskDeleteBtn.style.width = "20px"
        taskDeleteBtn.style.height = "20px"

        taskDeleteBtn.onclick =  function(){deleteTask("column"+areaId, "task"+taskId)} 

        task.append(taskDeleteBtn)




        document.getElementById(queryColumnId).querySelector(".connectedSortable").append(task)


        $( ".connectedSortable, .connectedSortable" ).sortable({
            connectWith: ".connectedSortable",
            dropOnEmpty: true,
            receive: function( event, ui ) {


                const itemId = ui.item["0"].id.replace("task","")
                const oldColumnId = lastParent.id.replace("column","")
                const newColumnId = ui.item["0"].parentNode.parentNode.id.replace("column","")

                ui.item["0"].querySelector(".cross").onclick =  function(){deleteTask("column"+newColumnId, "task"+itemId)} 
                
                const sanitizedItemId = itemId.replace("task", "")
                $.ajax({
                    type: "POST",
                    url: `http://localhost:3000/api/board/${boardId}/area/${oldColumnId}/task/${sanitizedItemId }/move`,
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

    }

    
    const areaId = typeof(columnId) == "number" ? columnId : columnId.replace("column", "");

    $.ajax({
        type: "POST",
        url: `http://localhost:3000/api/board/${boardId}/area/${areaId}/task/createTask`,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify({
            title: "New task",
            text: "Add task description here"
        }),
        success: function(data){
            
            generateTask(areaId, data.taskId)
        },
        contentType: "application/json; charset=utf-8",
    });


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


function deleteTask(columnId, taskId){

    const sanitizedColumnId = columnId.replace("column", "")
    const sanitizedTaskId = taskId.replace("task", "")
    $.ajax({
        type: "POST",
        url: `http://localhost:3000/api/board/${boardId}/area/${sanitizedColumnId}/task/${sanitizedTaskId}/delete`,

        data: JSON.stringify({}),
        success: function(){
            document.getElementById(taskId).remove()
        },
        contentType: "application/json; charset=utf-8",
    });
}