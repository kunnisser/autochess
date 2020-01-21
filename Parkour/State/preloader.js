import config from '../GameConfiger/config';
import fontData from '../assets/fonts/font.js';
import hero from '../assets/jsonHash/hero.js';
import skills from '../assets/jsonHash/skills.js';
import SpriteUtil from '../Util/spriteUtil.js';

class preloader extends Phaser.State {
    constructor () {
        super();
      this.basicGraphUrl = 'Parkour/assets/graphics';
    }

    init () {
      SpriteUtil.initGame(this.game);
       this.addBackground();
       this.addBgItem();
       this.addPreloadBar();
       this.addLoadingInfo();
       this.addCompanyInfo();
       this.resize();
    }

    preload () {
        this.loadFontAssets();
        this.loadGraphics();
        this.load.setPreloadSprite(this.innerPreloaderSprite);
    }

    create () {
      this.game.changeState('fight_scene', !0);
    }

    loadFontAssets () {
        this.fontData = new fontData().getData();
    }

    loadGraphics () {
      this.load.image('menuBg', this.basicGraphUrl + '/bg.png');
      this.load.image('levelBg', this.basicGraphUrl + '/levelBg.jpg');
      // menu
      this.load.image('titleBg', this.basicGraphUrl + '/titleBg.png');
      this.load.image('titleText', this.basicGraphUrl + '/titleText.png');
      this.load.image('titleWeapon01', this.basicGraphUrl + '/titleWeapon_01.png');
      this.load.image('titleWeapon02', this.basicGraphUrl + '/titleWeapon_02.png');
      this.load.image('startBtn', this.basicGraphUrl + '/startBtn.png');

      // card
      this.load.image('cardBg', this.basicGraphUrl + '/cardBg.png');
      this.load.image('cardInfoBg', this.basicGraphUrl + '/cardInfoBg.png');
      this.load.image('cardThumbBg', this.basicGraphUrl + '/cardThumbBg.png');

      this.load.image('cardBtn', this.basicGraphUrl + '/cardBtn.png');
      this.load.image('rankBtn', this.basicGraphUrl + '/rankBtn.png');
      this.load.image('settingBtn', this.basicGraphUrl + '/settingBtn.png');

      this.load.image('panelBg', this.basicGraphUrl + '/game_panel_bg.png');
      this.load.image('panelBreak', this.basicGraphUrl + '/game_break_panel.png');
      this.load.image('panel', this.basicGraphUrl + '/game_panel.png');
      this.load.image('hero_weapon_bg', this.basicGraphUrl + '/hero_weapon_bg.png');
      this.load.image('enemy_weapon_bg', this.basicGraphUrl + '/enemy_weapon_bg.png');
      this.load.image('zhanshi_weapon', this.basicGraphUrl + '/hero_zhanshi_weapon_01.png');
      this.load.image('zhanshi_bullet', this.basicGraphUrl + '/hero_zhanshi_bullet_01.png');
      this.load.image('zhanshi', this.basicGraphUrl + '/hero_zhanshi_icon01.png');

      // 英雄dkbear
      this.load.image('dkbear', this.basicGraphUrl + '/dkbear.png');
      this.load.image('dkbear_weapon', this.basicGraphUrl + '/dkbear_weapon.png');
      this.load.image('dkbear_sk', this.basicGraphUrl + '/sk_dkbear.jpg');
      this.load.image('dk_bear_ani', this.basicGraphUrl + '/skill_dkbear_ani.png');

      // 英雄hc
      this.load.image('hc_logic', this.basicGraphUrl + '/hc_logic.png');
      this.load.image('hc_logic_weapon', this.basicGraphUrl + '/hc_logic_weapon.png');
      this.load.image('hc_logic_sk', this.basicGraphUrl + '/sk_hclogic.png');
      this.load.image('hc_logic_bullet', this.basicGraphUrl + '/hc_logic_bullet.png');

      // 英雄magic
      this.load.image('magic_jitong', this.basicGraphUrl + '/magic_jitong.png');

      this.load.image('border', this.basicGraphUrl + '/hero_health_border.png');
      this.load.image('health', this.basicGraphUrl + '/hero_health_rect.png');
      this.load.image('lolo_weapon', this.basicGraphUrl + '/enemy_lolo_weapon.png');
      this.load.image('lolo', this.basicGraphUrl + '/enemy_lolo_icon.png');

      this.load.image('effectHit', this.basicGraphUrl + '/effectLose.png')

      // 粒子texture
      this.load.image('blood', this.basicGraphUrl + '/Blood.png');

      // atlas
      this.load.atlas('skills', 'Parkour/assets/graphics/skills.png', '', skills);
    }

    addBackground () {
       this.bg = this.game.add.image(0, 0, 'preloader', 'BG0000');
    }

    addBgItem () {
        this.item = this.game.add.image(0, 0, 'preloader', 'BG_Items0000');
        this.item.anchor.set(.5);
        this.item.scale.set(1);
    }

    addPreloadBar () {
        this.outerPreloaderSprite = this.game.add.image(0, 0, 'preloader', 'Preloader_Back0000');
        this.outerPreloaderSprite.position.set(config.HALF_GAME_WIDTH, config.HALF_GAME_HEIGHT);
        this.outerPreloaderSprite.anchor.set(.5);
        this.innerPreloaderSprite = this.game.add.image(0, 0, 'preloader', 'Preloader_Front0000');
        this.innerPreloaderSprite.position.set(config.HALF_GAME_WIDTH - this.innerPreloaderSprite.width * .5 - 2,
            config.HALF_GAME_HEIGHT - this.innerPreloaderSprite.height * .5);
    }

    addLoadingInfo () {
        let loadingStyle = {
            font: '40px arial',
            fill: '#FFFFFF',
            align: 'center'
        };
        this.loadingText = this.game.add.text(0, 0, '', loadingStyle);
        this.loadingText.anchor.set(.5);
        this.loadingText.setShadow(4, 4, '#999');
        this.loadingText.position.set(config.HALF_GAME_WIDTH, config.HALF_GAME_HEIGHT + this.outerPreloaderSprite.height + 10);
        this.game.time.events.add(100, () => {
           this.loadingText.setText('loading...');
        });
    }

    loadUpdate () {
        this.loadingText.setText(this.load.progress + '%');
    }

    addCompanyInfo () {
        let info = '酷尼游戏@2019';
        let style = {
          font: '24px Verdana',
          fill: '#FFFFFF',
          align: 'center'
        };
        this.copyright = this.game.add.text(0, 0, info, style);
        this.copyright.lineSpacing = 10;
        this.copyright.anchor.set(.5);
        this.copyright.scale.set(config.WORLD_SCALE);
        this.copyright.position.set(config.HALF_GAME_WIDTH, config.GAME_HEIGHT - this.copyright.height);
        this.copyright.setShadow(2, 2, '#333');
    }

    resizeBackground () {
        this.bg.width = config.GAME_WIDTH;
        this.bg.height = config.GAME_HEIGHT;
    }

    resizeBgItem () {
        this.item.position.set(config.HALF_GAME_WIDTH, config.HALF_GAME_HEIGHT);
    }

    resize () {
        this.resizeBackground();
        this.resizeBgItem();
    }

    shutdown () {
        this.cache.removeImage('preloader', !0);
    }
}

export default preloader;