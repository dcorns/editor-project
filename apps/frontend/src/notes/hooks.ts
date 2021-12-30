/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect } from 'react'
import {NoteResponse} from '../../../backend/routes/notes'
import useWebSocket, { ReadyState } from 'react-use-websocket'

// const fetcher = async (
//   input: RequestInfo,
//   init: RequestInit
// ) => {
//   const res = await fetch(input, init);
//   return res.json();
// }
//
// export const useNotesList = () => {
//   const { data, error } = useSWR<NotesResponse>('http://localhost:3001/api/notes', fetcher, {})
//   return {
//     notesList: data?.notes,
//     isLoading: !error && !data,
//     isError: error,
//   }
// }

export const useWSNotesList = () => {
  const { readyState, lastMessage, sendMessage, sendJsonMessage, lastJsonMessage } = useWebSocket(`ws://localhost:3001/api/notes/`);
  useEffect(() => {
    if (readyState === ReadyState.OPEN && lastMessage === null) {
      sendMessage('getNotes');
    }
  }, [readyState, lastMessage])

  return {
    notes: lastMessage && JSON.parse(lastMessage.data),
    readyState,
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage
  }
}

export const useNote = (id: string) => {
  console.log('useNote id:', id);
  const { readyState, lastMessage, sendMessage, sendJsonMessage, lastJsonMessage } = useWebSocket(`ws://localhost:3001/api/notes/${id}`);
  // Send a message when ready on first load
  useEffect(() => {
    if (readyState === ReadyState.OPEN && lastMessage === null) {
      sendMessage('');
    }else if(ReadyState.OPEN && lastMessage !== null){
      console.log(`lastMessage.data: ${lastMessage.data}`);
    }
  }, [readyState, lastMessage])

  return {
    note: lastMessage && JSON.parse(lastMessage.data) as NoteResponse | any,//todo: set type any to new type for all notes data
    readyState,
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage
  }
}