import SpriteUtil from '../Util/spriteUtil.js';
import HealthBar from '../GUI/healthBar.js';
import FightText from '../GUI/fightText.js';
import { beastRoles, rejuvenateRoles, magicRoles} from '../roles/heroRoles.js';
import PanelBreakParticles from '../Particle/panelBreakParticles.js';
import bossRoles from '../roles/enemyRoles.js';

class SceneFight extends Phaser.State {
  init(params) {
    this.fromPreload = params.param;
    this.overlay = params.overlay;
    // 初始化英雄对象
    this.heros = [];
    // 初始化敌人对象
    this.enemys = [];
    // 初始化 添加元素函数
    this.addSprite = SpriteUtil.addSprite;
    this.gameEnd = !1;
  }

  create() {
    this.hideOverlay();
    this.addBackground();
    this.resizeBackground();
    this.addPanels();
    const dkBear = beastRoles[0];
    dkBear.posX = 0;
    dkBear.posY = 1;
    const hcLogic = rejuvenateRoles[0];
    hcLogic.posX = 0;
    hcLogic.posY = 0;
    const magicJitong = magicRoles[0];
    magicJitong.posX = 0;
    magicJitong.posY = 2;

    let enemyData = [bossRoles[0]];
    for (let ed of enemyData) {
      this.generateEnemys(ed);
    }
    let heroData = [dkBear, hcLogic, magicJitong];
    for (let hd of heroData) {
      this.generateHeros(hd);
    }
    // 开始检测目标
    this.game.time.events.add(200, () => {
      for (let hero of this.heros) {
        this.CheckTarget(hero, this.enemys);
      }
    });
    this.game.time.events.add(500, () => {
      for (let enemy of this.enemys) {
        this.CheckTarget(enemy, this.heros);
      }
    });
  }

  addBackground() {
    this.bg = this.game.add.image(-10, -10, 'levelBg', null, this.world);
  }

  resizeBackground() {
    this.bg.width = gameConfig.GAME_WIDTH + 20;
    this.bg.height = gameConfig.GAME_HEIGHT + 20;
    this.game.world.setBounds(-10, -10, this.bg.width, this.bg.height);
    this.effectHit = this.game.add.image(0, 0, 'effectHit', this.world);
    this.effectHit.width = this.bg.width;
    this.effectHit.height = this.bg.height;
    this.effectHit.alpha = 0;
  }

