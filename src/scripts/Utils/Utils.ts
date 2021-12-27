import * as PIXI from 'pixi.js';
import { NUM_REEL_STOP_SOUNDS, NUM_UNIQUE_SYMBOLS } from './Constants';

/**
 * @param {string} - the key of the image in the texture atlas
 * @return {any} - the texture data
 */
export const getImageData = (key: string) => {
  const atlasData: any = PIXI.Loader.shared.resources['atlas'];
  return atlasData.textures[key];
};

/**
 * @return {string} - a random key for a symbol
 */
export const getRandomSymbol = () => {
  const id = Math.floor(Math.random() * NUM_UNIQUE_SYMBOLS + 1);
  return 'symbols/symbol_' + id + '.png';
};

/**
 * @return {string} - a random key for a stop sound
 */
export const getRandomStopSound = () => {
  const id = Math.floor(Math.random() * NUM_REEL_STOP_SOUNDS + 1);
  return 'Reel_Stop_' + id;
};
