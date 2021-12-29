import express, {RequestHandler, Response} from 'express'
import {WebsocketRequestHandler} from 'express-ws'
import {Descendant} from 'slate'
import admin from '../firebase';
import getGuid from '../getGuid';

// Patch `express.Router` to support `.ws()` without needing to pass around a `ws`-ified app.
// https://github.com/HenningM/express-ws/issues/86
// eslint-disable-next-line @typescript-eslint/no-var-requires
const patch = require('express-ws/lib/add-ws-method')
patch.default(express.Router)

const router = express.Router()

export interface NotesResponse {
    notes: Array<{
        id: string
        title: string
    }>
}

export interface NewNoteResponse {
    id: string
}


export interface NoteResponse {
    id: string
    title: string
    content: Array<Descendant>
}

let notes:any = {};//todo: define type

const db = admin.database();
const ref = db.ref('notes');
ref.on('value', (snapshot) => {
    console.log('Data Read in notes.ts');
    notes = snapshot.val();
    console.log('db.ref.on snapshot data:');
    console.dir(notes);
 }, (err) => {
    console.log('Read failed:', err.name);
});

// const notesHandler: RequestHandler = (_req, res: Response<NotesResponse>) => {
//     res.json({
//         notes: noteList
//     })
// }
const notesWSHandler: WebsocketRequestHandler = (ws, req) => {
    console.log('notesWSHandler');
    ws.on('message', (message) =>{
        const msg = message.toString();
        console.log('notesWSHandler on message: ', msg);
        if(msg === 'getNotes'){
            ws.send(JSON.stringify(notes));
        }
    })
}

const storeNote = (noteId: string, note: any, ws?: any) => {
    console.log('Storing Note:', noteId);
    const ref = db.ref('notes');
    try {
        const noteRef = ref.child(noteId);
        noteRef.set({
            note
        }, (err) => {
            if (err) {
                console.log('error saving data');
            } else {
                console.log('storeNote-try-success');
                if (ws) ws.send(JSON.stringify(note));
            }
        });
    } catch (e) {
        console.error(e);
        ref.set({
            id: noteId,
            note
        }, (err) => {
            if (err) {
                console.log('error saving data');
            } else {
                if(ws) ws.send(note);
            }
        });
    }
}

const noteHandler: WebsocketRequestHandler = (ws, req) => {
    ws.on('message', (message) => {
        const msg = message.toString();
        const id = req.params.id;
        let data:any; //todo: fix type
        console.log('id:',id);
        console.log('msg',msg);
        if(msg.length > 1){
            data = JSON.parse(msg);
        }

        if (data) {
            console.dir(data);
            storeNote(id, data, ws);
        }
        if(id !== undefined){//block appears to execute even when undefined
            try{
                ws.send(JSON.stringify(notes[id].note));
            }catch(e){
                console.error('Executing on undefined req.params.id: ', id);
            }

        }
    })
}

const newNoteHandler: RequestHandler = (_req, res: Response<NewNoteResponse>) =>{
    console.log('routes/notes/newNoteHandler');
    const id = getGuid(Date.now().toString(), 'SecretSanta');
    const note = {title: 'New Note', content:[{children:[{text: 'Enter note', italic:true}], type: 'paragraph'}]};
    storeNote(id, note);
    res.json({
        id
    })
}
router.get('/newnote', newNoteHandler);
//router.get('/', notesHandler)
router.ws('/:id', noteHandler)
router.ws('/', notesWSHandler);
export default router