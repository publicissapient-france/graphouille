export async function updateCollection(words: Array<string>): Promise<Array<string>> {
    console.log(`Dialogflow update : ${words.toString()}`)
    return Promise.resolve(words)
}

export async function deleteCollection(words: Array<string>): Promise<Array<string>> {
    console.log(`Dialogflow delete : ${words.toString()}`)
    return Promise.resolve(words)
}