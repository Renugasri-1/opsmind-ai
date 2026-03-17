function chunkText(text){

    const chunkSize = 1000;
    const overlap = 200;

    const chunks = [];

    for(let i=0;i<text.length;i+=chunkSize-overlap){

        const chunk = text.substring(i, i + chunkSize);

        chunks.push(chunk);
    }

    return chunks;
}

module.exports = chunkText;