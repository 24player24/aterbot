/**
 * Type definitions for the configuration file
 */

export interface ClientConfig {
	host: string;
	port: number | string;
	username: string;
}

export interface ActionConfig {
	commands: string[];
	holdDuration: number;
	retryDelay: number;
}

export interface Config {
	client: ClientConfig;
	logLevel: string[];
	action: ActionConfig;
}
