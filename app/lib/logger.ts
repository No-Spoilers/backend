// Colors: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const FgRed = '\x1b[31m'
const FgGreen = '\x1b[32m'

namespace logger {
  export function info (text: string): void {
    console.log(FgGreen, `[Info] ${text}`)
  }

  export function error (text: string): void {
    console.error(FgRed, `[Error] ${text}`)
  }
}

export default logger