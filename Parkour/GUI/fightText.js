import _ from '../../js/libs/lodash.js';
class fightText extends Phaser.Group {
  constructor (game, parent) {
    super(game, parent);
    this.baseStyle = {
      font: '40px Verdana',
      fill: '#e86767',
      stroke: '#ffffff',
      strokeThickness: 4,
      align: 'center',
      fontWeight: 'bold'
    }
    this.game = game;
    this.parent = parent;
    this.generateText();
  }

  // 构建提示文字对象池
  generateText () {
    for (let i = 0, l = 10; i < l; i++) {
      const tipText = this.game.add.text(0, -120, 0, this.baseStyle);
      tipText.anchor.set(0.5);
      this.add(tipText);
      this.resetText(tipText);
    }
  }

  setTextTween (damage, color, crit, icon) {
    let bootText = _.find(this.children, (c) => {
      return c.visible === !1;
    });
    bootText.visible = !0;
    this.setColor(color || '#C03030', bootText);
    let popY = 90 + (Math.abs(damage) || 500) / 15;
    color && (popY = 140);
    crit && (damage = '暴击 ' + damage);
    bootText.setText(damage);
    crit && this.game.add.tween(bootText.scale).to({
      x: 1.1,
      y: 0.9
    }, 800, Phaser.Easing.Bounce.In, !0, 0);
    if (icon) {
      icon.visible = !0;
      popY -= icon.height + 10;
      icon.x -= bootText.width * 0.5 + icon.width;
      this.game.add.tween(icon).to({
        y: bootText.y - popY,
        alpha: 0.8
      }, 1000, Phaser.Easing.Back.Out, !0, 0).onComplete.addOnce(() => {
        icon && this.resetIcon(icon);
      });
    }
    this.game.add.tween(bootText).to({
      y: bootText.y - popY,
      alpha: 0.8
    }, 1000, Phaser.Easing.Back.Out, !0, 0).onComplete.addOnce(() => {
      this.resetText(bootText);
    });
  }

  setColor(c, bootText) {
    bootText.fill = c;
  }

  resetIcon (icon) {
    if (icon) {
      icon.visible = !1;
      icon.alpha = 1;
      icon.position.set(0, -120);
    }
  }

  resetText (text) {
    text.visible = !1;
    text.alpha = 1;
    text.scale.set(1);
    text.position.set(0, -120);
  }
}

export default fightText;