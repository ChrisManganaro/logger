# Logger Module

## Overview
This logger module provides a flexible and configurable logging mechanism for Node.js applications. It supports different log levels, custom log domains, and allows customization of the log output and format. It uses `chalk` for colored console output and ensures that only one instance of the logger is created (singleton pattern).

## Usage

### Importing the Logger
```javascript
import Logger, { LogLevel } from "./logger";
```

### Getting the Logger Instance
To get the singleton instance of the logger, use:
```javascript
const logger = Logger.getInstance();
```

### Setting Logger Options
You can set options like log level, log domains, custom output function, and custom format function when getting the instance:
```javascript
const logger = Logger.getInstance({
  logLevel: LogLevel.DEBUG,
  logDomains: ["APP", "DB"],
  customOutput: (logMessage) => {
    // Custom output logic
    console.log(logMessage);
  },
  customFormat: (level, domain, message) => {
    // Custom format logic
    return {
      level,
      domain,
      message,
      timestamp: new Date().toISOString(),
    };
  },
});
```

### Logging Messages
The logger supports different log levels:
- `INFO`
- `WARN`
- `ERROR`
- `DEBUG`

You can log messages using the corresponding methods:

```javascript
logger.info("APP", "This is an info message");
logger.warn("APP", "This is a warning message");
logger.error("APP", "This is an error message");
logger.debug("APP", "This is a debug message");
```

### Example
```javascript
import Logger, { LogLevel } from "./logger";

const logger = Logger.getInstance({
  logLevel: LogLevel.DEBUG,
  logDomains: ["APP", "DB"],
});

logger.info("APP", "Application has started");
logger.warn("DB", "Database connection is slow");
logger.error("APP", "Unhandled exception occurred");
logger.debug("DB", "Query executed: SELECT * FROM users");
```

## Logger Options

### `logLevel`
- Specifies the minimum level of messages to log.
- Type: `LogLevel`
- Default: `LogLevel.INFO`

### `logDomains`
- Specifies the domains to log messages for.
- Type: `string[]`
- Default: `[]` (log all domains)

### `customOutput`
- Custom function for handling the log output.
- Type: `(logMessage: LogMessage, ...additionalArgs: any[]) => void`

### `customFormat`
- Custom function for formatting log messages.
- Type: `(level: LogLevel, domain: LogDomain, message: string, ...additionalArgs: any[]) => LogMessage`

## Log Levels
```typescript
export enum LogLevel {
  NONE = "none",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  DEBUG = "debug",
}
```

## API Reference

### `Logger.getInstance(options?: LoggerOptions): Logger`
Returns the singleton instance of the logger, optionally configuring it with the provided options.

### `Logger.resetInstance(): void`
Resets the logger instance. Useful for testing purposes.

### `Logger.log(level: LogLevel, domain: LogDomain, message: string, ...additionalArgs: any[]): void`
Logs a message with the specified level and domain.

### `Logger.info(domain: LogDomain, message: string, ...additionalArgs: any[]): void`
Logs an info message.

### `Logger.warn(domain: LogDomain, message: string, ...additionalArgs: any[]): void`
Logs a warning message.

### `Logger.error(domain: LogDomain, message: string, ...additionalArgs: any[]): void`
Logs an error message.

### `Logger.debug(domain: LogDomain, message: string, ...additionalArgs: any[]): void`
Logs a debug message.

## Testing
The logger module includes tests to ensure its functionality. The tests cover creating singleton instances, respecting log levels and domains, and using custom output and format functions.