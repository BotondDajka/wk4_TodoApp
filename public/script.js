const container = document.getElementById('container')

function generateBoard(id) {
    document.getElementById('container').innerHTML = ""
    $.get(`http://localhost:3000/api/board/${id}`, function(data) {
        console.log(data)
        document.getElementById('boardName').value = data.name
        for(let i = 0; i < data.areas.length; i++) {
            const currentArea = data.areas[i]
            const column = document.createElement('div')
            column.classList.add('column')

            const columnTitle = document.createElement('textarea')
            columnTitle.innerHTML = currentArea.title
            columnTitle.classList.add('edit')
            columnTitle.style.fontSize = '30px'
            column.append(columnTitle)

            const ul = document.createElement('ul')
            ul.classList.add('connectedSortable')
            column.append(ul)

            container.append(column)

        
            for(let j = 0; j < data.areas[i].tasks.length; j++) {
                const currentTask = currentArea.tasks[j]
                const li = document.createElement('li')
                li.classList.add('task')

                const taskTitle = document.createElement('textarea')
                taskTitle.classList.add('edit')
                taskTitle.style.fontSize = '22px'
                taskTitle.innerHTML = currentTask.title

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