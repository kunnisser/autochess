class Cards extends Phaser.Group{
  constructor(game, parent, config) {
    super(game, parent, config);
    this.panels = [];
    this.generateCard();
    this.setAnchorHalf();
  }

  generateCard () {
    this.panels.push(this.game.add.image(0, 0, 'cardBg', null, this));
    this.infoGp = this.game.add.group(this, 'cardInfoGp');
    this.thumbGp = this.game.add.group(this, 'cardThumbGp');
    this.panels.push(this.game.add.image(0, 0, 'cardThumbBg', null, this.thumbGp));
    this.panels.push(this.game.add.image(0, 0, 'cardInfoBg', null, this.infoGp));
    this.thumbGp.y -= this.thumbGp.height * 0.5 + 26;
    this.infoGp.y += this.infoGp.height * 0.5 - 16;

    // create text info 
    const fontStyle = {
      font: '24px',
      fill: '#ffffff',
      wordWrap: true,
      wordWrapWidth: this.panels[2].width,
      align: 'left'
    };
    const text = [
      ' 血量 : 5000 \n',
      '攻击力 : 20 - 80 \n',
      '防御 : 50 \n',
      '暴击 : 20%'
    ];
    const info = this.game.add.text(0, 0, text.join(' '), fontStyle, this.infoGp);
    info.anchor.set(0.5);
  }

  setAnchorHalf () {
    for (let child of this.panels) {
      child.anchor.set(0.5);
    }
  }
}

export default Cards;