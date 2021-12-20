import express from 'express'
import cors from 'cors'
import expressWs from 'express-ws'
import admin from './firebase';
import apiRoutes from './routes'


const app = express()
const PORT = 3001
const ws = expressWs(app);
const aWss = ws.getWss();

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

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})


