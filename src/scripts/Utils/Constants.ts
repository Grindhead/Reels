/**
 * how many unique symbols we have
 */
export const NUM_UNIQUE_SYMBOLS: number = 8;
/**
 * how many symbols to show per reel
 */
export const NUM_SYMBOLS_TO_SHOW: number = 3;
/**
 * how many reels to show
 */
export const NUM_REELS: number = 5;
/**
 * the logic width of the game
 */
export const GAME_WIDTH: number = 1024;
/**
 * the logic height of the game
 */
export const GAME_HEIGHT: number = 768;
/**
 * the width of a symbol in pixels
 */
export const SYMBOL_WIDTH: number = 236;
/**
 * the height of a symbol in pixels
 */
export const SYMBOL_HEIGHT: number = 226;
/**
 * how log it takes in seconds for a spin to start
 */
export const SPIN_START: number = 0.2;
/**
 * how long a spin will continue to animate for before stopping, in seconds
 */
export const SPIN_DURATION: number = 1;
/**
 * how long in seconds it takes for a spin to start stopping
 */
export const SPIN_END: number = 0.35;
/**
 * the vertical ySpeed in pixels per second a symbol should move when animating
 */
export const SPIN_SPEED: number = 60;
/**
 * the number of unique reel stop sounds included
 */
export const NUM_REEL_STOP_SOUNDS: number = 5;
/**
 * The features included
 * @enum
 */
export const FEATURES = {
  /**
   * should the game feature cascading reels
   */
  CASCADING_REELS: 'true',
  /**
   * should the game show stats. These are MrD00b stats - https://github.com/mrdoob/stats.js/
   */
  SHOW_STATS: 'true',
} as const;
/**
 * supported events
 * @enum
 */
export const EVENTS = {
  /**
   * emitted when a spin has started
   */
  SPIN_START: 'spin-start',

  /**
   * emitted when a spin has ended
   */
  SPIN_COMPLETE: 'spin-complete',
} as const;
