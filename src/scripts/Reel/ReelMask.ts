import * as PIXI from 'pixi.js';
import Reel from '.';
import { GAME_WIDTH, NUM_SYMBOLS_TO_SHOW } from '../Utils/Constants';

export default class ReelMask extends PIXI.Graphics {
  constructor(height: number = 0, reelList: Reel[] = []) {
    super();

    this.beginFill(0xff0000);
    this.drawRect(0, 0, GAME_WIDTH, height * NUM_SYMBOLS_TO_SHOW);
    this.endFill();
    this.cacheAsBitmap = true;

    reelList.forEach((reel: Reel) => {
      reel.mask = this;
    });
  }
}
