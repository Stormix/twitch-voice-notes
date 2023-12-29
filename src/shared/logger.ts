export class Logger {
  private static instance: Logger;
  readonly module?: string;

  constructor(module?: string) {
    this.module = module;
  }

  pipe: ((type: LogType, text: string[], extraCSS: string[], objects?: object[]) => void) | null = null;

  static Get(): Logger {
    return this.instance ?? (Logger.instance = new Logger());
  }

  private getModulePrefix() {
    return {
      text: `%c[TwitchVoiceNotes]${this.module ? `[${this.module}]` : ''}`,
      css: 'color:#6441a5;',
    };
  }

  private print(type: LogType, text: string[], extraCSS: string[], objects?: object[]): void {
    if (this.pipe) {
      this.pipe(type, text, extraCSS, objects);
      return;
    }

    const prefix = this.getModulePrefix();
    // eslint-disable-next-line no-console
    console[type](prefix.text + ' ' + text.join(' '), prefix.css, ...extraCSS, ...(objects ?? []));
  }

  debug(...text: string[]): void {
    return this.print('debug', ['%c[DEBUG]%c', ...text], ['color:#32c8e6;', 'color:grey']);
  }

  debugWithObjects(text: string[], objects: object[]): void {
    return this.print('debug', ['%c[DEBUG]%c', ...text], ['color:#32c8e6;', 'color:grey'], objects);
  }

  info(...text: string[]): void {
    return this.print('info', ['%c[INFO]%c', ...text], ['color:#3cf051;', 'color:reset;']);
  }

  warn(...text: string[]): void {
    return this.print('warn', ['%c[WARN]%c', ...text], ['color:#fac837;', 'color:reset;']);
  }

  error(...text: string[]): void {
    return this.print('error', ['%c[ERROR]%c', ...text], ['color:#e63232;', 'color:reset;']);
  }
}

export const log = new Logger();
export type LogType = 'error' | 'warn' | 'debug' | 'info';
