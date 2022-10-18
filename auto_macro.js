const cheerio = require("cheerio");
const axios = require("axios");

const currentTime = new Date();
const parseCurrentTime = today();

// url 은 추적하고자 하는 깃주소를 배열로 담는다.
const url = ['http://github.com/layerdst'];

let lists = [];
let result = {};
let count = 0;

function today(){
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth()+1;
    const day = currentTime.getDate();
    return year+'-'+month+'-'+day;
}

function getPage(page){
    return axios.get(page)
        .then(res=>lists.push(page,res))
        .catch(err=>console.log('axios 에러' + err));
}

function crawling(){
    const $ = cheerio.load(lists[1].data);
    const parse2 = $("rect");
    parse2.each((i, el)=>{
        if(el.attribs['data-date'] == parseCurrentTime){
            // console.log(el.attribs['data-date'] + "-"+ parseInt(el.attribs['data-level']));
            count++;
            result[lists[0].split(".com/")[1]] = el.attribs['data-date']+ " " + 
                (parseInt(el.attribs['data-level'])>0 ? true : false);
        };
    });
    lists = [];
}

function displayResult(){
    if(url.length ==count){
        console.log("======== 금일 잔디==========")
        console.log(result);
    }
}

async function movePage(page){
    await getPage(page);
    await crawling();
    await displayResult();
}

url.forEach(v=>movePage(v));
