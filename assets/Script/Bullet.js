
cc.Class({
    extends: cc.Component,

    properties: {
        strengthen: 0,
        damage: 100,
        heroId: 99,
        collisionGroup: 'herobullet',
        isInit: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //cc.log("bullet on load");
    },

    start() {

    },

    // 启动子弹发射
    init() {
        if (this.isInit) {
            return;
        }

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        //cc.log("bullet init");
        //this.pool = pool;
        this.screenHeight = this.node.parent.height;
        this.screenTop = this.node.parent.height / 2 - 40;

        this.isInit = true;
    },

    /**
     * 当碰撞产生的时候调用 ,对应tag 1
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        // cc.log("bullet 发生碰撞 ，回收");
        //this.node.group = 'default';
        if (other.tag == 2) {
            this.bulletTween.stop();
            this.over();
            // cc.log("bullet 和 enemy 发生碰撞");
        }
    },

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        //console.log('bullet 碰撞结束');
        //this.node.group = this.collisionGroup;
        //this.over();
    },

    getDamage() {
        return this.damage;
    },

    getHeroId() {
        return this.heroId;
    },
    // update (dt) {},


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
        this.bulletTween = cc.tween(this.node)
            //.delay(2) 延迟2秒后执行下面的动作
            // .to(1, { y: screenH }, { easing: 'sineOut' })
            .to(timeToTop, { y: this.screenTop })
            .call(() => { this.over() }); // 执行上面的动作后回调,不能直接this.over() ,需要传入函数
        this.bulletTween.start();
    },

    over() {
        //cc.log("bullet over");
        this.pool.nodeOver(this.node);
    },
});
