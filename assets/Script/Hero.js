cc.Class({
    extends: cc.Component,

    properties: {
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        jumpHeight: 150,
        jumpDuration: 0.5,
        bulletSpeed: 0.5,
    },

    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.heroMove, this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.heroMove, this);

        this.autoFire();
    },

    heroMove(touchEvent) {
        //let location = touchEvent.getLocation();
        cc.log("touch x " + touchEvent.getLocationX() + " y " + touchEvent.getLocationY());
        cc.log("hero x " + this.node.x + " y " + this.node.y);
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
