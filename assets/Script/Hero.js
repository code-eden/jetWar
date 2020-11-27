const Input = {};
cc.Class({
    extends: cc.Component,

    properties: {
        // defaults, set visually when attaching this script to the Canvas
        bulletSpeed: 0.5,
        bulletFreq: 0.3,
        health: 100,
        speed: 0,
        score: 0,
        id: 0,
        name: 0,
    },

    onLoad() {
        this.screenH = this.node.parent.height;
        this.screenW = this.node.parent.width;

        // hero在屏幕最大的位置，防止出屏幕
        this.edgeW = this.screenW / 2 - this.node.width * this.node.scaleX;
        this.edgeH = this.screenH / 2 - this.node.height * this.node.scaleY;
        //cc.log("hero x " + this.edgeW+ " y " + this.edgeH);
        this.initEventListener();

        this.originBulletInterval = 1 / this.bulletFreq;
        this.bulletInterval = this.originBulletInterval;
        this.autoFire(this.bulletInterval);
    },

    initEventListener() {
        // 监听触摸事件
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._heroMove, this);
        //this.node.on(cc.Node.EventType.MOUSE_DOWN, this.heroMove, this);
        cc.log("initKeyboardEvent");
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.node.on('win_reward', function (event) {
            cc.log("get win reward");
            let reward = event.getUserData();
            let score = reward.reward;
            cc.log("win score " + score);
            event.stopPropagation();
        });
    },

    onKeyDown(event) {
        //cc.log("key " + event.keyCode);
        Input[event.keyCode] = 1;
    },

    onKeyUp(event) {
        Input[event.keyCode] = 0;
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._heroMove, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    _heroMove(touchEvent) { // Event 类型，子类有 EventTouch 、EventMouse等 
        //let location = touchEvent.getLocation();
        this.node.x += touchEvent.getDeltaX(); // 触点距离上一次事件移动的 x 轴距离
        this.node.y += touchEvent.getDeltaY(); // 触点距离上一次事件移动的 y 轴距离

        this.checkPosition();
    },

    // called every frame dt 单位秒
    update: function (dt) {
        if (Input[cc.macro.KEY.a]) {
            this.node.x -= this.speed * dt;
        } else if (Input[cc.macro.KEY.d]) {
            this.node.x += this.speed * dt;
        }

        if (Input[cc.macro.KEY.w]) {
            this.node.y += this.speed * dt;
        } else if (Input[cc.macro.KEY.s]) {
            this.node.y -= this.speed * dt;
        }

        this.checkPosition();
    },

    /** 防止超出屏幕 */
    checkPosition() {
        if (this.node.x > this.edgeW) {
            this.node.x = this.edgeW;
        } else if (this.node.x < -this.edgeW) {
            this.node.x = -this.edgeW;
        }

        if (this.node.y > this.edgeH) {
            this.node.y = this.edgeH;
        } else if (this.node.y < -this.edgeH) {
            this.node.y = -this.edgeH;
        }
    },

    // 改变发射速度
    fireReload(interval) {
        this.unschedule(this._scheduleCallback);
        this.autoFire(interval);
    },

    // 定时自动发射子弹
    autoFire(interval) {
        this._scheduleCallback = function () {
            this.createBullet();
        }
        this.schedule(this._scheduleCallback, interval); // 箭头函数this指向是固定不变的，function定义的函数，this的指向随着调用环境的变化而变化的
    },

    createBullet(bulletType) {
        let bullet = this.bulletPool.createNode(this.node.parent);
        bullet.hero = this.node;
        bullet.fire();
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter(other, self) {
        cc.log("enemy 发生碰撞 ，回收");
        //this.over();
        // todo 血量减少 
        this.damage();
    },

    damage() {
        cc.log("hero damage ");
    },

    /** 血量为空后爆炸 */
    _explosion() {
        //cc.log("爆炸");
        this.enemyTween.stop();
        this.anim.play("explosion");
        this.anim.on('finished', this.onResume, this);
        // todo 播放音效
    },
});
