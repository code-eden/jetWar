cc.Class({
    extends: cc.Component,

    properties: {
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        jumpHeight: 150,
        jumpDuration: 0.5,
        bulletSpeed: 0.5,
    },

    runJumpAction: function () {
        console.log("run jump");
        this.node.x = 0;
        // 跳跃上升
        var jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: 'sineOut' });
        // 下落
        var jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: 'sineIn' });

        // 创建一个缓动，按 jumpUp、jumpDown 的顺序执行动作
        var tween = cc.tween().sequence(jumpUp, jumpDown)
        // 不断重复
        return cc.tween().repeatForever(tween);
    },
    // use this for initialization
    onLoad: function () {
        console.log("load  jump");
        //cc.log("player position x " + this.node.x + " y " + this.node.y);
        var jumpAction = this.runJumpAction();
        console.log("node name" + this.node);
        //cc.tween(this.node).then(jumpAction).start();
        this.autoFire();
    },

    // 定时自动发射子弹
    autoFire() {
        this.schedule(() => {   // 箭头函数this指向是固定不变的，function定义的函数，this的指向随着调用环境的变化而变化的
            this.createBullet();
        }, this.bulletSpeed);
    },

    createBullet() {
        let bullet = this.bulletPool.createNode(this.node.parent);
        bullet.hero = this.node;
        bullet.fire();
    },
    // called every frame
    update: function (dt) {
        //cc.systemEvent.on()
    },
});
