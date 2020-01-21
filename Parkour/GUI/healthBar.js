import SpriteUtil from '../Util/spriteUtil.js';

class HealthBar extends Phaser.Group {
  constructor(game, parent, config) {
    super(game, parent);
    this.generateBar(config);
    this.game = game;
    config.camp === 'tianhui' ? 
      this.position.set(0, (this.width - parent.width) * 0.5 - 4) : this.position.set(0, (this.width - parent.height) * 0.5 - 4);
    this.ROLEHEALTH = config.health;
    this.HBHEIGHT = this.children[1].height;
    this.config = config;
    this.updateHealth(config.health);
    this.angle = 90;
  }

  // 构建血条
  generateBar (config) {
    for (let key of config.keys) {
      SpriteUtil.addSprite(
        {
          key
        },
        this,
        1,
        0, 0,
        [0.5, 1]
      );
    }
    this.children[0].y = this.children[0].height * 0.5;
    this.children[1].y = this.children[1].height * 0.5;
  }

  // 更新血条数值
  updateHealth(health) {
    if (health >= this.config.health) {
      health = this.config.health;
    }
    return this.game.add.tween(this.children[1]).to({
      height: this.HBHEIGHT * health / this.ROLEHEALTH
    }, 400, Phaser.Easing.Bounce.Out, !0, 0);
  }
};

export default HealthBar;