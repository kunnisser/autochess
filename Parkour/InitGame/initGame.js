/**
 * Created by kunnisser on 2017/8/2.
 * 初始化Game
 * */

import configCreate from '../GameConfiger/configCreator.js';
import boot from '../State/boot';
import preloader from '../State/preloader';
import menu from '../State/menu.js';
import SceneFight from '../State/sceneFight.js';

class initGame extends Phaser.Game{
    constructor () {
      let conf = configCreate.createConfig();
      super(conf);
      window.gameConfig = conf;
      // 符合条件进入boot状态
      this.state.add('boot', boot, !0);
      this.state.add('preloader', preloader, !1);
      this.state.add('menu', menu, !1);
      this.state.add('fight_scene', SceneFight, !1);
    };
    
    changeState (nextLevel, bool) {
      this.plugins.plugins[0].changeState(nextLevel, bool);
    }

}

export default initGame;