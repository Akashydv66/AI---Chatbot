require('dotenv').config();
const app = require('./src/app')
const { createServer } = require("http");
const { Server } = require("socket.io");

const generateResponse = require('./src/services/ai.service')
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors:{
    origin:"http://localhost:5173",
  }
 });

const chatHistory = [
  {
    role:"user",
     parts: [{ text: 'Who was the PM of India in 1984?' }]
  },
  {
    role:"model",
    parts:[
      {
         text:"Indira Gandhi was the Prime Minister of India in 1984. She served until her assassination on October 31, 1984. After her death, her son, Rajiv Gandhi, became the Prime Minister."
      },
    ],
  }
]


io.on("connection", (socket) => {
  console.log("A user connected")

socket.on("disconnect", (socket) => {
  console.log("A user disconnected")

})
socket.on("ai-message", async(data)=>{
     
     console.log("Received AI message:", data.prompt); 
     chatHistory.push({
      role:"user",
      parts:[{text: data.prompt}]
     })
    const response = await generateResponse(chatHistory);

    chatHistory.push({
      role:"model",
      parts:[{text:response}]
    })

    console.log("Ai Response", response);
    socket.emit("ai-message-response", {response})
})

});
httpServer.listen(3000, ()=>{
  console.log("Server is running on port 3000")
});