  shakeScreen(tempTarget) {
    const shakeOffset = 100;
    this.game.add.tween(this.game.camera).to({
      x: this.game.camera.x - shakeOffset
    }, 30, Phaser.Easing.Bounce.InOut, !0, 0, 4, !0);
    this.game.add.tween(this.game.camera).to({
      y: this.game.camera.y - shakeOffset
    }, 50, Phaser.Easing.Bounce.InOut, !0, 0, 4, !0);
    this.game.add.tween(this.effectHit).to({
      alpha: 1
    }, 80, Phaser.Easing.Bounce.InOut, !0, 0, 1, !0).onComplete.addOnce(() => {
      this.effectHit.alpha = 0;
    });
  }

// 添加棋格
  addPanels () {
    this.gamePanelGp = this.game.add.group(this.world, 'panelGp');
    this.gamePanelGp.position.set(gameConfig.HALF_GAME_WIDTH, gameConfig.HALF_GAME_HEIGHT + 50);
    this.panelBgsX = [];
    this.panelBgs = [];
    this.gamePanelGp.createMultiple(18, 'panelBg');
    for (let [i, bg] of this.gamePanelGp.children.entries()) {
      bg.reset((bg.width + 10) * (-2.5 + (i % 6)), (bg.height + 10) * (-1 + Math.floor(i / 6)));
      bg.anchor.set(0.5);
      this.panelBgsX.push(bg);
      if (i % 6 === 5) {
        this.panelBgs.push(this.panelBgsX);
        this.panelBgsX = [];
      }
    }

    // 添加break 粒子
    this.particle = new PanelBreakParticles(this.game, this.gamePanelGp);
  }

// 创建英雄团队
  generateHeros (role) {
    // 建立英雄池
    this.heroGroup = this.game.add.group(this.gamePanelGp, 'hero');
    const currentPos = this.panelBgs[role.posY][role.posX];
    this.heroGroup.position.set(currentPos.x,
      currentPos.y);
    this.heroBg = this.addSprite(
      {
        key: 'panel'
      },
      this.heroGroup,
      1,
      0, 0,
      0.5);
      this.zhanshi = this.addSprite(
        {
          key: role.type
        },
        this.heroGroup,
        1,
        0, 0,
        0.5
      );

    const name = this.game.add.text(0, 0, role.name, {
      font: '32px Verdana',
      fill: '#ccccc',
      stroke: '#ffffff',
      strokeThickness: 4,
      fontWeight: 'bold'
    });

    this.heroGroup.add(name);
    name.anchor.set(0.5);
    name.position.set(0, this.heroGroup.height * 0.42);

    const heroHealth = new HealthBar(this.game, this.heroGroup, {camp: 'tianhui', keys: ['border', 'health'], health: role.health});

    const fightText = new FightText(this.game, this.gamePanelGp);
    fightText.position.set(this.heroGroup.x, this.heroGroup.y);
    const skills = role.skills;
    const skillIcons = this.game.add.group(this.heroGroup, 'heroSkillIcon');
    const skillAnimations = this.game.add.group(this.heroGroup, 'heroSkillAnimation');
    skillIcons.position.set(0, 0);
    skillAnimations.position.set(0, 0);
    for (let [i, sk] of skills.entries()) {
      // 构建该角色技能图标
      const sk_icon = this.addSprite(
        {
          key: sk.icon
        },
        this.heroGroup,
        0.5,
        0, -120,
        0.5
      );
      sk_icon['role'] = sk;
      sk_icon.visible = !1;
      skillIcons.add(sk_icon);
      // 生成技能特效
      sk.animation(skillAnimations, this.addSprite, this.game);
    }

    const bullets = this.game.add.group(this.heroGroup, role.bullet);
    // // 射击间隔
    bullets.ShootingSpace = role.ShootingSpace;
    // 射击初始时间戳
    bullets.ShootTimer = 0;
    // 射击速度
    bullets.SPEED = role.speed;
    bullets.enableBody = !0;
    bullets.position.set(this.heroBg.x, this.heroBg.y);
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(10, role.bullet);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', !0);
    bullets.setAll('checkWorldBounds', !0);

    // 近战初始时间戳
    const aspdTime = 0;

    this.heros.push({
      role,
      health: heroHealth,
      entity: this.heroGroup,
      tipText: fightText,
      hasTarget: !1,
      skillIcons,
      skillAnimations,
      bullets,
      aspdTime
    });
  }

  // 创建敌人团队
  generateEnemys (role) {
    const aspdTime = 0;
    // 建立怪兽池
    this.enemyGroup = this.game.add.group(this.gamePanelGp, 'enemy');
    const currentPos = this.panelBgs[role.posY][role.posX];
    this.enemyGroup.position.set(currentPos.x,
      currentPos.y);
    this.enemyBg = this.addSprite(
      {
        key: 'panel'
      },
      this.enemyGroup,
      1,
      0, 0,
      0.5);
    this.enemyIcon = this.addSprite(
      {
        key: role.type
      },
      this.enemyGroup,
      1,
      0, 0,
      0.5
    );

    this.game.physics.enable(this.enemyIcon, Phaser.Physics.ARCADE);

    // 名称
    const name = this.game.add.text(0, 0, role.name, {
      font: '32px Verdana',
      fill: '#ccccc',
      stroke: '#ffffff',
      strokeThickness:  4,
      fontWeight: 'bold'
    });

    this.enemyGroup.add(name);
    name.anchor.set(0.5);
    name.position.set(0, this.enemyGroup.height * 0.4);

    const enemyHealth = new HealthBar(this.game, this.enemyGroup, {camp: 'yeyan', keys: ['border', 'health'], health: role.health});

    const fightText = new FightText(this.game, this.gamePanelGp);
    fightText.position.set(this.enemyGroup.x, this.enemyGroup.y);

    this.enemys.push({
      role,
      health: enemyHealth,
      entity: this.enemyGroup,
      tipText: fightText,
      aspdTime,
      hasTarget: !1
    });
  }

