import chalk from "chalk";

const LABEL_WIDTH = 12;

type LoggerOptions = {
  type?: string;
};

const getTimeStamp = (): string => {
  const now = new Date();
  return now.toTimeString().split(" ")[0];
};

export const logger = {
  success: (message: string, options?: LoggerOptions) => {
    const time = chalk.hex("#8D929C")(getTimeStamp());
    const label = options?.type || "SUCCESS";
    const pad = LABEL_WIDTH - label.length;
    console.log(
      chalk.gray("[") +
        chalk.hex("#8D929C").bold(label) +
        chalk.gray("]") +
        " ".repeat(2) +
        time +
        " ".repeat(pad) +
        chalk.green(message),
    );
  },
  error: (message: string, options?: LoggerOptions) => {
    const time = chalk.hex("#8D929C")(getTimeStamp());
    const label = options?.type || "ERROR";
    const pad = LABEL_WIDTH - label.length;
    console.log(
      chalk.gray("[") +
        chalk.hex("#E05561").bold(label) +
        chalk.gray("]") +
        " ".repeat(2) +
        time +
        " ".repeat(pad) +
        chalk.red(message),
    );
  },
  warning: (message: string, options?: LoggerOptions) => {
    const time = chalk.hex("#8D929C")(getTimeStamp());
    const label = options?.type || "WARNING";
    const pad = LABEL_WIDTH - label.length;
    console.log(
      chalk.gray("[") +
        chalk.hex("#a86d35ff")(label) +
        chalk.gray("]") +
        " ".repeat(2) +
        time +
        " ".repeat(pad) +
        chalk.yellow(message),
    );
  },
  info: (message: string | object, options?: LoggerOptions) => {
    const time = chalk.hex("#8D929C")(getTimeStamp());
    const label = options?.type || "INFO";
    const pad = LABEL_WIDTH - label.length;
    console.log(
      chalk.gray("[") +
        chalk.hex("#3bb1c0ff").bold(label) +
        chalk.gray("]") +
        " ".repeat(2) +
        time +
        " ".repeat(pad) +
        chalk.cyan(typeof message === "string" ? message : JSON.stringify(message)),
    );
  },
};
