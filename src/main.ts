import { openWallet } from "./ton";
import { getMiningData, mine } from "./mining";
import { config } from "./config";
import { randomNumber } from "./random";

const minBlocksToWait = 6;
const maxBlocksToWait = 10;

async function main() {
  const wallet = await openWallet(config().mnemonic.split(" "));
  const receiverAddress = wallet.contract.address.toString();
  while (true) {
    try {
      const blocksToWait = randomNumber(minBlocksToWait, maxBlocksToWait);

      const data = await getMiningData();
      const lastBlockTime = Number(data.lastBlockTimestamp);

      const timeDifferenceMinutes = (Date.now() / 1000 - lastBlockTime) / 60;

      const minutesToWait = blocksToWait * 10;
      if (timeDifferenceMinutes >= minutesToWait) {
        console.log(`Прошли необходимые ${timeDifferenceMinutes} минут с последнего блока. Майним!`);
        await mine(wallet, receiverAddress);
      } else {
        console.log(`Прошло ${Math.floor(timeDifferenceMinutes)} минут с последнего блока.`);
      }

      // Ждём ровно 10 минут после времени последнего блока
      const tenMinutesInMs = 10 * 60 * 1000;
      const nextCheckTime = (lastBlockTime * 1000) + tenMinutesInMs;
      const currentTime = Date.now();
      const waitTime = Math.abs(nextCheckTime - currentTime);

      console.log(`Следующая проверка через ${Math.floor(waitTime / 1000)} секунд`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    } catch (error) {
      console.error('Произошла ошибка:', error);
      // Ждём 1 минуту перед повторной попыткой в случае ошибки
      await new Promise(resolve => setTimeout(resolve, 60 * 1000));
    }
  }
}

main().catch(console.error);