/**
 * Minecraft bot implementation using Mineflayer
 */

import Mineflayer from 'mineflayer';
import { sleep, getRandom, getRandomAngle, getRandomBool } from './utils.js';
import { logger } from './logger.js';
import CONFIG from '../config.json' assert { type: 'json' };

// Constants
const BOT_NAME = 'AterBot';
const RECONNECT_INTERVAL_MS = CONFIG.action.retryDelay;
const ACTION_HOLD_DURATION_MS = CONFIG.action.holdDuration;
const SPRINT_PROBABILITY = 0.5;

interface BotManager {
	bot: Mineflayer.Bot | null;
	loopInterval: NodeJS.Timeout | null;
}

const botManager: BotManager = {
	bot: null,
	loopInterval: null,
};

/**
 * Clean up bot resources
 */
const cleanup = (): void => {
	if (botManager.loopInterval) {
		clearInterval(botManager.loopInterval);
		botManager.loopInterval = null;
	}
	if (botManager.bot) {
		try {
			botManager.bot.quit?.();
			botManager.bot.end?.();
		} catch (error) {
			logger.error('Error while quitting bot', error instanceof Error ? error : undefined);
		}
		botManager.bot = null;
	}
};

/**
 * Attempt to reconnect the bot
 */
const reconnect = async (): Promise<void> => {
	logger.info(
		`Attempting to reconnect in ${RECONNECT_INTERVAL_MS / 1000} seconds...`
	);

	cleanup();
	await sleep(RECONNECT_INTERVAL_MS);
	createBot();
};

/**
 * Perform a random movement action
 */
const performRandomAction = async (): Promise<void> => {
	if (!botManager.bot) return;

	const action = getRandom(CONFIG.action.commands) as Mineflayer.ControlState;
	const shouldSprint = getRandomBool(SPRINT_PROBABILITY);

	logger.debug(
		`Executing action: ${action}${shouldSprint ? ' with sprint' : ''}`
	);

	try {
		botManager.bot.setControlState('sprint', shouldSprint);
		botManager.bot.setControlState(action, true);

		await sleep(ACTION_HOLD_DURATION_MS);
		botManager.bot.clearControlStates();
	} catch (error) {
		logger.error(
			'Error performing action',
			error instanceof Error ? error : undefined
		);
	}
};

/**
 * Change bot's view direction randomly
 */
const changeView = async (): Promise<void> => {
	if (!botManager.bot) return;

	const yaw = getRandomAngle();
	const pitch = getRandomAngle();

	try {
		await botManager.bot.look(yaw, pitch, false);
	} catch (error) {
		logger.error('Error changing view', error instanceof Error ? error : undefined);
	}
};

/**
 * Start the bot's activity loop
 */
const startActivityLoop = (): void => {
	if (botManager.loopInterval) {
		clearInterval(botManager.loopInterval);
	}

	botManager.loopInterval = setInterval(() => {
		void changeView();
		void performRandomAction();
	}, ACTION_HOLD_DURATION_MS);

	logger.debug('Activity loop started');
};

/**
 * Setup event handlers for the bot
 */
const setupEventHandlers = (): void => {
	if (!botManager.bot) return;

	const bot = botManager.bot;

	bot.once('error', (error: Error) => {
		logger.error(`${BOT_NAME} encountered an error`, error);
	});

	bot.once('kicked', (rawResponse: string | object) => {
		logger.error(
			`${BOT_NAME} was kicked from server: ${
				typeof rawResponse === 'string' ? rawResponse : JSON.stringify(rawResponse)
			}`
		);
	});

	bot.once('end', () => {
		logger.warn(`${BOT_NAME} disconnected, attempting to reconnect...`);
		void reconnect();
	});

	bot.once('spawn', () => {
		logger.info(`${BOT_NAME} spawned successfully`);
		startActivityLoop();
	});

	bot.once('login', () => {
		logger.info(`${BOT_NAME} logged in as ${bot.username}`);
	});
};

/**
 * Create and initialize the bot
 */
const createBot = (): void => {
	try {
		botManager.bot = Mineflayer.createBot({
			host: CONFIG.client.host,
			port: parseInt(String(CONFIG.client.port), 10),
			username: CONFIG.client.username,
		} as const);

		logger.info('Bot created, connecting to server...');
		setupEventHandlers();
	} catch (error) {
		logger.error(
			'Failed to create bot',
			error instanceof Error ? error : undefined
		);
		// Retry after delay
		void sleep(RECONNECT_INTERVAL_MS).then(() => createBot());
	}
};

/**
 * Initialize the bot module
 */
export default (): void => {
	logger.info(`Starting ${BOT_NAME}...`);
	createBot();
};
