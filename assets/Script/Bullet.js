
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //cc.log("bullet on load");
    },

    start() {

    },

    // update (dt) {},

    // 启动子弹发射
    init(pool) {
        //cc.log("bullet init");
        this.pool = pool;
    },

    fire() {
        //cc.log("bullet now fire");
        let screenH = this.node.parent.height / 2 + 20;
        //cc.log("screen height " + screenH);
        //cc.log("hero position x " + this.hero.x + " y " + this.hero.y);
        //cc.log("bullet position x " + this.node.x + " y " + this.node.y);

        let bulletY = this.hero.y + 40;
        this.node.y = bulletY;

        // 子弹发射
        cc.tween(this.node)
            //.delay(2) 延迟2秒后执行下面的动作
            // .to(1, { y: screenH }, { easing: 'sineOut' })
            .to(2.5, { y: screenH })
            .call(() => { this.over() }) // 执行上面的动作后回调,不能直接this.over() ,需要传入函数
            .start();
    },

    over() {
        //cc.log("bullet over");
        this.pool.nodeOver(this.node);
    },
});
