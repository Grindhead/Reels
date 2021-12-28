import * as PIXI from 'pixi.js';
import Reel from '.';
import { Engine } from '../Engine';
import { GAME_WIDTH, NUM_SYMBOLS_TO_SHOW } from '../Utils/Constants';

export const ReelMask = {
  /**
   * apply a mask to each reel strip in the supplied array
   *
   * @param {number} height - the scaled height of each symbol
   * @param {Reel[]} reelList - an array of each reel to mask
   */
  apply(height: number = 0) {
    const mask = new PIXI.Graphics();

    mask.beginFill(0xff0000);
    mask.drawRect(0, 0, GAME_WIDTH, height * NUM_SYMBOLS_TO_SHOW);
    mask.endFill();
    mask.cacheAsBitmap = true;

    Engine.reelList.forEach((reel: Reel) => {
      reel.mask = mask;
    });
  },
};
