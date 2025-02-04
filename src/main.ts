import { openWallet } from "./ton";
import { getMiningData, mine } from "./mining";
import { config } from "./config";
import { randomNumber } from "./random";

const minBlocksToWait = 3;
const maxBlocksToWait = 15;

async function main() {
  const wallet = await openWallet(config().mnemonic.split(" "));
  const receiverAddress = wallet.contract.address.toString();

  while (true) {
    try {
      const blocksToWait = randomNumber(minBlocksToWait, maxBlocksToWait);
      const data = await getMiningData();
      const lastBlockTime = Number(data.lastBlockTimestamp);
      const currentTime = Date.now() / 1000;
      const timeDifferenceMinutes = (currentTime - lastBlockTime) / 60;
      const minutesToWait = blocksToWait * 10;

      if (timeDifferenceMinutes >= minutesToWait) {
        console.log(`Прошли необходимые ${Math.floor(timeDifferenceMinutes)} минут с последнего блока. Майним!`);
        await mine(wallet, receiverAddress);
      } else {
        console.log(`Прошло ${Math.floor(timeDifferenceMinutes)} минут с последнего блока.`);
      }

      const tenMinutesInSeconds = 10 * 60;
      const timePassedSinceLastBlock = currentTime - lastBlockTime;
      const timeToNextCheck = tenMinutesInSeconds - (timePassedSinceLastBlock % tenMinutesInSeconds);

      if (timeToNextCheck < 0) {
        throw new Error('Не удалось определить время до следующей отметки от времени последнего блока');
      }

      console.log(`Следующая проверка через ${Math.floor(timeToNextCheck)} секунд`);
      await new Promise(resolve => setTimeout(resolve, timeToNextCheck * 1000));

    } catch (error) {
      console.error('Произошла ошибка:', error);
      await new Promise(resolve => setTimeout(resolve, 60 * 1000));
    }
  }
}

main().catch(console.error);
