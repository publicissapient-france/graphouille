import * as firestore from './firestore';
import * as logstore from './logstore';

const db = firestore.init()

export function updateCollection(words: Array<string>, readonly: boolean): Promise<any> {
    if(readonly) return logstore.updateCollection(words);
    else return firestore.updateCollection(db, words);
}

export function deleteCollection(words: Array<string>, readonly: boolean): Promise<any> {
    if(readonly) return logstore.deleteCollection(words);
    else return firestore.deleteCollection(db, words);
}

export function getWords(number?: number): Promise<any> {
    return firestore.getWords(db, number);
}