# iframeMessage

用于跨域传值

技术 postMessage

引入

```javascript
<script src="./iframeMessage.min.js" ></script>
```

使用

```javascript
var iframeId = new iframeMessage("节点id","要通信的域");
//接收的值
iframeId.addEventListener(function(e){
      console.log(e);//接收的参数
  		let { id,msg,label,tag} = e;//其中tag不传时就不会存在
})
//传递参数
iframeId.postMessage({
   id:id,//要传递的id
   msg:msg,//要传递的内容 可以传Object
   label:label,//要传递的label
   tag:tag//要传递的tag
})
```

实例化

```javascript
new iframeMessage("节点id","要通信的域url");//节点id没有时默认是往父级或对应通信域传值，要通信的域url定义对应的域（可以不填，默认为任意域，“*”）
```

可使用方法

```javascript
postMessage(data) //发送参数  data 要传递的值  
addEventListener(fun(e))//fun(e) 回调函数，用于接收参数
postMessageParents(data)//向父级发送参数 当postMessage没有id时走该参数 （iframeMessage实例化id为空时）
postMessageChild(data)//向子级发送参数 当postMessage有id时走该参数 （iframeMessage实例化id为不空时）
removeEventListener()//去掉全局监听，当页面销毁时除了要销毁当前示例还要先调用一次该参数
```