  // 检测对方目标 @Function
  CheckTarget(part, roles) {
    const role = part.role;
    const aroundPos = [
      [role.posX, role.posY + 1],
      [role.posX, role.posY - 1],
      [role.posX + 1, role.posY],
      [role.posX - 1, role.posY]
    ];

    part.hasTarget = role.camp === 'tianhui' ? this.searchTarget(aroundPos, this.enemys, role.distance) : this.searchTarget(aroundPos, this.heros, role.distance);

    if (!part.hasTarget) {
      // 开始寻敌
      let entity = part.entity;
      const step = role.camp === 'tianhui' ? this.searchTargetOut(0, part, this.enemys, this.heros) : this.searchTargetOut(0, part, this.heros, this.enemys ) ;
      // 判断前进格子是否为友军
      // 更新英雄序号
      if (step === 1) {
        this.stepX = role.camp === 'tianhui' ? this.panelBgs[role.posY][role.posX + 1].x : this.panelBgs[role.posY][role.posX - 1].x;
        this.stepY = part.y;
        part.role.posX = role.camp === 'tianhui' ? role.posX + 1 : role.posX - 1;
      } else if (step === 2) {
        this.stepX = part.x;
        this.stepY = this.panelBgs[role.posY + 1][role.posX].y;
        part.role.posY = role.posY + 1;
      } else {
        this.stepX = part.x;
        this.stepY = this.panelBgs[role.posY - 1][role.posX].y;
        part.role.posY = role.posY - 1;
      }
      this.game.add.tween(entity).to({
        x: this.stepX,
        y: this.stepY
      }, 660, Phaser.Easing.Cubic.Out, !0, 0).onComplete.addOnce(() => {
        // 同步文字提示位置
        part.tipText.x = entity.x;
        part.tipText.y = entity.y;
        // 提高文字提示z-index
        this.gamePanelGp.bringToTop(part.tipText);
        // 再次检测
        if (part.role.posX <= 5 && part.role.posX >= 0) {
          this.CheckTarget(part, roles);
        }
      });
    }
    else { 
    // 拥有对象目标进行战斗
      const weapon = part.weapon;
      const entity = part.entity;
      const target = part.hasTarget;
      const type = role.camp === 'tianhui' ? -1 : 1;
      let direct = 0;
      let scaleX = 1;
      let [akPosX, akPosY] = [0, 0];
      if (part.role.posY > target.role.posY) {
        direct = 2;
        akPosX = 0;
        akPosY = part.hasTarget.entity.height * 0.38;
      } else if (part.role.posY < target.role.posY) {
        direct = 3;
        akPosX = 0;
        akPosY = -part.hasTarget.entity.height * 0.38;
      } else if (part.role.posX > target.role.posX) {
        direct = 4;
        akPosX = part.hasTarget.entity.width * 0.38;
        akPosY = 0;
      } else {
        direct = 1;
        akPosX = -part.hasTarget.entity.width * 0.38;
        akPosY = 0;
      }
      
      const action_dir = this.checkDirect(direct, type, entity);
      const action_scale = this.checkDirect(direct, type, entity, 'scale');

      const tempTarget = part.hasTarget;
      part.attack = this.game.add.tween(part.entity).to(action_dir, 200, Phaser.Easing.Back.In, !1, 200, 0, !0);
      part.attackShake = this.game.add.tween(part.entity.scale).to(action_scale, 200, Phaser.Easing.Elastic.In, !1, 200, 0, !0)
      part.attack.onRepeat.add(() => {
        if (part.hasTarget) {
          // 设定普攻伤害值
          let currentDamage = 0;
          part['DamageTip'] = 0;
          currentDamage = this.game.rnd.between(part.role.attackDamage[0], part.role.attackDamage[1]);
          const isCrit = Math.random() * 100 <= part.role.crit;
          currentDamage = isCrit ? parseInt(currentDamage * part.role.critVal) : currentDamage;
          part.DamageTip = currentDamage;
          part.isCrit = isCrit;
          // 近战攻击特效
          if (!part.role.distance) {
            this.bootSkill(part, part.hasTarget);
            if (!part.releaseSk) {
              this.attackEffect(part, roles);
              let attackSk = part.role.attackSkill;
              if (part.role.camp === 'tianhui' && !attackSk && part.hasTarget) {
                attackSk = this.addSprite({
                  key: 'skills'
                },
                  part.hasTarget.entity,
                  [-1.5, 1.5],
                  akPosX, akPosY,
                  0.5);
                attackSk.angle = -30;
                attackSk.animations.add('attack', Phaser.Animation.generateFrameNames('ha_atk_', 0, 4, '.png', 2), 12, false);
              }
              if (part.role.camp === 'yeyan' && !attackSk && part.hasTarget) {
                attackSk = this.addSprite({
                  key: 'skills'
                },
                  part.hasTarget.entity,
                  1,
                  akPosX, akPosY,
                  0.5);
                attackSk.animations.add('attack', Phaser.Animation.generateFrameNames('a_sk_', 0, 4, '.png', 2), 12, false);
              }
              attackSk && (attackSk.visible = !0, attackSk.animations.play('attack').onComplete.addOnce(() => {
                attackSk.visible = !1;
              }));
            }
          }
          this.checkPlayerAlive(part, roles);
        }
      });
    }
  }

