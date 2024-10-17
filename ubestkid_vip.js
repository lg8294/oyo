// https://uc.ubestkid.com/web/user/getUserProfile
// https://uc.ubestkid.com/web/user/getFullUserInfo
// let reg = /^https:\/\/uc\.ubestkid\.com\/web\/user\/(?:getUserProfile|getFullUserInfo)/;

function notify(message) {
  let title = "ubestkid_no_ad.js";
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

// notify("running");
// notify({ body: { test: "test" } });
console.log($response);
if (
  $script.type === "http-response" &&
  ($request.url.includes("getUserProfile") ||
    $request.url.includes("getFullUserInfo"))
) {
  // notify({body:$response.tojson()})
  let body = JSON.parse($response.body);
  // notify(typeof body);
  // notify({ body, message: "修改前body" });
  // 修改body
  if (body.errorCode === 0) {
    // notify("errorCode is 0");
    body.result.membershipResponse = [
      {
        name: "com.ubestkid.supervip",
        expireDate: 1778832635000,
        rightType: "YEAR",
      },
    ];
    body.result.products = [
      {
        id: 100082,
        name: "贝乐虎大会员双年卡",
        pid: "com.ubestkid.supervip.m24",
        price: 77600,
        guidePrice: 77600,
        iosPrice: 77600,
        iosGuidePrice: 77600,
        dealCount: 9429,
        initCount: 0,
        description: "",
        productType: "MEMBERSHIP",
        contentType: "GENERAL",
        noSale: 0,
        srcApp: "com.ubestkid",
        scope: "APP",
        status: "ENABLED",
        createTime: null,
        updateTime: null,
        membershipName: "com.ubestkid.supervip",
        productImage: null,
        productDesc: "VIP权益24个月",
        image16x9: "https://resvd.ubestkid.com/product/16x9/supervip_m24.png",
        image1x1: "https://resvd.ubestkid.com/product/1x1/supervip_m12.png",
        descImage: "https://resvd.ubestkid.com/product/desc/svip_m12.png",
        membershipRenewPriority: 730,
        membershipProduct: true,
        membershipDays: 730,
        membershipRight: "YEAR",
        razProduct: false,
        coinProduct: false,
        presentCoopProduct: false,
        renewProduct: false,
        teJiaProduct: false,
      },
    ];
    body.result.userProfile.order = '{"100082":true}';
    // notify({ body, message: "modified body" });
  }
  $done({ body });
} else {
  $done();
}
