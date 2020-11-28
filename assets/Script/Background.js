let PoolClass = require('Pool');

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
        player: {
            default: null,
            type: require("Hero"), // 获取 hero 实例
        },
        enemyPrefab: {
            default: null,
            type: cc.Prefab,
        },
        bulletPrefab: {
            default: null,
            type: cc.Prefab,
        },
        speed: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.bgHeight = this.node.height;
        this.bgWidth = this.node.width;
        this.bg2IsOnTop = true;
        this.initAllPool();

        this.genEnemy();
        //cc.log("bg node bgWidth " + this.bgWidth);

        this.node.on('win_reward', (event) => {
            let reward = event.getUserData();
            let score = reward.score;
            let heroId = reward.heroId;
            cc.log("hero " + heroId + "get win reward");
            //cc.log("win score " + score);
            //cc.log("heroId " + heroId);
            event.stopPropagation();
        });
    },

    initAllPool() {
        //cc.log("init bullet and enemy pool");
        this.bulletPool = new PoolClass();
        this.enemyPool = new PoolClass();

        this.bulletPool.initPool(this.bulletPrefab, 'Bullet', 10); // 初始化pool
        this.enemyPool.initPool(this.enemyPrefab, 'Enemy', 5); // 初始化pool

        this.player.bulletPool = this.bulletPool;
        //this.player.enemyPool = this.enemyPool;
    },

    // 生成敌机
    genEnemy() {
        //this.enemyPool.createNode(this.node);
        // return
        let freq = 2;
        let interval = 1 / freq;
        this.schedule(() => {
            this.enemyPool.createNode(this.node);
        }, interval);
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
            //cc.log("next round 1 y : " + this.bg1.y + " 2 y: " + this.bg2.y)
            this.bg1.y = this.bgHeight + this.bg2.y;
            this.bg2IsOnTop = false;
        } else if (this.bg1.y <= 0 && !this.bg2IsOnTop) {
            //cc.log("next round 1 y : " + this.bg1.y + " 2 y: " + this.bg2.y)
            this.bg2.y = this.bgHeight + this.bg1.y;
            this.bg2IsOnTop = true;
        }
    },

    /** 播放背景音乐 */
    playBGM() {

    },
});
