/*
  Surge 脚本实现 Qx 的 response-body、和request-body 重写类型
  
  如 Qx：
https://service.ilovepdf.com/v1/user url response-body false response-body true
   
  可改写为 Surge：
[Script] 
test = type=http-response,pattern=https://service.ilovepdf.com/v1/user,requires-body=1,script-path=https://raw.githubusercontent.com/mieqq/mieqq/master/replace-body.js, argument=false->true

argument=要匹配值=作为替换的值
支持正则：如argument=\w+->test
支持正则修饰符：如argument=/\w+/g->test
支持多参数，如：argument=匹配值1->替换值1&匹配值2->替换值2

支持改写响应体和请求体体（type=http-response 或 http-request）注意必须打开需要body（requires-body=1）

tips 
修改json格式的键值对可以这样：
argument=("key")\s?:\s?"(.+?)"->$1: "new_value"

s修饰符可以让.匹配换行符，如 argument=/.+/s->hello
  
*/

function notify(message) {
  let title = "my-replace-body.js";
  let msg = null;
  let content = $request.url;
  if (typeof message === "string") {
    msg = message;
  } else {
    title = message.title ?? title;
    msg = message.message;
    content = message.body;
  }
  console.log(title, msg, content);
  $notification.post(
    title, // 通知标题
    msg, // 通知消息。比较简短。
    typeof content === "string" ? content : JSON.stringify(content) // 通知内容。点击通知后可以查看详细内容
  );
}
function getRegexp(re_str) {
  let regParts = re_str.match(/^\/(.*?)\/([gims]*)$/);
  if (regParts) {
    return new RegExp(regParts[1], regParts[2]);
  } else {
    return new RegExp(re_str);
  }
}

notify({ message: "开始", body: $argument });
console.log("argument", $argument);

let body;
if (typeof $argument == "undefined") {
  console.log("requires $argument");
} else {
  if ($script.type === "http-response") {
    body = $response.body;
  } else if ($script.type === "http-request") {
    body = $request.body;
  } else {
    console.log("script type error");
  }
}

if (body) {
  console.log("origin body:", body);
  $argument.split("&").forEach((item) => {
    let [match, replace] = item.split("->");
    let re = getRegexp(match);
    console.log("match:", match, "replace:", replace, "re:", re);
    body = body.replace(re, replace);
    notify({ message: "修改中", body });
  });
  console.log("modifyed body:", body);
  notify({ message: "修改完成", body });
  $done({ body });
} else {
  console.log("Not Modify");
  notify("没有修改");
  $done({});
}
