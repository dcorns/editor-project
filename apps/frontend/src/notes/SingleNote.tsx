import React, {useState} from 'react'
import { Editor } from '../editor'
import { useNote } from './hooks'
import { ReadyState } from 'react-use-websocket'

import { Paper, TextField, Badge, BadgeTypeMap } from '@mui/material'

interface SingleNoteProps {
  id: string
}

const onMessage = (msg: any) => {
    //console.log(msg);
};

const Home: React.FC<SingleNoteProps> = ({ id }) => {
    console.log('SingleNote Executing');
    const { note, readyState, sendJsonMessage} = useNote(id, onMessage);
  const connectionStatusColor = {
    [ReadyState.CONNECTING]: 'info',
    [ReadyState.OPEN]: 'success',
    [ReadyState.CLOSING]: 'warning',
    [ReadyState.CLOSED]: 'error',
    [ReadyState.UNINSTANTIATED]: 'error',
  }[readyState] as BadgeTypeMap['props']['color']

  return note ? (
    <>
      <Badge color={connectionStatusColor} variant="dot" sx={{ width: '100%' }}>
        <TextField
          value={note.title}
          variant="standard"
          fullWidth={true}
          inputProps={{ style: { fontSize: 32, color: '#666' } }}
          sx={{ mb: 2 }}
        />
      </Badge>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Editor initialValue={note.content} title={note.title} sendJsonMessage={sendJsonMessage} />
      </Paper>
    </>
  ) : null
}

export default Home