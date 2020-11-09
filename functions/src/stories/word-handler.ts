import * as store from '../store/store';

function getEntity(requestBody: any, name: string): any {
    return requestBody.queryResult.parameters[name]
}

function getSource(requestBody: any): any {
    return requestBody.body.originalDetectIntentRequest.source
}

function isNotEmpty(array: any): boolean {
    return Array.isArray(array) && array.length > 0;
}

export async function addWord(request: any): Promise<string> {
    const words: Array<string> = getEntity(request, "any")
    const readonly: boolean = getSource(request) == "DIALOGFLOW_CONSOLE" ? true : false

    if (isNotEmpty(words)) {
        return store.updateCollection(words.map(w => w.toLowerCase()), readonly)
            .then(() => {
                return `Bien, j'ajoute ${words.toString()}`;
            })
            .catch(err => {
                console.log(`Error writing to Firestore: ${err}`);
                return `Désolé, je ne peux pas apprendre ces mots maintenant. Réessaie plus tard !`;
            });
    }
    else {
        return Promise.resolve(`Je n'ai pas compris les mots à apprendre`);
    }
}

export async function deleteWord(request: any): Promise<string> {
    const words: Array<string> = getEntity(request, "any")
    const readonly: boolean = getSource(request) == "DIALOGFLOW_CONSOLE" ? true : false

    if (isNotEmpty(words)) {
        return store.deleteCollection(words.map(w => w.toLowerCase()), readonly)
            .then(() => {
                return `Bien, j'oublie ${words.toString()}`;
            })
            .catch(err => {
                console.log(`Error writing to Firestore: ${err}`);
                return `Désolé, je ne peux pas oublier ces mots maintenant. Réessaie plus tard !`;
            });
    }
    else {
        return Promise.resolve(`Je n'ai pas compris les mots à oublier`);
    }
}

export async function searchWord(request: any): Promise<string> {
    const words: Array<string> = getEntity(request, "any")

    if (isNotEmpty(words)) {
        return store.getWords()
            .then(found => {
                const word = words[0].toLowerCase()
                if (found.includes(word)) return `Je connais le mot ${word} !`
                else return `Je ne connais pas le mot ${word}...`
            });
    }
    else {
        return Promise.resolve(`Je n'ai pas compris le mot à chercher`);
    }
}

export async function askWord(request: any): Promise<string> {
    const number: number = getEntity(request, "number")
    const numberOfWords = (!number) ? 1 : number

    return store.getWords(numberOfWords)
        .then(words => {
            if(isNotEmpty(words)) {
                return `Voilà ce que je te propose de dessiner : ${words.toString()}`
            }
            else {
                return `Je n'ai pas de mots à te donner pour l'instant. Réessaie plus tard !`;
            }
        });
}