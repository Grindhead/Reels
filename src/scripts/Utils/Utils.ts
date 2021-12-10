import * as PIXI from 'pixi.js';
import { NUM_REEL_STOP_SOUNDS, NUM_UNIQUE_SYMBOLS } from './Constants';

export const getImageData = (key: string) => {
  const atlasData: any = PIXI.Loader.shared.resources['atlas'];
  return atlasData.textures[key];
};

export const getRandomSymbol = () => {
  const id = Math.floor(Math.random() * (NUM_UNIQUE_SYMBOLS - 1 + 1) + 1);
  return 'symbols/symbol_' + id + '.png';
};

export const getRandomStopSound = () => {
  const id = Math.floor(Math.random() * (NUM_REEL_STOP_SOUNDS - 1 + 1) + 1);
  return 'Reel_Stop_' + id;
};
