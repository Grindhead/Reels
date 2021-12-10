import * as PIXI from 'pixi.js';
import {
  NUM_REELS,
  NUM_SYMBOLS_TO_SHOW,
  SYMBOL_HEIGHT,
  SYMBOL_WIDTH,
} from '../Utils/Constants';
import { getImageData } from '../Utils/Utils';

export default class UI extends PIXI.Container {
  spinButton: PIXI.Sprite;
  isEnabled: boolean = true;
  spinCallback: Function;
  mousePos = { x: 0, y: 0 };

  constructor(spinCallback: Function, stage: PIXI.Container) {
    super();

    this.spinCallback = spinCallback;
    this.spinButton = this.createSpinButton();

    this.activate();

    stage.interactive = true;
    stage.on('pointermove', (e: any) => {
      this.mousePos.x = e.data.global.x;
      this.mousePos.y = e.data.global.y;
    });
  }

  activate = () => {
    this.isEnabled = true;
    this.spinButton.interactive = true;
    this.spinButton.buttonMode = true;
    this.spinButton.texture = getImageData('ui/btn_spin_normal.png');

    // This is dirty and disgusting and will get updated
    if (
      this.mousePos.x >= 841 &&
      this.mousePos.x <= 1020 &&
      this.mousePos.y >= 605 &&
      this.mousePos.y <= 770
    ) {
      this.spinButton.texture = getImageData('ui/btn_spin_hover.png');
    }
  };

  disable = () => {
    this.isEnabled = false;
    this.spinButton.buttonMode = false;
    this.spinButton.interactive = false;
  };

  private createSpinButton = () => {
    const button: PIXI.Sprite = new PIXI.Sprite(
      getImageData('ui/btn_spin_normal.png'),
    );

    this.addChild(button);

    button.on('pointerdown', () => {
      button.texture = getImageData('ui/btn_spin_pressed.png');
    });

    button.on('pointerup', () => {
      button.texture = getImageData('ui/btn_spin_disabled.png');
      this.disable();
      this.spinCallback(this);
    });

    button.on('pointerover', () => {
      button.texture = getImageData('ui/btn_spin_hover.png');
    });

    button.on('pointerout', () => {
      button.texture = getImageData('ui/btn_spin_normal.png');
    });

    const padding = 20;

    button.x = NUM_REELS * SYMBOL_WIDTH - SYMBOL_WIDTH + padding;
    button.y = NUM_SYMBOLS_TO_SHOW * SYMBOL_HEIGHT + padding;

    return button;
  };
}
