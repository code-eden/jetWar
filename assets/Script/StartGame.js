
cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: require("Hero"), // 获取 hero 实例
        },
        mainGame: {
            default: null,
            type: require("Background"), // 获取 hero 实例
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.once(cc.Node.EventType.TOUCH_START, this.hideAndStart, this)
    },

    start() {

    },

    hideAndStart() {
        this.node.active = false;
        this.player.getComponent('Hero').startGame();
        this.mainGame.getComponent('Background').genEnemy();
        this.node.parent.removeChild(this.node);
    }
    // update (dt) {},
});
