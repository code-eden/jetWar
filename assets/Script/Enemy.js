
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.log("enemy on load");
    },

    start() {

    },

    init() {
        cc.log("enemy init");
        cc.log("enemy position x " + this.node.x + " y " + this.node.y);

        this.screenH = this.node.parent.height /2;
        this.screenW = this.node.parent.width /2;

        // hero在屏幕最大的位置，防止出屏幕
        this.edgeW = this.screenW  - this.node.width * this.node.scaleX;
        this.edgeH = this.screenH  - this.node.height * this.node.scaleY;
        this.maxX = this.screenW - this.edgeW;

        this.node.x = this._getRandomX();
        this.node.y = this.screenH  + this.node.height;
        this.fly();
    },
    // update (dt) {},

    fly(){
        let timeToBottom = 2;
        cc.tween(this.node)
        //.delay(2) 延迟2秒后执行下面的动作
        // .to(1, { y: screenH }, { easing: 'sineOut' })
        .to(timeToBottom, { y: -this.screenH })
        .call(() => { this.over() }) // 执行上面的动作后回调,不能直接this.over() ,需要传入函数
        .start();
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        cc.log("enemy 发生碰撞 ，回收");
        this.over();
    },

    over() {
        //cc.log("bullet over");
        this.pool.nodeOver(this.node);
    },

    _getRandomX() {
        return this._random(0 - this.maxX, this.maxX);
    },


    _random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
});
