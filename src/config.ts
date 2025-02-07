import dotenv from 'dotenv';

dotenv.config();

export function config(): { apiKey: string, mnemonic: string[], minBlocksToWait: number, maxBlocksToWait: number } {
    const apiKey = process.env.TONCENTER_API_KEY
    if (!apiKey) {
        throw new Error("TONCENTER_API_KEY не установлен")
    }
    const mnemonic = process.env.MNEMONIC
    if (!mnemonic) {
        throw new Error("MNEMONIC не установлен")
    }
    const minBlocksToWait = process.env.MIN_BLOCKS_TO_WAIT
    if (!minBlocksToWait) {
        throw new Error("MIN_BLOCKS_TO_WAIT не установлен")
    }
    const maxBlocksToWait = process.env.MAX_BLOCKS_TO_WAIT
    if (!maxBlocksToWait) {
        throw new Error("MAX_BLOCKS_TO_WAIT не установлен")
    }

    const minBlocksToWaitNum = Number.parseInt(minBlocksToWait)
    if (isNaN(minBlocksToWaitNum)) {
        throw new Error("MIN_BLOCKS_TO_WAIT должен быть числом")
    }
    const maxBlocksToWaitNum = Number.parseInt(maxBlocksToWait)
    if (isNaN(maxBlocksToWaitNum)) {
        throw new Error("MAX_BLOCKS_TO_WAIT должен быть числом")
    }
    const mnemonicArray = mnemonic.split(" ")
    if (mnemonicArray.length !== 24) {
        throw new Error("MNEMONIC должен содержать 24 слова")
    }
    return { apiKey, mnemonic: mnemonicArray, minBlocksToWait: minBlocksToWaitNum, maxBlocksToWait: maxBlocksToWaitNum }
}
