import * as PIXI from 'pixi.js';
import {
  NUM_SYMBOLS_TO_SHOW,
  SPIN_DURATION,
  SPIN_END,
  SPIN_SPEED,
  SPIN_START,
  SYMBOL_HEIGHT,
} from '../Utils/Constants';
import { getImageData, getRandomStopSound } from '../Utils/Utils';
import { gsap, Power1 } from 'gsap';
import { orderBy } from 'lodash';
import { getRandomSymbol } from '../Utils/Utils';
import Engine from '../Engine';

export default class Reel extends PIXI.Container {
  symbolList: PIXI.Sprite[] = [];
  yVel: number = 0;
  engine: Engine;

  constructor(engine: Engine) {
    super();
    this.engine = engine;
    this.createSymbols();
  }

  createSymbols = () => {
    for (let i = 0; i < NUM_SYMBOLS_TO_SHOW + 1; i++) {
      const key: string = getRandomSymbol();
      const symbol: PIXI.Sprite = new PIXI.Sprite(getImageData(key));
      this.symbolList.push(symbol);
      symbol.y = i * symbol.height;
      this.addChild(symbol);
    }
  };

  startSpin = (delay: number, spinComplete: Function) => {
    this.engine.audio.play('Start_Button');

    var timeline = gsap.timeline();

    timeline.to(this, {
      yVel: SPIN_SPEED,
      duration: SPIN_START,
      delay: delay * 0.2,
    });

    timeline.to(this, {
      duration: SPIN_DURATION,
      onComplete: () => {
        this.symbolList = orderBy(this.symbolList, ['y']);
        this.yVel = 0;
        this.symbolList.forEach((symbol, index) => {
          const anim = gsap.to(symbol, SPIN_END, {
            y: symbol.y + -this.symbolList[0].y,
            ease: Power1.easeOut,
            onComplete: () => {
              this.engine.audio.play(getRandomStopSound());
            },
          });

          if (index === this.symbolList.length - 1) {
            anim.then(() => spinComplete());
          }
        });
      },
    });
  };

  spinEnded = () => {};

  update = () => {
    this.symbolList.forEach((symbol: PIXI.Sprite) => {
      symbol.y += this.yVel;

      if (symbol.y > NUM_SYMBOLS_TO_SHOW * SYMBOL_HEIGHT) {
        this.resetSymbol(symbol);
      }
    });
  };

  resetSymbol = (symbol: PIXI.Sprite) => {
    symbol.y -= NUM_SYMBOLS_TO_SHOW * SYMBOL_HEIGHT + symbol.height;
    symbol.texture = getImageData(getRandomSymbol());
  };
}
