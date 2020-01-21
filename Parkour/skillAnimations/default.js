// 英雄初始技能
class defaultSkill {
  constructor () {
    return this;
  }

  dkbearAni(parent, generator, game) {
    const dkbearAni = generator(
      {
        key: 'dk_bear_ani'
      },
      parent,
      0.5, 0, 0, 0.5
    );
    dkbearAni.visible = !1;
    const tween = game.add.tween(dkbearAni.scale).to({
      x: 2,
      y: 2
    }, 300, Phaser.Easing.Bounce.Out, !1);
    tween.onComplete.add(() => {
      dkbearAni.visible = !1;
    });
    dkbearAni.start = () => {
      dkbearAni.scale.set(0.5);
      dkbearAni.visible = !0;
      tween.start();
    };
    return dkbearAni;
  }

  hclogicAni (parent, generator, game) {
    const hclogicAni = generator(
      {
        key: 'dk_bear_ani'
      },
      parent,
      0.5, 0, 0, 0.5
    );
    hclogicAni.visible = !1;
    hclogicAni.start = () => {
        console.log('加血！');
      }
    return hclogicAni;
  }
}

export default defaultSkill;