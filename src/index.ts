/**
 * Main entry point for AterBot
 * Initializes both the Minecraft bot and HTTP server
 */

import initBot from './bot.js';
import initWeb from './web.js';
import { logger } from './logger.js';

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error: Error) => {
	logger.error('Uncaught exception', error);
	process.exit(1);
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason: unknown) => {
	const error = reason instanceof Error ? reason : new Error(String(reason));
	logger.error('Unhandled rejection', error);
	process.exit(1);
});

/**
 * Initialize both bot and web server
 */
try {
	logger.info('Initializing AterBot...');
	initBot();
	initWeb();
} catch (error) {
	logger.error(
		'Failed to initialize',
		error instanceof Error ? error : undefined
	);
	process.exit(1);
}
