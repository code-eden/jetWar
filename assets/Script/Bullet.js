
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
        this.screenHeight = this.node.parent.height;
        this.screenTop = this.node.parent.height / 2 + 20;
    },

    fire() {
        //cc.log("bullet now fire");

        //cc.log("screen height " + screenH);
        //cc.log("hero position x " + this.hero.x + " y " + this.hero.y);
        //cc.log("bullet position x " + this.node.x + " y " + this.node.y);
        let bulletY = this.hero.y + 40;
        this.node.x = this.hero.x;
        this.node.y = bulletY;
        let bulletSpeed = this.hero.getComponent('Hero').bulletSpeed;
        let timeToTop = (this.screenTop - bulletY) / bulletSpeed;// 子弹到达顶部的时间，为了保证子弹速度一致。
        //cc.log("time to top " + timeToTop);
        // 子弹发射
        cc.tween(this.node)
            //.delay(2) 延迟2秒后执行下面的动作
            // .to(1, { y: screenH }, { easing: 'sineOut' })
            .to(timeToTop, { y: this.screenTop })
            .call(() => { this.over() }) // 执行上面的动作后回调,不能直接this.over() ,需要传入函数
            .start();
    },

    over() {
        //cc.log("bullet over");
        this.pool.nodeOver(this.node);
    },
});
