export const NUM_UNIQUE_SYMBOLS: number = 8;
export const NUM_SYMBOLS_TO_SHOW: number = 3;
export const NUM_REELS: number = 5;

export const GAME_WIDTH: number = 1024;
export const GAME_HEIGHT: number = 768;

export const SYMBOL_WIDTH: number = 236;
export const SYMBOL_HEIGHT: number = 226;

export const SPIN_START: number = 0.2;
export const SPIN_DURATION: number = 1;
export const SPIN_END: number = 0.35;

export const SPIN_SPEED: number = 60;

export const NUM_REEL_STOP_SOUNDS: number = 5;

export const FEATURES = {
  CASCADING_REELS: true,
};

export const EVENTS = {
  /**
   * emitted when a spin has started
   * @event
   */
  SPIN_START: 'spin-start',

  /**
   * emitted when a spin has ended
   * @event
   */
  SPIN_COMPLETE: 'spin-complete',
};
