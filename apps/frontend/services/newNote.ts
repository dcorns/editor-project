/**
 * newNote
 * Created by dcorns on 12/28/21
 * Copyright © 2021 Dale Corns
 */

const newNote = async (): Promise<string> => {
    console.log('services/newNote');
    const res = await fetch('http://localhost:3001/api/notes/newnote');
    if (res.ok){
        const result = await res.json();
        return result.id;
    }
    else return '';
}
export default newNote;