export function formatResponse(texts: Array<string>, source: string): any {
    return {
        "fulfillment_messages": [
            {
              "text": { "text": texts }
            }
        ],
        "source": source,
        "output_contexts": []
    }
}