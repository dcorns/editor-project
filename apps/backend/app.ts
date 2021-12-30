import express from 'express'
import cors from 'cors'
import expressWs from 'express-ws'
import admin from './firebase';
import apiRoutes from './routes'


const app = express()
const PORT = 3001
const ws = expressWs(app);
const aWss = ws.getWss();

//Send updated notes to all sockets on database change
const db = admin.database();
const ref = db.ref('notes');
ref.on('value', (snapshot) => {
  console.log('Data Read in app.ts');
  console.log(snapshot.val());
  aWss.clients.forEach((client) => {
    client.send(JSON.stringify(snapshot.val()));
  })
}, (err) => {
  console.log('Read failed:', err.name);
});

//Future possibility of having more granular identification of change in db
// ref.on('child_changed', (snapshot) => {
//   //console.log(`app-db-child-changed-parent-key:`, snapshot.ref.parent.key);
//   console.dir(snapshot.val());
// });

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})


