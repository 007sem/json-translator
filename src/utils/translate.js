import request from '@/utils/request';
import CryptoJS from "crypto-js";
import formData from 'form-data';
import AxiosJsonPAdapter from 'axios-jsonp';

/*
    有道API需要的字符串截取
*/
function truncate(q) {
	const len = q.length;
	if (len <= 20) return q;
	return q.substring(0, 10) + len + q.substring(len - 10, len);
}

function YouDaoTranslate(appid, secret, q, to) {
	const url = 'https://openapi.youdao.com/api';
	return new Promise((resolve, reject) => {
        
        const form = new formData();
        for (const key in data) {
            form.append(key, data[key]);
        }

        const res = 
        resolve(res)
    });
}


export class YouDao {
    constructor(appid, secret) {

        this.url = 'https://openapi.youdao.com/api';

        this.appid = appid;
        this.secret = secret;
    }
    translate(q, to) {
        return new Promise((resolve, reject) => {

            try{
                const salt = q+to;
                const curtime = Math.round(new Date().getTime() / 1000);
                const str1 = this.appid + truncate(q) + salt + curtime + this.secret;
                const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
                const data = {
                    q,
                    appKey: this.appid,
                    salt,
                    from:"auto",
                    to,
                    sign,
                    signType: "v3",
                    curtime,
                };
                request({
                    url: this.url,
                    method: 'get',
                    params:data,
                    adapter: AxiosJsonPAdapter,
                }).then(res =>{
                    resolve(res.translation[0]);
                })
            } catch(e){
                reject(e);
                return;
            }

            
        })
    }
}