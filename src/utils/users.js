const users = []
//add user is use to track the new user
//removeuser is use to stop tracking the user
//getuser is used to fetch the current user data
//getuserinroom is allow us to get the completee user data in the exixting user and render the user list in the side bar
const addUser = ({id,username,Room})=>{
    //Clean the data
    username = username.trim().toUpperCase()
    Room = Room.trim().toUpperCase()
    //validate the data
    if(!username || !Room){
        return{
            error:'username and Room are required'
        }
    }
    //Check for existing user
    const existingUser = users.find((user)=>{
        return user.Room === Room && user.username === username
    })
    //validate the username
    if(existingUser){
        return{
            error:'Username already Exist'
        }
    }
    //Store the user
    const user = {id,username,Room}
    users.push(user)
    return {user}
}
const removeUser = (id)=>{
    //firstly find the index ,-1 for no match or  0,1 for a match
    const index = users.findIndex((user)=>{
        return user.id === id

    })
    if(index !== -1){
        //splice is used to remove the user and (index is used to remove the index position),1 is used for deleteing the 1 item and return the [0] array 
        return users.splice(index , 1)[0]
    }

}
const getUser = (id) => {
    return users.find((user) => user.id === id)
}
const getUsersInRoom = (Room) => {
    Room = Room.trim().toUpperCase()
    return users.filter((user) => user.Room === Room)
}
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// addUser({
//     id:455,
//     username:'Tushar',
//     Room:'twst'
// })
// addUser({
//     id:856,
//     username:'Tushar',
//     Room:'jest'

// })
// addUser({
//     id:123,
//     username:'Jis',
//     Room:'heo'
// })
// const user = getUser(123)
// console.log(user)
// const userlist = getUsersInRoom('jest')
// console.log(userlist) 
// // module.exports ={
//     addUser,

// }
// console.log(users)

// const userlist = getUsersInRoom('twst')
// console.log(userlist)

// console.log(users)
//For removed User
// const removedUser = removeUser(455)
// console.log(removedUser)
// console.log(users)
