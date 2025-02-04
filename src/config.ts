import dotenv from 'dotenv';

dotenv.config();

export function config() {
    const apiKey = process.env.TONCENTER_API_KEY
    if (!apiKey) {
        throw new Error("TONCENTER_API_KEY не установлен")
    }
    const mnemonic = process.env.MNEMONIC
    if (!mnemonic) {
        throw new Error("MNEMONIC не установлен")
    }
    return { apiKey, mnemonic }
}
