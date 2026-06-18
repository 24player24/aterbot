/**
 * Utility functions for the bot
 */

/**
 * Sleep for a specified duration
 * @param ms - Duration in milliseconds
 * @returns Promise that resolves after the specified duration
 */
export const sleep = (ms: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get a random element from an array
 * @param arr - Array to pick from
 * @returns Random element from the array
 * @throws Error if array is empty
 */
export const getRandom = <T>(arr: T[]): T => {
	if (arr.length === 0) {
		throw new Error('Cannot get random element from empty array');
	}
	return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Generate a random angle in radians
 * @returns Random angle between -π/2 and π/2
 */
export const getRandomAngle = (): number =>
	Math.random() * Math.PI - 0.5 * Math.PI;

/**
 * Generate random boolean with specified probability
 * @param probability - Probability of true (0-1)
 * @returns Random boolean based on probability
 */
export const getRandomBool = (probability: number = 0.5): boolean =>
	Math.random() < probability;
