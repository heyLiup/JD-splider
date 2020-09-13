

const request = require('superagent');
require('superagent-proxy')(request);
var cheerio=require('cheerio');
var fs=require('fs');
const { resolve } = require('path');
var page = 1;

var BASE_URL = 'https://try.jd.com/public/getApplyCountByActivityIds?activityIds=1149129,1149128,1149042,1149030,1149029,1148920,1148917,1148876,1148725,1148711,1148693,1148422,1148357,1148266,1148265,1148017,1147912,1147908,1147907,1147901';
var cookieData = 'shshshfpa=fec24458-70d2-f282-3fc7-5e1c67123a1a-1559918904; shshshfpb=fdTFdYRzQB8JC3G%20EUA0mxg%3D%3D; __jdv=76161171|baidu|-|organic|not set|1599962196822; areaId=15; ipLoc-djd=15-1290-0-0; PCSYCityID=CN_340000_340800_340822; user-key=45595c3a-11d8-4f40-9918-045e552227a6; cn=117; TrackID=1BmF4wXp4bGP6qrXXWe9J2JUFnQJ1MbmtE4rg3nhcpGEc1aiCuzraIArhHtQqGC1mlCkW2aCZL3b4iI0poitCyjG7hGMs9fMfdsJsclFInLs; thor=6F70357727C552F15F1E962ED5263D37D2C62DA1D255B41D76E424DF12DB9073A7326A67BD907FDB29F2C5F1CFB549A3F876538B1E22F0ED477DE4C180400F96C0C3A7D4C8AD05F68A5256824A6D197E1F536C5FD9A3067220F2FCBD79028C54BD336C99C4557470BB40754F0036CB8809F13388A1402B09BF839E9975F0AB2D4650B472DA1317DABAB07C7A7D0A77341E2A20DD0D99281733D7327B023030FA; pinId=wi-dj_GJ_bn29dZo3lL-w7V9-x-f3wj7; pin=jd_40d62e22a36e0; unick=%E8%80%81%E9%A9%AC1322; ceshi3.com=103; _tp=9OXm47YsHp1BZmbdfS1mZ6PbWkkH05L%2F3vaTWQzE5e8%3D; _pst=jd_40d62e22a36e0; shshshfp=10e47992fa656c75dd3990ea8faeaa6f; shshshsID=bc5c18c50b50512c9709a068aa457df6_4_1599963585275; __jda=122270672.1265561133.1559918902.1598077337.1599962197.28; __jdc=122270672; 3AB9D23F7A4B3C9B=AXMFX42DO63QCNAQHYLEI6DEHGUK42EI23EB65YQQGNMCEN6IZWHOHLPTHOWF6EMHTPNBIUNOPYHMZQVVNNCXCSUVU; __jdb=122270672.20.1265561133|28.1599962197'
var arr = [];




async function start (page) {
    let headers = {
        // "Cookie": cookieData,
        'Referer': `https://try.jd.com/activity/getActivityList?page=${page}&cids=737`,
    };
    try{
        var res=await request.post(BASE_URL).set(headers);
        let resData = JSON.parse(res.text);
        // console.log(JSON.parse(res.text));
        resData.forEach(async (element) => {
            // applyBus(id);

            await getItem(element.activity_id);
        });
    }catch(err){
    
    }

    setTimeout(() => {
        start(++page);
        console.log('采集第' + page + '页')
    }, 4000);

    if (page > 2) {
        writeFile(JSON.stringify(arr));
        return false;
    }
}


async function getItem (id) {
    let url = `https://try.jd.com/migrate/getActivityById?id=${id}`;
    let headers = {
        Referer: `https://try.jd.com/1149552.html`
    }
    try{
        var res=await request.get(url).set(headers);
        let resData = JSON.parse(res.text);
        var shopId = resData.data.shopInfo.shopId;

        // applyBus(id, shopId);
        arr.push({id, shopId})
    }catch(err){
        console.log(err)
    }   
}

async function writeFile (content) {
    fs.appendFile('./text.txt', content, function () {
        console.log('追加内容完成');
    });
    
}

function sleep () {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    })
}

async function applyBus (id, shopID) {
    let url = `https://try.jd.com/migrate/apply?activityId=${id}&source=0`;
    let floow = `https://try.jd.com/migrate/follow?_s=pc&venderId=${shopID}`;
    let headers = {
        Referer: `https://try.jd.com/1149552.html`,
        "Cookie": cookieData,
        'Content-Type': 'application/json;charset=utf-8'
    };
    try{
        await sleep();
        var follwRes = await request.get(floow).set(headers);
        console.log(follwRes.text);
        await sleep();
        var res= await request.get(url).set(headers);
        console.log(res.text);
    }catch(err){
        console.log(err)
    }   
}


async function getPrice (id) {
    let url = `https://p.3.cn/prices/mgets?skuIds=J_${id}&area=0&type=1&source=try&callback=jQuery835369&_=1599966457418`;
    let headers = {
        Referer: `https://try.jd.com/1149552.html`,
        'Content-Type': 'application/json;charset=utf-8'
    };
    try{
        var res=await request.get(url).set(headers);
        console.log(res);
    }catch(err){
        console.log(err)
    }   
}



start(page);
