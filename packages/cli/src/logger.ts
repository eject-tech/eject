import chalk from "chalk";

export interface EjectLoggerOptions {
  scope: string;
  style: chalk.ChalkFunction;
  level: number;
}

export const ejectLoggerLevels = {
  error: { value: 0, style: chalk.red },
  warn: { value: 10, style: chalk.yellow },
  info: { value: 20, style: chalk.blue },
  verbose: { value: 30, style: chalk.magenta },
  debug: { value: 40, style: chalk.white },
  silly: { value: 50, style: chalk.cyan },
} as const;

export type EjectLoggerLevels = typeof ejectLoggerLevels;

type LogFunction = (...data: any[]) => void;

export class EjectLogger {
  public readonly options: EjectLoggerOptions;

  static defaults: Required<EjectLoggerOptions> = {
    scope: "@eject/cli",
    style: chalk.hex("#FF4B4B").bold,
    level: 30, // Maximum level to output
  };

  private childLoggers: EjectLogger[] = [];
  private parent: EjectLogger | undefined;

  private readonly scopeWidth: number = 15;
  private readonly labelWidth: number = 9;

  // @TODO: any idea how to make these dynamic from levels above?
  log!: LogFunction;
  error!: LogFunction;
  warn!: LogFunction;
  info!: LogFunction;
  verbose!: LogFunction;
  debug!: LogFunction;
  silly!: LogFunction;

  constructor(options?: Partial<EjectLoggerOptions>, parent?: EjectLogger) {
    this.options = { ...EjectLogger.defaults, ...options };

    if (parent) {
      this.parent = parent;
    }

    Object.entries(ejectLoggerLevels).forEach(([func, opts]) => {
      this[func as keyof typeof ejectLoggerLevels] = this.createLogFunction(
        opts.value,
        func,
        opts.style
      );
    });

    this.log = this.info;
  }

  public setLogLevel(level: keyof EjectLoggerLevels | number) {
    if (typeof level === "string") {
      this.options.level = ejectLoggerLevels[level].value;
    } else {
      this.options.level = level;
    }
  }

  public scope(options: Required<Pick<EjectLoggerOptions, "scope" | "style">>) {
    const scopedLogger = new EjectLogger({ ...this.options, ...options }, this);
    this.childLoggers.push(scopedLogger);
    return scopedLogger;
  }

  public createLogFunction(
    level: number,
    label: string,
    style: chalk.ChalkFunction
  ) {
    const scopeTruncation = this.scopeWidth - 2; // Allow room for appended space and colon
    const scope =
      this.options.scope.length > scopeTruncation
        ? `${this.options.scope.substring(0, scopeTruncation)}:...`
        : `${this.options.scope}: `.padEnd(this.scopeWidth);

    const outputs = {
      scope: this.options.style(scope),
      label: style(`(${label})`.padStart(this.labelWidth)),
    };

    return (...data: any[]) => {
      if (level <= this.options.level) {
        console.log(
          `[${new Date().toLocaleTimeString()}] ${outputs.label} ${
            outputs.scope
          }`,
          // Insert a new line when object output is first parameter for better readability
          typeof data[0] === "object" ? "\n" : "",
          ...data
        );
      }
    };
  }
}

export const logger = new EjectLogger();
