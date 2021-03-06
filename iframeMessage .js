//父系统传值
const _listenerList = {};
/**
 * @description 用于iframe跨域传值
 * @param dom 执行节点，如果是子传父，不需要传值
 * @param url 所在域地址 默认是* 即任意域
 */
class iframeMessage {
    constructor(dom, url) {
        this.dom = dom || "";
        this.iframe = dom ? document.getElementById(dom) : "";
        this.url = url || "*";
        // this.listener = undefined;
        // if (this.dom) {//监听项目
        //     _listenerList[this.dom] = []
        // } else {
        //     _listenerList["_"] = [];
        // }
    }
    /**
     * @description 设置监听 
     * @param fun 回调函数
     * @returns 
     */
    addEventListener(fun) {
        this.listener = window.addEventListener(
            "message",
            (e) => {
                this.getMsg(e, fun);
            },
            true
        );
    }
    /**
     * @description 对监听到的数据进行处理，并进行返回响应
     * @param e 监听到的值
     * @param fun 回调函数
     * @returns 
     */
    getMsg(info, fun) {
        let e = JSON.parse(info.data);
        if (e.from === "parents") {//来自父标签
            if (e.code === "normall") {//需要回应
                // this.postMessageChildSuccess(info.data);//回应父级已经接收到数据
                let returnData = { id: e.id, msg: e.msg };
                if (e.tag) {
                    returnData["tag"] = e.tag;
                }
                if (this._isFunction(fun)) {
                    fun(returnData)
                } else {
                    return returnData;
                }
            }
        } else if (e.from === "child") {//来自子标签
            if (e.code === "normall") {//需要回应
                this.postMessageParentsSuccess(info.data);//回应父级已经接收到数据
                let returnData = { id: e.id, msg: e.msg };
                if (e.tag) {
                    returnData["tag"] = e.tag;
                }
                if (this._isFunction(fun)) {
                    fun(returnData)
                } else {
                    return returnData;
                }
            }
        }
    }
    /**
    * @description 通过dom节点是否存在来区分选择向父级传送还是向子级传送
    * @param data 监听到的值
    * @returns 
    */
    postMessage(data) {
        if (this.dom != "") {
            this.postMessageParents(data);
        } else {
            this.postMessageChild(data);
        }
    };
    /**
     * @description 调用子页面方法并传入值
     * @param id (必填）子组件识别参数
     * @param msg （必填） 传入数据 { code: "",data:{} } code标准值succes, normal 正常返回值
     * @param tag （选填） 特殊标记 id的扩展
     * @returns 
     */
    postMessageParents(data) {//代理函数
        this._postMessageParentsReal(data.id, data.msg, data.tag);
    };
    _postMessageParentsReal(id, msg, tag) {
        let data = {
            dom: this.dom,
            url: this.url,
            id: id,
            msg: msg,
            tag: tag,
            from: "parents",
            code: "normall"
        }
        this.iframe.contentWindow.postMessage(JSON.stringify(data), this.url)
    };
    /**
     * @description 调用子页面方法并传入值
     * @param id (必填）子组件识别参数
     * @param msg （必填） 传入数据 { code: "",data:{} } code标准值succes, normal 正常返回值
     * @param tag （选填） 特殊标记 id的扩展
     * @returns 
     */
    postMessageParentsSuccess(data) {//代理函数
        this._postMessageParentsSuccessReal(data.id, data.msg, data.tag)
    };
    _postMessageParentsSuccessReal(id, msg, tag) {
        let data = {
            dom: this.dom,
            url: this.url,
            id: id,
            msg: msg,
            tag: tag,
            from: "parents",
            code: "success"
        }
        this.iframe.contentWindow.postMessage(JSON.stringify(data), this.url)
    };
    /**
     * @description 调用父页面方法并传入值
     * @param id (必填）父组件识别参数
     * @param opt （必填） 传入数据 { code: "",data:{} } code标准值succes, normal 正常返回值
     * @param tag （选填） 特殊标记 id的扩展
     * @returns 
     */
    postMessageChild(data) {
        this._postMessageChildReal(data.id, data.msg, data.tag)
    };
    _postMessageChildReal(id, msg, tag) {
        let data = {
            dom: this.dom,
            url: this.url,
            id: id,
            msg: msg,
            tag: tag,
            from: "child",
            code: "normall"
        }
        window.parent.postMessage(JSON.stringify(data), this.url);
    };
    /**
     * @description 调用父页面方法并传入值
     * @param id (必填）父组件识别参数
     * @param opt （必填） 传入数据 { code: "",data:{} } code标准值succes, normal 正常返回值
     * @param tag （选填） 特殊标记 id的扩展
     * @returns 
     */
    postMessageChildSuccess(data) {
        this._postMessageChildSuccessReal(data.id, data.msg, data.tag)
    };
    _postMessageChildSuccessReal(id, msg, tag) {
        let data = {
            dom: this.dom,
            url: this.url,
            id: id,
            msg: msg,
            tag: tag,
            from: "child",
            code: "success"
        }
        window.parent.postMessage(JSON.stringify(data), this.url);
    };
    /**
    * @description 判断是否是函数
    * @param fun
    * @returns {boolean}
    */
    _isFunction(fun) {
        try {
            if (fun && typeof fun === "function") {
                return Object.prototype.toString.call(fun) === '[object Function]'
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}

export default iframeMessage