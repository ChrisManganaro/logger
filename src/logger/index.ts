import chalk from "chalk";

export enum LogLevel {
  NONE = "none",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  DEBUG = "debug",
}

type LogDomain = string;

type LogMessage = {
  level: LogLevel;
  domain: LogDomain;
  message: string;
  timestamp: string;
  // biome-ignore lint/suspicious/noExplicitAny: same def as console.log, allows anything to be passed in
  [key: string]: any;
};

const levels = [
  LogLevel.DEBUG,
  LogLevel.INFO,
  LogLevel.WARN,
  LogLevel.ERROR,
  LogLevel.NONE,
] as const;

// biome-ignore lint/suspicious/noExplicitAny: same def as console.log, allows anything to be passed in
type LoggerType = (logMessage: LogMessage, ...additionalArgs: any[]) => void;
type FormatterType = (
  level: LogLevel,
  domain: LogDomain,
  message: string,
  // biome-ignore lint/suspicious/noExplicitAny: same def as console.log, allows anything to be passed in
  ...additionalArgs: any[]
) => LogMessage;

interface LoggerOptions {
  logLevel?: LogLevel;
  logDomains?: LogDomain[];
  customOutput?: LoggerType;
  customFormat?: FormatterType;
}

export class Logger {
  private static instance: Logger | undefined;
  private logLevel: LogLevel;
  private logDomains: LogDomain[];
  private logger: LoggerType;
  private formatter: FormatterType;

  private constructor(options: LoggerOptions = {}) {
    this.logLevel = options.logLevel ?? LogLevel.INFO;
    this.logDomains = options.logDomains ?? [];
    this.logger = options.customOutput ?? this.baseLogger;
    this.formatter = options.customFormat ?? this.baseFormatter;
  }

  public static resetInstance(): void {
    Logger.instance = undefined;
  }

  public static getInstance(options?: LoggerOptions): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(options);
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel, domain: LogDomain): boolean {
    if (this.logLevel === LogLevel.NONE) {
      return false;
    }

    const isLevelAllowed =
      levels.indexOf(level) >= levels.indexOf(this.logLevel);
    const isDomainAllowed =
      this.logDomains.length === 0 || this.logDomains.includes(domain);
    return isLevelAllowed && isDomainAllowed;
  }

  public log(
    level: LogLevel,
    domain: LogDomain,
    message: string,
    // biome-ignore lint/suspicious/noExplicitAny: same def as console.log, allows anything to be passed in
    ...additionalArgs: any[]
  ): void {
    if (this.shouldLog(level, domain)) {
      const logMessage = this.formatter(level, domain, message);
      this.logger(logMessage, ...additionalArgs);
    }
  }

  public info(
    domain: LogDomain,
    message: string,
    // biome-ignore lint/suspicious/noExplicitAny: same def as console.log, allows anything to be passed in
    ...additionalArgs: any[]
  ): void {
    this.log(LogLevel.INFO, domain, message, ...additionalArgs);
  }

  public warn(
    domain: LogDomain,
    message: string,
    // biome-ignore lint/suspicious/noExplicitAny: same def as console.log, allows anything to be passed in
    ...additionalArgs: any[]
  ): void {
    this.log(LogLevel.WARN, domain, message, ...additionalArgs);
  }

  public error(
    domain: LogDomain,
    message: string,
    // biome-ignore lint/suspicious/noExplicitAny: same def as console.log, allows anything to be passed in
    ...additionalArgs: any[]
  ): void {
    this.log(LogLevel.ERROR, domain, message, ...additionalArgs);
  }

  public debug(
    domain: LogDomain,
    message: string,
    // biome-ignore lint/suspicious/noExplicitAny: same def as console.log, allows anything to be passed in
    ...additionalArgs: any[]
  ): void {
    this.log(LogLevel.DEBUG, domain, message, ...additionalArgs);
  }

  private baseLogger(
    logMessage: LogMessage,
    // biome-ignore lint/suspicious/noExplicitAny: same def as console.log, allows anything to be passed in
    ...additionalArgs: any[]
  ): void {
    const colorize = (level: LogLevel) => {
      switch (level) {
        case LogLevel.INFO:
          return chalk.blue;
        case LogLevel.WARN:
          return chalk.yellow;
        case LogLevel.ERROR:
          return chalk.red;
        case LogLevel.DEBUG:
          return chalk.green;
        default:
          return chalk.white;
      }
    };

    const color = colorize(logMessage.level);

    console.log(
      `${chalk.bold(`[${logMessage.timestamp}]`)} ` +
        `${chalk.bold(color(`[${logMessage.level.toUpperCase()}]`))} ` +
        `[${logMessage.domain}]: ${logMessage.message}`,
      ...additionalArgs,
    );
    console.log(
      `[${logMessage.timestamp}] ` +
        `[${logMessage.level.toUpperCase()}} ` +
        `[${logMessage.domain}]: ${logMessage.message}`,
      ...additionalArgs,
    );
  }

  private baseFormatter(
    level: LogLevel,
    domain: LogDomain,
    message: string,
  ): LogMessage {
    return {
      level,
      domain,
      message,
      timestamp: new Date().toISOString(),
    };
  }
}

export default Logger;
