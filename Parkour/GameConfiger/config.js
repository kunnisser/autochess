/**
 * Created by kunnisser on 2017/8/02.
 * 配置canvas基本参数
 */

class Config {
    constructor () {};
    // base size (7p, 8p)
    static SOURCE_GAME_WIDTH = 1242;
    static SOURCE_GAME_HEIGHT = 2208;
    static GAME_WIDTH = Config.SOURCE_GAME_WIDTH;
    static GAME_HEIGHT = Config.SOURCE_GAME_HEIGHT;
    static HALF_GAME_WIDTH = Config.GAME_WIDTH * .5;
    static HALF_GAME_HEIGHT = Config.GAME_HEIGHT * .5;
    static WORLD_SCALE = 1;
}

export default Config;