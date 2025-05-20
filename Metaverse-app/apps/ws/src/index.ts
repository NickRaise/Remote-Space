import { WebSocketServer } from 'ws';
import { User } from './User';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws) {
  console.log("User connected")
  let user: User = new User(ws)
  user.initHandlers()

  ws.on('error', console.error);

  ws.on("close", function () {
    user.destroy()
  })

});