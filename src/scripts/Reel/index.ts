import * as PIXI from 'pixi.js';
import {
  EVENTS,
  FEATURES,
  NUM_SYMBOLS_TO_SHOW,
  SPIN_DURATION,
  SPIN_END,
  SPIN_SPEED,
  SPIN_START,
  SYMBOL_HEIGHT,
} from '../Utils/Constants';
import { getImageData, getRandomStopSound } from '../Utils/Utils';
import { gsap, Power1 } from 'gsap';
import _, { orderBy } from 'lodash';
import { getRandomSymbol } from '../Utils/Utils';
import Engine from '../Engine';
import { globalEvent } from '@billjs/event-emitter';

export default class Reel extends PIXI.Container {
  symbolList: PIXI.Sprite[] = [];
  yVel: number = 0;
  engine: Engine;
  isSpinning: boolean = false;

  constructor(engine: Engine) {
    super();
    this.engine = engine;
    this.createSymbols();
  }

  createSymbols = () => {
    for (let i = 0; i < NUM_SYMBOLS_TO_SHOW + 1; i++) {
      const key: string = getRandomSymbol();
      const symbol: PIXI.Sprite = new PIXI.Sprite(getImageData(key));
      symbol.anchor.set(0.5);
      this.symbolList.push(symbol);
      symbol.x = symbol.height * 0.5;
      symbol.y = i * symbol.height + symbol.height / 2;
      this.addChild(symbol);
    }
  };

  startSpin = (delay: number) => {
    this.engine.audio.play('Start_Button');
    this.isSpinning = true;
    var timeline = gsap.timeline();

    timeline.to(this, {
      yVel: SPIN_SPEED,
      duration: SPIN_START,
      delay: delay * 0.2,
    });

    timeline.to(this, {
      duration: SPIN_DURATION,
      onComplete: () => {
        this.isSpinning = false;
        this.symbolList = orderBy(this.symbolList, ['y']);

        if (FEATURES.CASCADING_REELS) {
          return;
        }

        this.symbolList.forEach((symbol, index) =>
          this.animateOut(symbol, index),
        );
      },
    });
  };

  update = () => {
    this.symbolList.forEach((symbol: PIXI.Sprite) => {
      if (!this.isSpinning && symbol.y <= -SYMBOL_HEIGHT) {
      } else {
        symbol.y += this.yVel;
      }

      if (
        symbol.y >
        NUM_SYMBOLS_TO_SHOW * SYMBOL_HEIGHT + SYMBOL_HEIGHT * 0.5
      ) {
        this.resetSymbol(symbol);
      }
    });

    if (FEATURES.CASCADING_REELS) {
      const isAnimationFinished = this.symbolList.every((sprite) => {
        return sprite.y === -SYMBOL_HEIGHT * 2;
      });

      if (isAnimationFinished) {
        this.yVel = 0;

        _.forEachRight(this.symbolList, (symbol: PIXI.Sprite, index: number) =>
          this.animateOut(symbol, index),
        );
      }
    }
  };

  animateOut = (symbol: PIXI.Sprite, index: number) => {
    let y = symbol.y + -this.symbolList[0].y + SYMBOL_HEIGHT * 0.5;
    let delay = 0;
    this.yVel = 0;

    if (FEATURES.CASCADING_REELS) {
      symbol.angle = _.random(-360, 360);
      y = index * SYMBOL_HEIGHT + SYMBOL_HEIGHT * 0.5;
      delay = (NUM_SYMBOLS_TO_SHOW - 1 - index) * 0.5;
    }

    const ease = FEATURES.CASCADING_REELS ? Power1.easeInOut : undefined;

    const anim = gsap.to(symbol, {
      duration: SPIN_END,
      y,
      rotation: 0,
      delay,
      ease,
      onComplete: () => {
        this.engine.audio.play(getRandomStopSound());

        if (index === this.symbolList.length - 1) {
          anim.then(() => globalEvent.fire(EVENTS.SPIN_COMPLETE));
        }
      },
    });
  };

  resetSymbol = (symbol: PIXI.Sprite) => {
    if (FEATURES.CASCADING_REELS && !this.isSpinning) {
      symbol.y = -symbol.height * 2;
    } else {
      symbol.y -= NUM_SYMBOLS_TO_SHOW * SYMBOL_HEIGHT + symbol.height;
    }

    symbol.texture = getImageData(getRandomSymbol());
  };
}
