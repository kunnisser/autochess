import SimpleButton from '../GUI/SimpleButton.js';
import Cards from '../GUI/cards.js';

class Menu extends Phaser.State {
  init (params) {
    this.fromPreload = params.param;
    this.overlay = params.overlay;
  }
  
  create () {
    this.hideOverlay();
    this.addMenuBg();
    this.addUIButtons();
  }

  addMenuBg () {
    const menuBg = this.game.add.image(0, 0, 'menuBg', null, this.world);
    menuBg.width = gameConfig.GAME_WIDTH;
    menuBg.height = gameConfig.GAME_HEIGHT;
  }

  addUIButtons () {
    this.btnsGp = this.game.add.group(this.world, 'menuBtns');
    this.addSettingBtn();
    this.addRankBtn();
    this.addCardBtn();
    this.addTitle(this.btnsGp);
    this.initCards();
  }

  initCards () {
    this.cards = new Cards(this.game, this.world);
    this.cards.position.set(gameConfig.HALF_GAME_WIDTH, gameConfig.HALF_GAME_HEIGHT);
    this.cards.visible = !1;
  }

  addSettingBtn () {
    const settingBtn = this.generateBtns(0, 0, 'settingBtn');
    settingBtn.position.set(settingBtn.width * 0.75, settingBtn.height * 0.75);
  }

  addRankBtn() {
    const rankBtn = this.generateBtns(0, 0, 'rankBtn');
    rankBtn.position.set(rankBtn.width * 0.75, gameConfig.GAME_HEIGHT - rankBtn.height * 0.75);
  }

  addCardBtn() {
    const cardBtn = this.generateBtns(0, 0, 'cardBtn');
    cardBtn.position.set(this.btnsGp.children[1].x + cardBtn.width * 1.25, this.btnsGp.children[1].y);
  }

  generateBtns (x, y, key) {
    const btn = new SimpleButton(this.game, x, y, key);
    this.btnsGp.add(btn);
    return btn;
  }

  addTitle (btnsGp) {
    const titleGp = this.game.add.group(this.world, 'titleGp');
    this.world.swap(titleGp, btnsGp);
    const titleBg = this.game.add.image(gameConfig.HALF_GAME_WIDTH, gameConfig.HALF_GAME_HEIGHT, 'titleBg', null, titleGp);
    titleBg.anchor.set(0.5);
    titleBg.scale.set(1.5);
    const titleWeapon_lf = this.game.add.image(titleBg.x, titleBg.y - 50, 'titleWeapon01', null, titleGp);
    const titleWeapon_rt = this.game.add.image(titleBg.x, titleBg.y - 50, 'titleWeapon02', null, titleGp);
    titleWeapon_lf.anchor.set(0.5);
    titleWeapon_lf.alpha = 0;
    titleWeapon_lf.x = titleBg.x - titleBg.width * 0.5;
    titleWeapon_rt.anchor.set(0.5);
    titleWeapon_rt.alpha = 0;
    titleWeapon_rt.x = titleBg.x + titleBg.width * 0.5;

    const titleText = this.game.add.image(titleBg.x, titleBg.y, 'titleText', null, titleGp);
    titleText.anchor.set(0.5);
    titleText.y = gameConfig.GAME_HEIGHT

    const startBtn = this.generateBtns(0, 0, 'startBtn');
    startBtn.position.set(titleBg.x, titleBg.y + startBtn.height * 0.5);
    titleGp.y -= startBtn.height * 0.5; 
    startBtn.anchor.set(0.5);

    startBtn.callback.addOnce(() => {
      this.game.changeState('fight_scene', !0);
    });

    this.game.add.tween(titleText).to({
      y: titleBg.y + titleText.height * 0.5
    }, 400, Phaser.Easing.Cubic.Out, !0, 200).onComplete.addOnce(() => {
      this.game.add.tween(titleWeapon_lf).to({
        alpha: 1,
        x: titleBg.x - titleWeapon_lf.width * 0.5
      }, 650, Phaser.Easing.Bounce.Out, !0, 0);
      this.game.add.tween(titleWeapon_rt).to({
        alpha: 1,
        x: titleBg.x + titleWeapon_rt.width * 0.5
      }, 550, Phaser.Easing.Bounce.Out, !0, 100).onComplete.addOnce(() => {
        this.game.add.tween(titleWeapon_lf).to({
          x: titleWeapon_lf.x + titleWeapon_lf.width * 0.1,
          angle: 10
        }, 800, Phaser.Easing.Back.Out, !0, 200, 1e3, !0);
        this.game.add.tween(titleWeapon_rt).to({
          x: titleWeapon_rt.x - titleWeapon_rt.width * 0.1,
          angle: -10
        }, 800, Phaser.Easing.Back.Out, !0, 400, 1e3, !0);
      });
    });
  }

  // 隐藏转场遮罩层
  hideOverlay() {
    this.hideLayTween = this.game.add.tween(this.overlay).to({
      alpha: 0
    }, 400, Phaser.Easing.Cubic.Out, !0);
    this.hideLayTween.onComplete.addOnce(() => {
      this.overlay.visible = !1;
    });
  }
}

export default Menu;