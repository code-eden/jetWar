
cc.Class({
    extends: cc.Component,

    properties: {
        reward: 1,
        health: 100,
        collisionGroup: 'enemy',
        isInit: false,
    },

    onLoad() {
        //cc.log("enemy on load");
    },

    start() {

    },

    init() {
        //cc.log("is enemy init "+ this.isInit);
        if (!this.isInit) {
            // 获取碰撞检测系统：
            var manager = cc.director.getCollisionManager();
            manager.enabled = true; // 开启碰撞检测
            // manager.enabledDebugDraw = true; // 开启碰撞检测 debug 绘制

            // this.rewardEvent = new cc.Event.EventCustom('win_reward', true);
            //cc.log("enemy init");
            //cc.log("enemy position x " + this.node.x + " y " + this.node.y);
            this._spriteFrame = this.node.getComponent(cc.Sprite).spriteFrame;
            this.anim = this.node.getComponent(cc.Animation);
            this._health = this.health;

            this.screenH = this.node.parent.height / 2;
            this.screenW = this.node.parent.width / 2;
            //cc.log("parent w " + this.node.parent.width + "parent name " + this.node.parent.name);
            // hero在屏幕最大的位置，防止出屏幕
            this.edgeW = this.screenW - this.node.width * this.node.scaleX / 2;

            this.boomAudio = this.getComponent(cc.AudioSource);
            this.isInit = true;
        }

        this.node.x = this._getRandomX();
        //cc.log("enemy random" + this.node.x);
        this.node.y = this.screenH + this.node.height;
        this._fly();
    },
    // update (dt) {},

    _fly() {
        let timeToBottom = 2;
        this.enemyTween = cc.tween(this.node)
            //.delay(2) 延迟2秒后执行下面的动作
            // .to(1, { y: screenH }, { easing: 'sineOut' })
            .to(timeToBottom, { y: -this.screenH })
            .call(() => {
                this.over();
            }); // 执行上面的动作后回调,不能直接this.over() ,需要传入函数

        this.enemyTween.start();
    },

    /**
     * 当碰撞产生的时候调用，对应tag 2
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        this.node.group = 'default'; //不让动画在执行碰撞
        // cc.log("enemy 发生碰撞 ，回收");
        let otherInstance = null;
        switch (other.tag) {
            case 0:
                // cc.log("hero 和 enemy 发生碰撞");
                this._explosion(false);
                return;
            case 1:
                // cc.log("bullet 和 enemy 发生碰撞");
                otherInstance = other.node.getComponent('Bullet');
                break;
        }

        this.damage(otherInstance);
    },

    damage(instance) {
        let hurt = instance.getDamage();
        this.health = this.health - hurt;
        // cc.log("enemy damage health " + this.health);

        if (this.health <= 0) {
            // cc.log("enemy damage to death");
            this._explosion(true, instance.getHeroId());
        }
    },

    /** 中弹血量到0后爆炸 */
    _explosion(reward, heroId) {
        // cc.director.getCollisionManager().enabled = false;
        //cc.log("爆炸");
        this.enemyTween.stop();
        this.anim.play("explosion");
        this.anim.on('finished', this._onResume, this);
        // todo 播放音效
        this._explosionAudio();
        // 通知获取奖励
        if (reward) {
            this._notifyReward(heroId);
        }
    },

    _explosionAudio() {
        //cc.log("播放爆炸音效");
        this.boomAudio.play();
        // cc.audioEngine.play();
    },

    _onResume() {
        //cc.log("爆炸后恢复状态用于回收到对象池");
        // 爆炸后恢复状态用于回收到对象池
        // 精灵换成飞机图片
        this.node.getComponent(cc.Sprite).spriteFrame = this._spriteFrame;
        // 恢复血量
        this.health = this._health;
        this.node.group = this.collisionGroup;
        // 回收进对象池
        this.over();
    },

    _notifyReward(heroId) {
        // 通知获取奖励
        // cc.log('notify reward');
        let rewardEvent = new cc.Event.EventCustom('win_reward', true);
        let rewardNum = this.reward;
        let rewardData = {
            score: rewardNum,
            heroId: heroId,
        };

        rewardEvent.setUserData(rewardData);
        this.node.dispatchEvent(rewardEvent); // 父节点才能收到事件
    },

    over() {
        //cc.log("bullet over");
        this.health = this._health;
        this.node.y = this.screenH + this.node.height;
        this.pool.nodeOver(this.node);
    },

    _getRandomX() {
        return this._random(-this.edgeW, this.edgeW);
    },


    _random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
});
