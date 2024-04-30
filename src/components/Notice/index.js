import { h, render } from 'vue'
import alert from "./src/index.vue"

const timeout = 3000;


/*
    type: success | error | info | warning
    message: string
*/

const Notice = (config) => {

    const { msg, type } = config;

    // 一个 notice 高 60px
    const length = document.querySelectorAll('.daisy-notice').length

    const div = document.createElement('div');
    div.classList.add('daisy-notice');

    const node = h(alert, {
        type: type ? type : '',
        message: msg,
        top: length * 80 + 10,
    });
    render(node, div);
    document.body.appendChild(div);
    setTimeout(() => {
        document.body.removeChild(div);
    }, timeout);

}


export default Notice




