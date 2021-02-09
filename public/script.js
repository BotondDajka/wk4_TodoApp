const container = document.getElementById('container')

// generate board when board is selected from navbar
function generateBoard(id) {
    document.getElementById('container').innerHTML = ""
    const boardId = id;
    $.get(`http://localhost:3000/api/board/${id}`, function(data) {
        // console.log(data)
        document.getElementById('boardName').value = data.name
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
                    const areaId = document.getElementById(li.id).parentNode.parentNode.id
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", `http://localhost:3000/api/board/${boardId}/area/${areaId}/task/${taskId}/editTask`, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({
                        name: textToUpdateTo
                    }));
                }

                const taskText = document.createElement('textarea')
                taskText.classList.add('edit')
                taskText.style.fontSize = '14px'
                taskText.innerHTML = currentTask.text

                const avatar = document.createElement('img')
                avatar.src = 'https://www.w3schools.com/howto/img_avatar.png'
                avatar.classList.add('avatar')

                li.append(taskTitle)
                li.append(taskText)
                li.append(avatar)

                ul.append(li)
            }
        }
        $( function() {
            $( ".connectedSortable, .connectedSortable" ).sortable({
              connectWith: ".connectedSortable",
              dropOnEmpty: true
            }).disableSelection();
          } );

          $(".edit").on("keydown keyup click", function(){
            this.style.height = "1px";
            this.style.height = (this.scrollHeight) + "px"; 
        });
    })
}