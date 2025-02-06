export class Logger {

  private static getTimeString(): string {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;
    return time;
  }


  static log(message?: any, ...optionalParams: any[]): void {
    message = `${Logger.getTimeString()} ${message}`;
    console.log(message, ...optionalParams);
  }

  static error(message?: any, ...optionalParams: any[]): void {
    message = `${Logger.getTimeString()} ${message}`;
    console.error(message, ...optionalParams);
  }
}
