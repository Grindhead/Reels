import Stats from 'stats.js';
import Engine from './Engine';
import { GAME_HEIGHT, GAME_WIDTH } from './Utils/Constants';

const stats = new Stats();

window.onload = () => {
  const engine = new Engine({
    containerId: 'game',
    canvasW: GAME_WIDTH,
    canvasH: GAME_HEIGHT,
  });

  const render = () => {
    requestAnimationFrame(render);
    stats.begin();
    engine.update();
    engine.renderer.render(engine.stage);
    stats.end();
  };

  showStats();

  render();
};

const showStats = () => {
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);
};
