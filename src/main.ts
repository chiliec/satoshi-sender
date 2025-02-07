import { openWallet } from "./ton";
import { getMiningData, mine } from "./mining";
import { config } from "./config";
import { randomNumber } from "./random";
import { Logger } from "./logger";

const minBlocksToWait = 3;
const maxBlocksToWait = 12;

async function main() {
  const wallet = await openWallet(config().mnemonic.split(" "));
  const receiverAddress = wallet.contract.address.toString();

  Logger.log(`Ожидаем майнинг от ${minBlocksToWait * 10} до ${maxBlocksToWait * 10} минут`);

  while (true) {
    try {
      const blocksToWait = randomNumber(minBlocksToWait, maxBlocksToWait);
      const data = await getMiningData();
      const lastBlockTime = Number(data.lastBlockTimestamp);
      const currentTime = Date.now() / 1000;
      const timeDifferenceMinutes = (currentTime - lastBlockTime) / 60;
      const minutesToWait = blocksToWait * 10;

      Logger.log(`Ожидаем ${minutesToWait} минут`)

      if (timeDifferenceMinutes >= minutesToWait) {
        Logger.log(`Прошли необходимые ${Math.floor(timeDifferenceMinutes)} минут с последнего блока. Майним!`);
        await mine(wallet, receiverAddress);
      } else {
        Logger.log(`Прошло ${Math.floor(timeDifferenceMinutes)} минут с последнего блока.`);
      }

      const tenMinutesInSeconds = 10 * 60;
      const timePassedSinceLastBlock = currentTime - lastBlockTime;
      const timeToNextCheck = tenMinutesInSeconds - (timePassedSinceLastBlock % tenMinutesInSeconds);

      if (timeToNextCheck < 0) {
        throw new Error('Не удалось определить время до следующей отметки от времени последнего блока');
      }

      Logger.log(`Следующая проверка через ${Math.floor(timeToNextCheck)} секунд`);
      await new Promise(resolve => setTimeout(resolve, timeToNextCheck * 1000));

    } catch (error) {
      Logger.error('Произошла ошибка:', error);
      await new Promise(resolve => setTimeout(resolve, 60 * 1000));
    }
  }
}

main().catch(Logger.error);
