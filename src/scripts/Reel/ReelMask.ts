import * as PIXI from 'pixi.js';
import Reel from '.';
import { Engine } from '../Engine';
import { GAME_WIDTH, NUM_SYMBOLS_TO_SHOW } from '../Utils/Constants';

export default class ReelMask extends PIXI.Graphics {
  /**
   * @constructor
   * @param {number} height -the scaled height of each symbol
   * @param {Reel[]} reelList - an array of each reel to mask
   */
  constructor(height: number = 0) {
    super();

    this.beginFill(0xff0000);
    this.drawRect(0, 0, GAME_WIDTH, height * NUM_SYMBOLS_TO_SHOW);
    this.endFill();
    this.cacheAsBitmap = true;

    Engine.reelList.forEach((reel: Reel) => {
      reel.mask = this;
    });
  }
}
