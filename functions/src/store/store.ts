import * as firestore from './firestore';
import * as logstore from './logstore';

export class Store {
    private static instance: Store;
    private db: FirebaseFirestore.Firestore;

    private constructor() {
        this.db = firestore.init()
    }

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }

        return Store.instance;
    }

    public updateCollection(words: Array<string>, readonly: boolean): Promise<any> {
        if (readonly) return logstore.updateCollection(words);
        else return firestore.updateCollection(this.db, words);
    }

    public deleteCollection(words: Array<string>, readonly: boolean): Promise<any> {
        if (readonly) return logstore.deleteCollection(words);
        else return firestore.deleteCollection(this.db, words);
    }

    public getWords(number?: number): Promise<any> {
        return firestore.getWords(this.db, number);
    }

}