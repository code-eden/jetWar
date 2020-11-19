
cc.Class({
    extends: cc.Component,

    properties: {
        bg1: {
            default: null,
            type: cc.Node,
        },
        bg2: {
            default: null,
            type: cc.Node,
        },
        speed: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.bgHeight = this.node.height;
        this.bg2IsOnTop = true;
        cc.log("bg node height " + this.bgHeight);
        cc.log("bg node wwdth " + this.bgWidth);


    },

    start() {

    },

    update(dt) {
        this.bgMoveDown();
    },

    /** 背景向下移动 */
    bgMoveDown() {
        this.bg1.y -= this.speed;
        this.bg2.y -= this.speed;
        // 当背景2位于1上面，并且y<=0时，需要将背景1移动到2的上方
        if (this.bg2.y <= 0 && this.bg2IsOnTop) {
             cc.log("next round 1 y : " + this.bg1.y + " 2 y: " + this.bg2.y)
            this.bg1.y = this.bgHeight + this.bg2.y;
            this.bg2IsOnTop = false;
        } else if (this.bg1.y <= 0 && !this.bg2IsOnTop) {
             cc.log("next round 1 y : " + this.bg1.y + " 2 y: " + this.bg2.y)
            this.bg2.y = this.bgHeight + this.bg1.y;
            this.bg2IsOnTop = true;
        }
    },

    /** 播放背景音乐 */
    playBGM(){

    },
});
