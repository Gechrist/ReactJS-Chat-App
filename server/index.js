const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const router = require ('./router.js');
const {addUser,getGroupUsers, getUser, removeUser, addMessage, getMessages} = require ('./helpers/usermethods.js');

io.on("connection", (socket) => {console.log("New connection established");
                              socket.on('connected', ({name, group}, callback) => {
                              const {error,user} = addUser ({id:socket.id, name, group});
                              const users = getGroupUsers(group);
                              const messages = getMessages(group);
                              //callback possible duplicate username error
                              if (error) {return callback(error)}
                              callback(error);
                              socket.join(group);
                              //emit group users
                              const username = user.username;
                              io.to(group).emit('users', users);
                              //emit socket user to socket
                              io.to(socket.id).emit('socketUser', username);
                              // emit new group user for notification
                              socket.to(group).emit('newUser', username);
                              //emit group messages to new user if there are any
                              if (messages) {io.to(socket.id).emit('groupMessages', messages )};
                              });


                              socket.on('typing', ({socketUser, group}) =>
                              {if (!getUser(socket.id)) {return};
                              socket.to(group).emit('typingEvent', socketUser)});


                              socket.on ('newMessage',({group, socketUser, message}) =>
                              {if (!getUser(socket.id)) {return};
                              addMessage({socketUser, message, group});
                              const messages = getMessages(group);
                              io.to(group).emit('newMessageEvent', messages)});


                              socket.on('disconnect', () => {console.log('disconnected');
                              //make sure that the user is removed only once
                              if (!getUser(socket.id)) {return};
                              const {username, group} = getUser(socket.id);
                              removeUser(socket.id);
                              // emit user left notification
                              socket.to(`${group}`).emit('userLeft', `${username}`);
                              const users = getGroupUsers(`${group}`);
                              // update group users
                              socket.to(`${group}`).emit('users', users)});
                              });
app.use (router);
httpServer.listen(8080, () => {console.log("Server started at port 8080");});
