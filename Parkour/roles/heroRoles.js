/*
英雄种类
@param name 【role名称】
@param type 【sprite key】
@param weapon 【武器】
@param bullet 【子弹】
@param health 【血量】
@param 
*/

import heroSkillAni from '../skillAnimations/default.js';

const hsAnis = new heroSkillAni();

const reBoundTipColor = '#2fa4e7';
const treatTipColor = '#15B547';

// 反伤逻辑
const skill_00 = (self, target, meta, icon) => {
  self.role.health -= self.DamageTip;
  self.health.updateHealth(self.role.health);
  self.tipText.setTextTween(-self.DamageTip, reBoundTipColor);
  target.tipText.setTextTween(icon.role.name, reBoundTipColor, false, icon);
};

// 加血逻辑
const sill_10_addVal = 0.3;
const skill_10 = (self, target, meta, icon) => {
  if (target.hasTarget) {
    const addVal = parseInt(self.role.health * sill_10_addVal);
    target.hasTarget.role.health += addVal;
    target.hasTarget.health.updateHealth(target.hasTarget.role.health);
    target.hasTarget.tipText.setTextTween('+' + addVal, treatTipColor);
    self.tipText.setTextTween(icon.role.name, treatTipColor, false, icon);
  }
}

// 野兽族
const beastRoles = [
  {
    name: '石头王',
    type: 'dkbear',
    weapon: 'dkbear_weapon',
    health: 3000,
    camp: 'tianhui',
    skills: [
      {
        name: '反伤盾',
        desc: '反弹当前100%所受伤害',
        chance: 35,
        icon: 'dkbear_sk',
        type: 'defense',
        action: skill_00,
        animation: hsAnis.dkbearAni
      }
    ],
    attackDamage: [10, 20],
    crit: 25,
    critVal: 1.25,
    aspd: 1200,
    posX: 0, 
    posY: 0
  }
];

// 巫族
const magicRoles = [
  {
    name: '菜鸡竹竹',
    type: 'magic_jitong',
    distance: 2,
    weapon: 'hc_logic_weapon',
    health: 1000,
    bullet: 'hc_logic_bullet',
    // 攻击间距
    ShootingSpace: 2500,
    speed: 2000,
    crit: 35,
    critVal: 3,
    // 阵营
    camp: 'tianhui',
    attackDamage: [80, 150],
    skills: [],
    posX: 0,
    posY: 0
  }
];

// 回春族
const rejuvenateRoles = [
  {
    name: '断正纯',
    type: 'hc_logic',
    // 攻击范围（远程）
    distance: 3,
    weapon: 'hc_logic_weapon',
    health: 8000,
    bullet: 'hc_logic_bullet',
    // 攻击间距
    ShootingSpace: 1500,
    speed: 800,
    // 阵营
    camp: 'tianhui',
    crit: 80,
    critVal: 1.8,
    skills: [
      {
        name: '治疗波',
        desc: '按照自身血量的30%单体治疗',
        chance: 30,
        icon: 'hc_logic_sk',
        type: 'attack',
        action: skill_10,
        animation: hsAnis.hclogicAni
      }
    ],
    attackDamage: [20, 50],
    posX: 0,
    posY: 0
  }
];

export { beastRoles, rejuvenateRoles, magicRoles};