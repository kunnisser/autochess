class panelBreakParticles extends Phaser.Group {
  constructor(game, parent) {
    super(game, parent);
    this.game = game;
    this.parent = parent;
    this.addParticles();
    this.getParticle();
  }

  // 批量创建粒子
  addParticles() {
    this.createMultiple(50, 'blood', null);
    this.breakGp = this.game.add.group(this, 'breakGp');
    this.breakGp.x = 0;
    this.breakGp.y = 0;
    this.breakGp.createMultiple(4, 'panelBreak', null, !1);
  }

  breakPanel () {
    const dropY = 500,
    dropDuration = 1500;
    const dir = Phaser.Utils.randomChoice(1, -1);
    for (let [index, bgp] of this.breakGp.children.entries()) {
      bgp.exists = !0;
      bgp.scale.set(0.85);
      bgp.anchor.set(0.5);
      bgp.position.set(bgp.width * 0.5 * index, -bgp.width * 0.5 * index);
      index === 3 && (bgp.x = bgp.width * 0.5, bgp.y = bgp.width * 0.5);
      index === 2 && (bgp.y = 0);
      bgp.angle = index * 90;
      bgp.alpha = 1;
      this.game.add.tween(bgp).to({
        x: '' + this.game.rnd.realInRange(-300, 300),
        y: '' + dropY,
        angle: '' + dir * 90,
        alpha: 0.35
      }, dropDuration, Phaser.Easing.Quartic.Out, !0, 0);
      this.game.add.tween(bgp.scale).to({
        x: 0,
        y: 0
      }, dropDuration, Phaser.Easing.Cubic.Out, !0, 0).onComplete.addOnce(() => {
        bgp.exists = !1;
      })
    }
  }

  // 生成粒子
  emitParticle(num, leftBound, rightBound, y) {
    for (let i = 0; i < num; i++) {
      let currentPtc = this.getParticle();
      currentPtc.x = this.game.rnd.realInRange(leftBound, rightBound);
      currentPtc.y = y;
      currentPtc.exists = !0;
      currentPtc.anchor.set(0.5);
      currentPtc.scale.set(this.game.rnd.realInRange(0.45, 1));
      currentPtc.alpha = 1;
      currentPtc.angle = this.game.rnd.realInRange(0, 180);
      this.tweenParticle(currentPtc);
    }
  }

  // 粒子动画
  tweenParticle(cptc) {
    const duration = this.game.rnd.realInRange(1.5e3, 2000), //随机补间时间
      direct = Phaser.Utils.randomChoice(1, -1), // 方向
      angle = this.game.rnd.realInRange(50, 80), // 旋转区间
      deepY = this.game.rnd.realInRange(-750, 600), // 下落区间
      boomX = this.game.rnd.realInRange(-750, 750);
    this.game.add.tween(cptc).to({
      y: '' + deepY,
      angle: '' + direct + angle
    }, duration, Phaser.Easing.Linear.None, !0);
    this.game.add.tween(cptc).to({
      x: '' + boomX,
      angle: '' + direct + angle
    }, duration, Phaser.Easing.Linear.None, !0);
    this.game.add.tween(cptc.scale).to({
      x: 0.1,
      y: 0.1
    }, duration, Phaser.Easing.Cubic.Out, !0);
    this.game.add.tween(cptc).to({
      alpha: 0
    }, duration, Phaser.Easing.Cubic.Out, !0).onComplete.addOnce(() => {
      cptc.exists = !1;
    });

  }

  getParticle() {
    let particle = this.getFirstExists(!1);
    return particle || this.create(0, 0, 'blood', null);
  }

  destroy() {
    this.game = null;
    this.parent = null;
    this.children = null;
  }
}

export default panelBreakParticles;