import express, {RequestHandler, Response} from 'express'
import {WebsocketRequestHandler} from 'express-ws'
import {Descendant} from 'slate'
import admin from '../firebase';

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

export interface NoteResponse {
    id: string
    title: string
    content: Array<Descendant>
}

let notes:any = {};//todo: define type
const noteList: any = [];//todo: define type

const db = admin.database();
const ref = db.ref('notes');
ref.on('value', (snapshot) => {
    console.log('data read in notes route');
    notes = snapshot.val();
    console.log(notes);
    Object.keys(notes).forEach((noteId) => {
        const noteData = JSON.parse(notes[noteId].note);
        notes[noteId].note = noteData;
        noteList.push({id: noteId, title: noteData.title});
    });
    console.dir(notes);
}, (err) => {
    console.log('Read failed:', err.name);
});

const notesHandler: RequestHandler = (_req, res: Response<NotesResponse>) => {
    res.json({
        notes: noteList
        // notes: [
        //     {
        //         id: NOTE_1.id,
        //         title: NOTE_1.title
        //     }, {
        //         id: NOTE_2.id,
        //         title: NOTE_2.title
        //     }
        // ]
    })
}

const storeNote = (noteId: string, note: any, ws: any) => {
    const ref = db.ref('notes');
    try {
        const noteRef = ref.child(noteId);
        noteRef.set({
            note
        }, (err) => {
            if (err) {
                console.log('error saving data');
            } else {
                //broadcast note changes
                console.log('storeNote-try-success');
                ws.send(note);
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
                //broadcast note changes
                ws.send(note);
            }
        });
    }
}

const noteHandler: WebsocketRequestHandler = (ws, req) => {
    ws.on('message', (message) => {
        console.log('websocket message received: ' + req.params.id);
        const msg = message.toString();

        //console.log(msg);
        //const dbRules = await db.getRules();
        //console.log('dbRules:',dbRules);
        if (msg) {
            console.log(msg);
            storeNote(req.params.id, msg, ws);
            //ws.send(msg);
        }
        if(req.params.id !== undefined){//block appears to execute even when undefined
            try{
                ws.send(JSON.stringify(notes[req.params.id].note));
                console.log('Not undefined');

            }catch(e){
                console.error(e);
            }

        }
        // switch (req.params.id) {
        //     case NOTE_1.id: {
        //         return ws.send(JSON.stringify(NOTE_1))
        //     }
        //     case NOTE_2.id: {
        //         return ws.send(JSON.stringify(NOTE_2))
        //     }
        // }

    })
}

router.get('/', notesHandler)
router.ws('/:id', noteHandler)

export default router