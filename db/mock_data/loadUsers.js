const fs = require('fs')
const { User } = require('../../Models/User')

fs.readFile('./db/mock_data/user.json', (err, data) => {
    if(err) {
        throw new Error(err)
    }
    const parsedData = JSON.parse(data)
    loadUsers(parsedData)
})

async function loadUsers(data) {
    for(let i = 0; i < data.length; i++) {
        const currentUser = data[i]
        if(!currentUser.displayname) {
            await User.create({username: currentUser.username, displayName: currentUser.username, imageLink: currentUser.image, password: currentUser.password, teamIdAssignedTo: currentUser.teams})    
        } else {
            await User.create({username: currentUser.username, displayName: currentUser.displayname, imageLink: currentUser.image, password: currentUser.password, teamIdAssignedTo: currentUser.teams})
        }
    }
}