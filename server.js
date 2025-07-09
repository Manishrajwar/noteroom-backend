const express = require("express");
const mongoose = require("mongoose");
const { createServer } = require("http");
const { Server } = require("socket.io");
const router = require("./routes/notes");
const Note = require("./models/Note");
const cors = require("cors");
require('dotenv').config();
const app = express();
const httpServer = createServer(app);
app.use(express.json());

let PORT = process.env.PORT || 30001

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use("/api/v1", router);


const dbConnect = require("./db/user_conn");
dbConnect();

// mongoose.connect(process.env.DATABASE_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// });

  

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});


let defaultValue = '';

async function findNote(id) {
  if (id == null) return;

  const notes = await Note.findById(id);
  if (notes) return notes;
  return await Note.create({ _id: id, content: defaultValue });
}


io.on("connection", (socket) => {
  socket.on("get-note", async (noteId) => {
    socket.join(noteId);

    const room = io.sockets.adapter.rooms.get(noteId);
    const numClients = room ? room.size : 0;

    io.to(noteId).emit("user-count", numClients);

    const notes = await findNote(noteId);
    socket.emit("load-note", {content:notes.content , title: notes.title});

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(noteId).emit("receive-changes", delta);
    });

    socket.on("cursor-position", (data) => {
  socket.broadcast.emit("cursor-position", data);
});

    socket.on("save-note", async (content) => {
      await Note.findByIdAndUpdate(noteId, { content });
    });

    socket.on("disconnect", () => {
      const room = io.sockets.adapter.rooms.get(noteId);
      const numClients = room ? room.size : 0;
      io.to(noteId).emit("user-count", numClients);
    });
  });
});



httpServer.listen(PORT, () => {
  console.log(`HTTP & Socket.IO server listening on port ${PORT}`);
});

app.get('/' , (req ,res)=>{
  res.send("Hello users");
})