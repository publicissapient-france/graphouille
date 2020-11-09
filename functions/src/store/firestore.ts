import * as adm from 'firebase-admin';
import * as functions from 'firebase-functions';

function document(db: adm.firestore.Firestore): FirebaseFirestore.DocumentReference<any> {
    return db.collection('dialogflow').doc('graphouille');
}

function setCollection(db: adm.firestore.Firestore, words: any): Promise<adm.firestore.WriteResult> {
    return document(db).set(words, { merge: false });
}

function randomWord(words: Array<string>): string {
    return words[Math.floor(Math.random() * words.length)];
}

export function init(): adm.firestore.Firestore {
    adm.initializeApp(functions.config().firebase);
    const db = adm.firestore();
    const initialwords = require('./words.json');

    setCollection(db, initialwords)
        .then(doc => {
            console.log(`Dialogflow collection : ${JSON.stringify(doc)}`);
        })
        .catch( err => {
            console.log(`Error init to Firestore: ${err}`);
        })

    return db;
}

export async function updateCollection(db: adm.firestore.Firestore, words: Array<string>): Promise<adm.firestore.WriteResult> {
    return document(db)
        .update({ words: adm.firestore.FieldValue.arrayUnion(...words) })
}

export async function deleteCollection(db: adm.firestore.Firestore, words: Array<string>): Promise<adm.firestore.WriteResult> {
    return document(db)
        .update({ words: adm.firestore.FieldValue.arrayRemove(...words) })
}

export async function getWords(db: adm.firestore.Firestore, number?: number): Promise<string[]> {
    return document(db).get()
        .then( doc => {
            if (doc.exists) {
                const allWords = doc.data().words
                if(number) { 
                    return Array.from({length: number}, () => randomWord(allWords));
                }
                else return allWords;
            }
            else return [];
        })
        .catch( err => {
            console.log(`Error fetching to Firestore: ${err}`);
            return [];
        });
}