  bootSkill(part, tempTarget) {
    let trigger = false;
    // 执行被动技能
    if (tempTarget.skillIcons) {
      for (let [skindex, sksc] of tempTarget.skillIcons.children.entries()) {
        trigger = this.skRandom(sksc.role.chance);
        if (trigger && sksc.role.type === 'defense') {
          // 执行技能动画
          tempTarget.skillAnimations.children[skindex].start();
          // 执行技能扣血规则
          sksc.role.action(part, tempTarget, null, sksc);
          part.releaseSk = trigger;
          return;
        }
      }
    }
    // 执行主动技能
    // if (part.skillIcons) {
    //   for (let [skindex, sksc] of part.skillIcons.children.entries()) {
    //     trigger = this.skRandom(sksc.role.chance);
    //     if (trigger && sksc.role.type === 'attack') {
    //       // 执行技能动画
    //       part.skillAnimations.children[skindex].start();
    //       // 执行技能扣血规则
    //       sksc.role.action(part, tempTarget, null, sksc);
    //       part.releaseSk = trigger;
    //       return;
    //     }
    //   }
    // }
    part.releaseSk = trigger;
  }

  attackEffect(part, roles) {
    part.role.camp === 'tianhui' && console.log('石头人伤害', part.DamageTip);
    part.hasTarget && (part.hasTarget.role.health -= part.DamageTip);
    // 执行伤害
    (part.hasTarget.tipText.setTextTween(part.DamageTip, null, part.isCrit),
    part.hasTarget.health.updateHealth(part.hasTarget.role.health));
  }

  checkPlayerAlive (part, roles) {
    if (part.hasTarget && part.hasTarget.role.health > 0) {
      part.hasTarget.entity.children[1].blendMode = Phaser.blendModes.ADD;
      this.game.time.events.add(200, () => {
        part.hasTarget.entity.children[1].blendMode = Phaser.blendModes.NORMAL;
      });
      return true;
    } else {
      // 敌人已消灭
      // 将消灭的对象从对象数组池去掉
      roles.splice(roles.findIndex((r) => {
        return r.role.health <= 0;
      }), 1);
      const tempTarget = part.hasTarget;
      // 被消灭对象状态为死亡
      part.hasTarget.entity.alive = !1;
      // 将胜利对象的目标清空
      part.hasTarget = null;
      console.log(part.role.name + '消灭了：' + tempTarget.role.name);
      // 对象被消灭动画
      tempTarget && tempTarget.health.updateHealth(0).onComplete.addOnce(() => {
        // 将消灭对象从Group中去掉
        // this.game.add.tween(tempTarget.entity.scale).to({
        //   x: 0.6,
        //   y: 0.6
        // }, 100, Phaser.Easing.Back.Out, !0, 0, 3, !0).onComplete.addOnce(() => {
        // });
        this.particle.position.set(tempTarget.entity.x, tempTarget.entity.y);
        this.gamePanelGp.remove(tempTarget.entity, !0);
        this.shakeScreen(tempTarget);
        this.particle.emitParticle(20, -100, 100, 0);
        this.particle.breakPanel();
        // 检测下一个目标
        this.gameEnd || part.entity.alive && this.CheckTarget(part, roles);
      });
      if (roles.length === 0) {
        this.gameEnd = !0;
        console.log('战斗结束');
      }
      return false;
    }
  }

