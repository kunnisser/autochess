/**
 * Created by kunnisser on 2017/1/19 0019.
 * BOOT状态
 */

// import initGame from '../InitGame/initGame';
import config from '../GameConfiger/config';
import stateTransition from '../Plugins/stateTransition';
import preloaderdata from '../assets/jsonHash/preloader.js';

class boot extends Phaser.State {
    constructor () {
        super();
    }

    init () {
    }

    preload () {
      this.load.atlas('preloader', 'Parkour/assets/graphics/preloader.png', '', new preloaderdata());
    }

    create () {
        this.setupScale();
        this.input.maxPointers = 1;
        this.game.add.plugin(new stateTransition(this.game));
        this.game.renderer.clearBeforeRender = !1;
        this.state.start('preloader', !0, !1);
    }

  // 缩放设置
  setupScale() {
    this.scaleForMobile();
    this.dprScale();
    this.world.displayObjectUpdateTransform = () => {
      if (!this.game.scale.isLandscape) {
        this.world.x = this.game.width + this.game.camera.y;
        this.world.y = -this.game.camera.x;
        this.world.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(90));
      } else {
        this.world.x = -this.game.camera.x;
        this.world.y = -this.game.camera.y;
        this.world.rotation = 0;
      }
      PIXI.DisplayObject.prototype.updateTransform.call(this.world);
    };
  }

  scaleForMobile() {
    let gamescale = this.game.scale;
    gamescale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    gamescale.forceOrientation(!1, !0); // 默认竖屏
  }

  dprScale() {
    const [
      ClientWidth,
      ClientHeight,
    ] = [
        window.innerWidth,
        window.innerHeight,
      ];
    const dprWidth = window.devicePixelRatio * ClientWidth;
    let [
      canvasWidth,
      canvasHeight,
      correct
    ] = [
        0,
        0,
        !this.game.scale.isLandscape
      ];
    const source = correct ? config.SOURCE_GAME_WIDTH : config.SOURCE_GAME_HEIGHT;
    if (dprWidth <= source) {
      canvasWidth = ClientWidth * 3;
      canvasHeight = ClientHeight * 3;
    } else {
      canvasWidth = ClientWidth;
      canvasHeight = ClientHeight;
    }
    const sourceWidth = config.SOURCE_GAME_WIDTH;
    const scaling = (correct ? canvasWidth : canvasHeight) / sourceWidth;
    this.scale.setGameSize(canvasWidth / scaling, canvasHeight / scaling); 
    config.WORLD_SCALE = scaling;
    config.GAME_WIDTH = !correct ? this.game.canvas.width : this.game.canvas.height; // 缩放游戏画布的尺寸
    config.GAME_HEIGHT = !correct ? this.game.canvas.height : this.game.canvas.width;
    config.HALF_GAME_WIDTH = config.GAME_WIDTH * 0.5;
    config.HALF_GAME_HEIGHT = config.GAME_HEIGHT * 0.5;
    window.gameConfig = config;
  }
}

export default boot;