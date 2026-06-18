/**
 * Logger utility for consistent console output
 */

export enum LogLevel {
	DEBUG = 'DEBUG',
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR',
}

class Logger {
	private logLevel: LogLevel = LogLevel.INFO;

	setLogLevel(level: LogLevel): void {
		this.logLevel = level;
	}

	private shouldLog(level: LogLevel): boolean {
		const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
		const logLevelIndex = levels.indexOf(this.logLevel);
		const currentLevelIndex = levels.indexOf(level);
		return currentLevelIndex >= logLevelIndex;
	}

	private formatMessage(level: LogLevel, message: string): string {
		const timestamp = new Date().toISOString();
		return `[${timestamp}] [${level}] ${message}`;
	}

	debug(message: string): void {
		if (this.shouldLog(LogLevel.DEBUG)) {
			console.debug(this.formatMessage(LogLevel.DEBUG, message));
		}
	}

	info(message: string): void {
		if (this.shouldLog(LogLevel.INFO)) {
			console.log(this.formatMessage(LogLevel.INFO, message));
		}
	}

	warn(message: string): void {
		if (this.shouldLog(LogLevel.WARN)) {
			console.warn(this.formatMessage(LogLevel.WARN, message));
		}
	}

	error(message: string, error?: Error): void {
		if (this.shouldLog(LogLevel.ERROR)) {
			console.error(this.formatMessage(LogLevel.ERROR, message));
			if (error) {
				console.error(`Stack: ${error.stack}`);
			}
		}
	}
}

export const logger = new Logger();
