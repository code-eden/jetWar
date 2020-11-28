const Input = {};
cc.Class({
    extends: cc.Component,

    properties: {
        // defaults, set visually when attaching this script to the Canvas
        bulletSpeed: 0.5,
        bulletFreq: 0.3,
        health: 100, // 血条
        energy: 0, // 能量
        strengthen: 0, // 强化
        shield: 0, // 护盾
        speed: 0,
        score: 0,
        id: 0,
        heroName: 0,
    },

    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;

        this.screenH = this.node.parent.height;
        this.screenW = this.node.parent.width;

        this._spriteFrame = this.node.getComponent(cc.Sprite).spriteFrame;
        this.anim = this.node.getComponent(cc.Animation);

        this._health = this.health;

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
    },

    onKeyDown(event) {
        //cc.log("key " + event.keyCode);
        Input[event.keyCode] = 1;
    },

    onKeyUp(event) {
        Input[event.keyCode] = 0;
    },

    onDestroy() {
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
        this._stopFire();
        this.autoFire(interval);
    },

    // 定时自动发射子弹
    autoFire(interval, bulletType) {
        this._scheduleCallback = function () {
            this.createBullet(bulletType);
        }
        this.schedule(this._scheduleCallback, interval); // 箭头函数this指向是固定不变的，function定义的函数，this的指向随着调用环境的变化而变化的
    },

    _stopFire() {
        this.unschedule(this._scheduleCallback);
    },

    createBullet(bulletType) {
        let bullet = this.bulletPool.createNode(this.node.parent);
        bullet.hero = this.node;
        bullet.fire();
    },

    /**
     * 当碰撞产生的时候调用，对应tag 0
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter(other, self) {
        if (other.tag == 2) {
            cc.log("hero 和 enemy 发生碰撞，直接爆炸");
            // this._explosion();  //todo 具体处理hero挂掉逻辑
        } else {
            let instance = other.node.getComponent('');
            this.damage(instance);
        }
    },

    damage(instance) {
        cc.log("hero damage ");
        let hurt = instance.damage;
        this.shield = this.shield - hurt;

        // 护盾还没衰减到0,继续
        if (this.shield > 0) {
            return;
        }

        this.health = this.health + this.shield;
        this.shield = 0;

        if (this.health <= 0) {
            this._explosion();
        }
    },

    _createShield(shieldNum) {
        this.shield = shieldNum;
    },

    /** 中弹血量到0后爆炸 */
    _explosion() {
        this._stopFire();
        //cc.log("爆炸");
        this.anim.play("explosion");
        this.anim.on('finished', this._onResume, this);
        // todo 播放音效
        this._explosionAudio();
    },

    _onResume() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._heroMove, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.health = this._health;
        this.shield = 0;
        // todo 结束游戏，显示得分
    },

    _explosionAudio() {
        cc.log("播放爆炸音效");
        // cc.audioEngine.play();
    },
});