  // 寻敌函数
  findTarget (role, lev) {
    let findPos = [];
    for (let i = -lev, l = lev; i <= l; i++) {
      for (let j = - lev, k = lev; j <= k; j++) {
        findPos.push([role.posX + i, role.posY + j]);
      }
    }
    return findPos;
  }

  // 检索目标是否存在
  searchTarget (indexs, targets, distance) {
    let target = null;
    for (let index of indexs) {
      const tempTarget = _.find(targets, (t) => {
        if (distance) {
          return Math.abs(index[0] - t.role.posX) <= distance;
        } else {
          return t.role.posX === index[0] && t.role.posY === index[1];
        }
      });
      if (tempTarget) {
        target = tempTarget;
        return target;
      }
    }
  }

  // 向外扩散检索三层
  searchTargetOut (lev, roleObj, targets, mates) {
    let levs = lev;
    levs += 1;
    const target = this.searchTarget(this.findTarget(roleObj.role, levs), targets);
    if (!target) {
      if (levs >= 2) {
        return 1;
      } else {
        const step = this.searchTargetOut(levs, roleObj, targets, mates);
        return step;
      }
    } else {
      console.log('finded');
      levs = 1;
      if (roleObj.role.camp === 'tianhui') {
          // 横向没有超过目标
        if (target.role.posX > roleObj.role.posX) {
          // 检查正前方有友军
          if (this.searchTarget([[roleObj.role.posX + 1, roleObj.role.posY], [roleObj.role.posX + 2, roleObj.role.posY]], mates)) {
            if (roleObj.role.posY === 0) {
              return 2;
            }
            if (roleObj.role.posY === 2) {
              return 3;
            }
            if (this.searchTarget([[roleObj.role.posX, roleObj.role.posY - 1], [roleObj.role.posX + 1, roleObj.role.posY - 1], [roleObj.role.posX + 2, roleObj.role.posY - 1]], mates)) {
              console.log('向下');
              return 2;
            }
            if (this.searchTarget([[roleObj.role.posX, roleObj.role.posY + 1], [roleObj.role.posX + 1, roleObj.role.posY + 1], [roleObj.role.posX + 2, roleObj.role.posY + 1]], mates)) {
              console.log('向上');
              return 3;
            }
          } else {
            return 1;
          }
        } else if (target.role.posY > roleObj.role.posY) {
          // 横向超过目标
          // 下有友军
          if (this.searchTarget([[roleObj.role.posX, roleObj.role.posY + 1]], mates)) {
            return 1;
          } else {
            return 2;
          }
        } else {
          // 上有友军
          if (this.searchTarget([[roleObj.role.posX, roleObj.role.posY - 1]], mates)) {
            return 1;
          } else {
            return 3;
          }
        }
      } else {
        // 横向没有超过目标
        if (target.role.posX < roleObj.role.posX) {
          // 检查正前方有友军
          if (this.searchTarget([[roleObj.role.posX - 1, roleObj.role.posY], [roleObj.role.posX - 2, roleObj.role.posY]], mates)) {
            if (roleObj.role.posY === 0) {
              return 2;
            }
            if (roleObj.role.posY === 2) {
              return 3;
            }
            if (this.searchTarget([[roleObj.role.posX, roleObj.role.posY - 1], [roleObj.role.posX - 1, roleObj.role.posY - 1], [roleObj.role.posX - 2, roleObj.role.posY - 1]], mates)) {
              return 2;
            }
            if (this.searchTarget([[roleObj.role.posX, roleObj.role.posY + 1], [roleObj.role.posX - 1, roleObj.role.posY + 1], [roleObj.role.posX - 2, roleObj.role.posY + 1]], mates)) {
              return 3;
            }
          } else {
            return 1;
          }
        } else if (target.role.posY > roleObj.role.posY) {
          // 横向超过目标
          // 下有友军
          if (this.searchTarget([[roleObj.role.posX, roleObj.role.posY + 1]], mates)) {
            return 1;
          } else {
            return 2;
          }
        } else {
          // 上有友军
          if (this.searchTarget([[roleObj.role.posX, roleObj.role.posY - 1]], mates)) {
            return 1;
          } else {
            return 3;
          }
        }
      }
    }
  }

