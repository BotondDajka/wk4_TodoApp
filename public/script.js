const container = document.getElementById('container')
let boardId = null;

// generate board when board is selected from navbar
function generateBoard(id) {
    document.getElementById('container').innerHTML = ""
    const boardId = id;
    $.get(`http://localhost:3000/api/board/${id}`, function(data) {
        document.getElementById('boardName').value = data.name
        const boardTitle = document.getElementById('boardName')
        boardTitle.value = data.name
        boardTitle.onchange = function() { // function whenever title is updated
            const textToUpdateTo = boardTitle.value
            var xhr = new XMLHttpRequest();
            xhr.open("POST", `http://localhost:3000/api/board/${boardId}/editTitle`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                boardTitle: textToUpdateTo
            }));
            document.getElementById(`dropdown${boardId}`).innerText = textToUpdateTo
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
                var xhr = new XMLHttpRequest();
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
            column.append(plus)

            const cross = document.createElement('img')
            cross.classList.add('cross')
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
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", `http://localhost:3000/api/board/${boardId}/area/${areaId}/task/${taskId}/editTask`, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({
                        title: textToUpdateTo
                    }));
                }

                const taskText = document.createElement('textarea')
                taskText.classList.add('edit')
                taskText.style.fontSize = '14px'
                taskText.innerHTML = currentTask.text
                taskText.onchange = function() { // function whenever title is updated
                    const taskId = li.id.replace('task', '') // grab id and convert from string
                    const textToUpdateTo = taskText.value
                    const areaId = document.getElementById(li.id).parentNode.parentNode.id.replace('column', '')
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", `http://localhost:3000/api/board/${boardId}/area/${areaId}/task/${taskId}/editTask`, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({
                        text: textToUpdateTo
                    }));
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
}

function displayNewBoardForm() {
    const form = document.querySelector('#new-board-form')
    form.style.display === "none" ? form.style.display = "block" : form.style.display = "none"
}