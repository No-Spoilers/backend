// Colors: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const FgRed = '\x1b[31m'
const FgGreen = '\x1b[32m'

namespace logger {
    export function info (text: string): void {
        if (process.env.NODE_LOGGER_CONSOLE =='true' || process.env.NODE_ENV !== 'test') {
            console.log(FgGreen, `[Info] ${text}`)
        }
    }

    export function error (text: string): void {
        if (process.env.NODE_LOGGER_CONSOLE =='true' || process.env.NODE_ENV !== 'test') {
            console.error(FgRed, `[Error] ${text}`)
        }
    }
}

export default logger
