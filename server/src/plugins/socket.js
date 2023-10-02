import { Server } from 'socket.io';
import { leaveRoom } from '@/utils';

export const setupSocket = (server) => {
  const CHAT_BOT = 'ChatBot';
  let chatRoom = ''; // E.g. javascript, node,...
  let allUsers = []; // All users in current chat room

  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:4001',
      methods: ['GET', 'POST'],
    },
  });

  // Listen for when the client connects via socket.io-client
  io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    // Add a user to a room
    socket.on('join_room', (data) => {
      const { username, room } = data; // Data sent from client when join_room event emitted
      socket.join(room); // Join the user to a socket room

      let __createdtime__ = Date.now(); // Current timestamp
      // Send message to all users currently in the room, apart from the user that just joined
      socket.to(room).emit('receive_message', {
        message: `${username} has joined the chat room`,
        username: CHAT_BOT,
        __createdtime__,
      });

      // Send welcome msg to user that just joined chat only
      socket.emit('receive_message', {
        message: `Welcome ${username}`,
        username: CHAT_BOT,
        __createdtime__,
      });

      // Save the new user to the room
      chatRoom = room;
      allUsers.push({ id: socket.id, username, room });
      const chatRoomUsers = allUsers.filter((user) => user.room === room);
      socket.to(room).emit('chatroom_users', chatRoomUsers);
      socket.emit('chatroom_users', chatRoomUsers);

      socket.on('send_message', (data) => {
        const { message, username, room, __createdtime__ } = data;
        io.in(room).emit('receive_message', data); // Send to all users in room, including sender
      });
    });

    socket.on('leave_room', (data) => {
      const { username, room } = data;
      socket.leave(room);
      const __createdtime__ = Date.now();
      // Remove user from memory
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(room).emit('chatroom_users', allUsers);
      socket.to(room).emit('receive_message', {
        username: CHAT_BOT,
        message: `${username} has left the chat`,
        __createdtime__,
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from the chat');
      const user = allUsers.find((user) => user.id == socket.id);
      if (user?.username) {
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(chatRoom).emit('chatroom_users', allUsers);
        socket.to(chatRoom).emit('receive_message', {
          message: `${user.username} has disconnected from the chat.`,
        });
      }
    });
  });
};

export const setupSocketV2 = (server) => {
  const socketIO = new Server(server, {
    cors: {
      origin: 'http://localhost:4002',
      methods: ['GET', 'POST'],
    },
  });

  let users = [];

  socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('message', (data) => {
      socketIO.emit('messageResponse', data);
    });

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

    socket.on('newUser', (data) => {
      users.push(data);
      socketIO.emit('newUserResponse', users);
    });

    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
      users = users.filter((user) => user.socketID !== socket.id);
      socketIO.emit('newUserResponse', users);
      socket.disconnect();
    });
  });
};
