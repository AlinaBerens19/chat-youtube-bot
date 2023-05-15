import { unlink } from 'fs/promises';

export async function removeFile(path) {
    try {
        await unlink(path)
    }
    catch (e) {
        console.log(`Error while removing file: ${e}`)
    }
}

export async function removeInputFile(path) {
    const extension = path.split('.').pop();
    if (extension !== 'ogg') return;
    try {
        await unlink(path)
    }
    catch (e) {
        console.log(`Error while removing file: ${e}`)
    }
}