import React from 'react'
import Link from 'next/link'
import {List, ListItemButton, ListItemIcon, ListItemText, Button, BadgeTypeMap} from '@mui/material'
import {Assignment as AssignmentIcon} from '@mui/icons-material'
import {useWSNotesList} from './hooks'
import newNote from '../../services/newNote';

interface NotesListProps {
    activeNoteId?: string
}

const NotesList: React.FC<NotesListProps> = ({activeNoteId}) => {
    const {notes} = useWSNotesList();
    const notesList = [];

    try{
        for (const noteId in notes){
            const noteData = notes[noteId].note;
            notes[noteId].note = noteData;
            notesList.push({id: noteId, title: noteData.title});
        }
    }catch(e){
        console.error(new Error('Error iterating data'))
    }

    const handleAddNoteClick = async () => {
        activeNoteId = await newNote();
        console.log('activeNoteId:', activeNoteId);
    };

    console.log(`NoteList activeNoteId: ${activeNoteId}`);

    return (
        <>
            <Button onClick={handleAddNoteClick}>Add Note</Button>
            <List>
                {notesList?.map((note: {id: string, title: string}) => (
                    <Link href={`/notes/${note.id}`} key={note.id}>
                        <ListItemButton selected={note.id === activeNoteId}>
                            <ListItemIcon>
                                <AssignmentIcon/>
                            </ListItemIcon>
                            <ListItemText primary={note.title}/>
                        </ListItemButton>
                    </Link>
                ))}
            </List>
        </>
    );
}

export default NotesList