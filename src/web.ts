/**
 * HTTP server for UptimeRobot keep-alive pings
 */

import HTTP from 'node:http';
import { logger } from './logger.js';

const PORT = parseInt(process.env.PORT ?? '5500', 10);
const REPLIT_ORIGIN = 'https://replit.com';

interface RequestHandler {
	(request: HTTP.IncomingMessage, response: HTTP.ServerResponse): void;
}

/**
 * Handle incoming HTTP requests
 */
const handleRequest: RequestHandler = (_request, response) => {
	const headers: Record<string, string> = {
		'Access-Control-Allow-Origin': REPLIT_ORIGIN,
		'Access-Control-Allow-Methods': 'GET, PING, OPTIONS',
		'Content-Type': 'text/html; charset=utf-8',
		'Cache-Control': 'no-cache, no-store, must-revalidate',
	};

	try {
		response.writeHead(200, headers);
		response.end('<h3>Copy me, the url above!</h3>');
	} catch (error) {
		logger.error(
			'Error handling request',
			error instanceof Error ? error : undefined
		);
		response.writeHead(500);
		response.end('Internal Server Error');
	}
};

/**
 * Create and start the HTTP server
 */
const createServer = (): HTTP.Server => {
	const server = HTTP.createServer(handleRequest);

	server.on('error', (error: Error) => {
		logger.error('Server error', error);
	});

	server.on('clientError', (error: Error) => {
		logger.warn(`Client error: ${error.message}`);
	});

	return server;
};

/**
 * Initialize the web server module
 */
export default (): void => {
	const server = createServer();

	server.listen(PORT, () => {
		logger.info(`UptimeRobot server listening on port ${PORT}`);
		logger.info('Share the displayed URL with UptimeRobot monitor');
	});
};
