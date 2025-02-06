import { beginCell, Address, toNano, internal } from "@ton/ton";
import { OpenedWallet, tonClient } from "./ton";
import { Logger } from "./logger";

export async function getMiningData() {
    try {
        const satoshiAddress = Address.parse("EQCkdx5PSWjj-Bt0X-DRCfNev6ra1NVv9qqcu-W2-SaToSHI");
        const { stack } = await tonClient.runMethod(satoshiAddress, "get_mining_data");
        const blockNumber = stack.readBigNumber();
        const lastBlockTimestamp = stack.readBigNumber();
        const miningAttempts = stack.readBigNumber();
        const reward = stack.readBigNumber();
        const probability = stack.readBigNumber();
        return { blockNumber, lastBlockTimestamp, miningAttempts, reward, probability };
    } catch (error) {
        Logger.error("Ошибка при получении майнинговых данных:", error);
    }
}

export async function mine(wallet: OpenedWallet, receiverAddress: string) {
    const contractAddress = "EQCkdx5PSWjj-Bt0X-DRCfNev6ra1NVv9qqcu-W2-SaToSHI";
    const contract = Address.parse(contractAddress);

    const messageBody = beginCell()
        .storeUint(0xE9B94603, 32)
        .storeAddress(Address.parse(receiverAddress))
        .endCell();

    const result = await wallet.contract.sendTransfer({
        secretKey: wallet.keyPair.secretKey,
        seqno: await wallet.contract.getSeqno(),
        messages: [
            internal({
                to: contract,
                value: toNano("0.06"),
                bounce: false,
                body: messageBody
            })
        ]
    });

    Logger.log("Транзакция отправлена:", result);
    return result;
}
