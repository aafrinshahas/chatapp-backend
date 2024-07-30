let users = [];

const addUser = ({id, name, room, date}) => {

name = name.trim()?.toLowerCase();
room = room.trim()?.toLowerCase();
date = new Date().toLocaleString()
if(!name || !room){
return {
error: "name and room is requried"
}
}


if(users.length){
const existingUser = users.find(each => each.name === name && each.room === room)
if(existingUser){
return {
error: "user already exist"
}
}
}

const user = {id, name, room, date}
// console.log(user)
users.push(user)

return { user }
}

const removeUser = (id) => {
const findId = users.findIndex(each => each.id == id);
if(findId >= 0){
return users.splice(findId,1)[0]
}

}


const getUser = (id) => {
return users.find(each => each.id == id);
}

const getRoomUsers = (room) => {
return users.filter(e => e.room === room)
}

module.exports = {
addUser,
getUser,
removeUser,
getRoomUsers
}