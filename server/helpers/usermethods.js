const users = [];
const messages = [{}];

// user methods
const addUser = ({id, name, group}) => {
  //find if user name is taken and if not add the new user to users

   const existingUser = users.find((user) => user.group === group && user.username === name);
   if (existingUser) {return {error:'This username is already in use in this group'}};

   const user = {id:id, username:name, group:group};
   users.push(user);
   //console.log(user);
   return {user};
}

const removeUser = (id) => {
  //find user index in array
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1 ){
    users.splice(index, 1);
    }
}

const getUser = (id) => {
  // find and return user
return (users.find((user) => user.id === id));
}

const getGroupUsers = (group) => {
  //get all users in this group
  return (users.filter((user) => user.group === group));
}

// message methods
const addMessage = ({socketUser, message, group}) =>{
  //add message to message array
  const addedMessage = {sender:socketUser, message, group};
  messages.push(addedMessage);
}

const getMessages = (group) => {
  // get all group setMessages
  return (messages.filter((message) => message.group === group));
}

module.exports = {addUser, removeUser, getUser, getGroupUsers, addMessage, getMessages};
