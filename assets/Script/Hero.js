cc.Class({
    extends: cc.Component,

    properties: {

        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        jumpHeight:150,
        jumpDuration: 0.5,

    },

    runJumpAction: function(){
        console.log("run jump");
        this.node.x=0;
        // 跳跃上升
        var jumpUp = cc.tween().by(this.jumpDuration, {y: this.jumpHeight}, {easing: 'sineOut'});
        // 下落
        var jumpDown = cc.tween().by(this.jumpDuration, {y: -this.jumpHeight}, {easing: 'sineIn'});

        // 创建一个缓动，按 jumpUp、jumpDown 的顺序执行动作
        var tween = cc.tween().sequence(jumpUp, jumpDown)
        // 不断重复
        return cc.tween().repeatForever(tween);
    },
    // use this for initialization
    onLoad: function () {
        console.log("load  jump");
    
        var jumpAction = this.runJumpAction();
        console.log("node name"+this.node);
        cc.tween(this.node).then(jumpAction).start();
    },

    // called every frame
    update: function (dt) {
       //cc.systemEvent.on()
    },
});
