/**
 * 对象池，用于获取预制对象
 */

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    /**
     * 
     * @param {cc.Prefab} prefab 预制节点
     * @param {int} initCnt 初始化数量
     * @param {string} name 脚本名字
     */
    initPool(prefab, name, initCnt) {
        cc.log(name + " pool init");
        this.prefab = prefab;
        this.poolType = name;
        this.pool = new cc.NodePool();
        let cnt = initCnt <= 0 ? 10 : initCnt;

        for (let index = 0; index < cnt; index++) {
            let prefabIns = cc.instantiate(prefab);
            this.pool.put(prefabIns);
        }
    },

    start() {

    },

    // update (dt) {},
    /**
     * 返回创建节点挂载的脚本实例
     * @param {cc.Node} parentNode 
     */
    createNode(parentNode) {
        let prefabNode = null;
        if (this.pool.size() > 0) {
            //cc.log(this.poolType + " pool size " + this.pool.size());
            prefabNode = this.pool.get();
        } else {
            cc.log("now pool is empty ,create new node");
            prefabNode = cc.instantiate(this.prefab);
        }
        prefabNode.parent = parentNode;
        let prefab = prefabNode.getComponent(this.poolType);
        prefab.pool = this;
        prefab.init(); //调用脚本初始化，pool 对应的脚本需要有 init 方法

        return prefab;
    },

    /**
     * 
     * @param {cc.Node} node 节点
     */
    nodeOver(node) {
        this.pool.put(node);
        //cc.log("pool node back now size " + this.pool.size());
    },

    clearPool() {
        cc.log("clear " + this.poolType + " pool");
        this.pool.clear();
    }
});
