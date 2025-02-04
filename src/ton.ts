
import { KeyPair, mnemonicToPrivateKey } from "@ton/crypto"
import { OpenedContract, TonClient, WalletContractV4 } from "@ton/ton"
import { config } from "./config"

export const tonClient = new TonClient({
    endpoint: `https://toncenter.com/api/v2/jsonRPC`,
    apiKey: config().apiKey,
})

export type OpenedWallet = {
    contract: OpenedContract<WalletContractV4>
    keyPair: KeyPair
}

export async function openWallet(mnemonic: string[]): Promise<OpenedWallet> {
    const keyPair = await mnemonicToPrivateKey(mnemonic)

    const wallet = WalletContractV4.create({
        workchain: 0,
        publicKey: keyPair.publicKey,
    })

    const contract = tonClient.open(wallet)
    return { contract, keyPair }
}
