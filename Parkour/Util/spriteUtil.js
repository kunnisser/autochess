const SpriteUtil = {};

SpriteUtil.initGame = (game) => {
  SpriteUtil.game = game;
}

// 添加场景元素
SpriteUtil.addSprite = (kf, parent, scale, x, y, anchor) => {
  let [frameKey, frameName] = [null, null];
  if (typeof kf === 'object') {
    frameKey = kf.key;
    frameName = kf.frame;
  } else {
    frameKey = kf;
    frameName = null;
  }
  const role = SpriteUtil.game.add.sprite(0, 0, frameKey, frameName, parent);
  typeof scale === 'number' ? role.scale.set(scale) : role.scale.set(scale[0], scale[1]);
  role.x = x;
  role.y = y;
  typeof anchor === 'object' ?
    role.anchor.set(anchor[0], anchor[1]) :
    role.anchor.set(anchor);
  return role;
}

export default SpriteUtil;