  // 检测面向 @Function
  checkDirect (direct, type, entity, scale) {
    const [attack_dt, attack_angle] = [10, 3];
    const [scale_x, scale_y] = [1.05, 0.95];
    switch (direct) {
      case 1:
      if (scale) {
        return {
          x: entity.scale.x * scale_x,
          y: entity.scale.y * scale_y
        };
      } else {
        return {
          x: entity.x + attack_dt,
          angle: attack_angle
        };
      }
      case 2:
        if (scale) {
          return {
            x: entity.scale.x * scale_x,
            y: entity.scale.y * scale_y
          };
        } else {
          return type === 1 ? {
            y: entity.y + attack_dt
          } : {
              y: entity.y - attack_dt,
              angle: -attack_angle
          };
        }
      case 3:
        if (scale) {
          return {
            x: entity.scale.x * scale_x,
            y: entity.scale.y * scale_y
          };
        } else {
          return type === 1 ? {
            y: entity.y - attack_dt
          } : {
              y: entity.y + attack_dt,
              angle: attack_angle
          };
        }
      case 4: 
        if (scale) {
          return {
            x: entity.scale.x * scale_x,
            y: entity.scale.y * scale_y
          };
        } else {
          return {
            x: entity.x - attack_dt,
            angle: -attack_angle
          };
        }
      default:
        if (scale) {
          return {
            x: entity.scale.x * scale_x,
            y: entity.scale.y * scale_y
          };
        } else {
          return { x: entity.x + attack_dt,
            angle: attack_angle};
        }
    }
  }

  // 远程子弹
  roleShooting(part) {
    if (this.game.time.now > part.bullets.ShootTimer && part.bullets) {
      this.bootSkill(part, part.hasTarget);
      part.attack.start();
      part.attackShake.start();
      // 子弹池中拿取子弹
      if (!part.releaseSk) {
        const bullet = part.bullets.getFirstExists(!1);
        if (bullet) {
          this.game.time.events.add(200, () => {
            bullet.reset(0, 20);
            const shootRotation = this.game.physics.arcade.angleBetween(part.entity, part.hasTarget.entity);
            const shootAngle = 180 / Math.PI * shootRotation;
            bullet.rotation = shootRotation;
            this.game.physics.arcade.velocityFromAngle(shootAngle, part.bullets.SPEED, bullet.body.velocity);
          });
        } 
      }
      part.bullets.ShootTimer = this.game.time.now + part.bullets.ShootingSpace;
    }
  }

  // 近战攻击
  roleAttacking (part) {
    if (this.game.time.now > part.aspdTime) {
      part.aspdTime = this.game.time.now + part.role.aspd;
      part.attack.start();
      part.attackShake.start();
    }
  }

  update () {
    // tianhui方搜寻目标规则
    for (let hero of this.heros) {
      // 远程英雄搜寻目标后，目标存活后执行
      if (hero.hasTarget && hero.role.distance && hero.hasTarget.role.health > 0) {
        // 寻敌后，延迟发射时间
        if (hero.bullets.ShootTimer > hero.role.ShootingSpace) {
          this.roleShooting(hero);
          // 检测碰撞
          this.game.physics.arcade.overlap(hero.bullets, hero.hasTarget.entity.children[1], (target, bullet) => {
            this.heroHit(target, bullet, hero);
          }, null, this);
        } else {
          hero.bullets.ShootTimer += this.game.time.elapsedMS;
        }
      }
      // 近战英雄搜寻目标后
      if (hero.hasTarget && !hero.role.distance) {
        this.roleAttacking(hero);
      }
    }
    // yeyan方搜寻目标规则
    for (let emeny of this.enemys) {
      if (emeny.hasTarget && !emeny.role.distance && emeny.hasTarget.role.health > 0) {
        this.roleAttacking(emeny);
      }
    }
  }

  heroHit (target, bullet, hero) {
    bullet.kill();
    this.attackEffect(hero, this.enemys);
  }

  setBossAction () {
    this.game.add.tween(this.boss).to({
      angle: 180,
      y: gameConfig.HALF_GAME_HEIGHT * 1.5
    }, 1500, Phaser.Easing.Linear.None, !0, 500, 1e3, !0);
  }

  // 技能随机概率
  skRandom (chance) {
    const rdFlag = Math.random() * 100;
    if (rdFlag <= chance) {
      return true
    } else {
      return false;
    }
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

export default SceneFight;