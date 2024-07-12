import Logger, { LogLevel } from "./";

describe("Logger", () => {
  afterEach(() => {
    Logger.resetInstance();
  });

  it("should create a singleton instance", () => {
    const logger1 = Logger.getInstance();
    const logger2 = Logger.getInstance();
    expect(logger1).toBe(logger2);
  });

  it("should not log messages below the set log level", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    const logger = Logger.getInstance({ logLevel: LogLevel.ERROR });

    logger.info("TEST", "This is an info message");
    logger.error("TEST", "This is an error message");

    expect(logSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("This is an info message"),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("This is an error message"),
    );

    logSpy.mockRestore();
  });

  it("should not log messages for non-specified domains", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    const logger = Logger.getInstance({ logDomains: ["TEST"] });

    logger.info("OTHER", "This is a message for another domain");
    logger.info("TEST", "This is a message for the test domain");

    expect(logSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("This is a message for another domain"),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("This is a message for the test domain"),
    );

    logSpy.mockRestore();
  });

  it("should use a custom output function", () => {
    const customOutput = jest.fn();
    const logger = Logger.getInstance({ customOutput });

    logger.info("TEST", "This is a custom output message");

    expect(customOutput).toHaveBeenCalledWith(
      expect.objectContaining({
        level: LogLevel.INFO,
        domain: "TEST",
        message: "This is a custom output message",
        timestamp: expect.any(String),
      }),
    );
  });

  it("should use a custom format function", () => {
    const customFormat = jest.fn(
      (level: LogLevel, domain: string, message: string) => ({
        level,
        domain,
        message,
        timestamp: "custom-timestamp",
      }),
    );
    const logger = Logger.getInstance({ customFormat });

    logger.info("TEST", "This is a custom format message");

    expect(customFormat).toHaveBeenCalledWith(
      LogLevel.INFO,
      "TEST",
      "This is a custom format message",
    );
  });

  it("should respect logLevel and logDomains options", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    const logger = Logger.getInstance({
      logLevel: LogLevel.WARN,
      logDomains: ["DOMAIN1", "DOMAIN2"],
    });

    logger.info("DOMAIN1", "Info message should not be logged");
    logger.warn("DOMAIN1", "Warn message should be logged");
    logger.error("DOMAIN2", "Error message should be logged");
    logger.error(
      "DOMAIN3",
      "Error message for other domain should not be logged",
    );

    expect(logSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Info message should not be logged"),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Warn message should be logged"),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error message should be logged"),
    );
    expect(logSpy).not.toHaveBeenCalledWith(
      expect.stringContaining(
        "Error message for other domain should not be logged",
      ),
    );

    logSpy.mockRestore();
  });
});
