import React from 'react'
import { Editor } from '../editor'
import { useNote } from './hooks'
import { ReadyState } from 'react-use-websocket'
import { Paper, TextField, Badge, BadgeTypeMap } from '@mui/material'

interface SingleNoteProps {
  id: string
}

const Home: React.FC<SingleNoteProps> = ({ id }) => {
    const { note, readyState, sendJsonMessage} = useNote(id);
    let nt = note;
    console.log('SingleNote-note:');

    if(note && note[id]){
        console.log(`full list received:`);
        console.dir(note[id].note);
        nt = note[id].note;
    }

  const connectionStatusColor = {
    [ReadyState.CONNECTING]: 'info',
    [ReadyState.OPEN]: 'success',
    [ReadyState.CLOSING]: 'warning',
    [ReadyState.CLOSED]: 'error',
    [ReadyState.UNINSTANTIATED]: 'error',
  }[readyState] as BadgeTypeMap['props']['color']

    const onTitleChange = (e: any) => { //todo: add correct type
        sendJsonMessage({title:e.target.value, content:nt.content});
    }

  return (note) ? (
    <>
        <h1>{nt.content[0].children[0].text}</h1>
      <Badge color={connectionStatusColor} variant="dot" sx={{ width: '100%' }}>
        <TextField
          value={nt.title}
          variant="standard"
          fullWidth={true}
          inputProps={{ style: { fontSize: 32, color: '#666' } }}
          sx={{ mb: 2 }}
          onChange={onTitleChange}
        />
      </Badge>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Editor initialValue={nt.content} title={nt.title} sendJsonMessage={sendJsonMessage}/>
      </Paper>
    </>
   ) : null
}

export default Home