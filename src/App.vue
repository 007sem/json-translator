<script setup>
import { ref, reactive } from 'vue';

import Header from '@/components/Header';
import Label from '@/components/Label';
import Notice from '@/components/Notice';

import supportedLanguages from '@/utils/supportedLanguages';
import { YouDao } from '@/utils/translate';

const to = ref('zh-CNS');

const timer = ref(null);
const isLoading = ref(false);
const ProgressValue = ref(0);
const result = ref([]);
const keys = reactive({
	appkey: '',
	secret: '',
});

const uploadJson = ref(null);

/*
    {
      en: {
        fileName: 'test.json',
        content: {
          hello: 'world'
          header:{
            title: 'hello world'
          }
        }
      }
    }

*/

async function translate() {
	if (isLoading.value) {
		Notice({ type: 'warning', msg: '正在翻译' });
		return;
	}
	if (keys.appkey === '' || keys.secret === '') {
		Notice({ type: 'warning', msg: '请填写appkey和secret' });
		return;
	}
	if (!uploadJson.value) {
		Notice({ type: 'warning', msg: '请上传json文件' });
		return;
	}
	const youdao = new YouDao(keys.appkey, keys.secret);
	isLoading.value = true;

	const arr = traverse(uploadJson.value);
	const length = arr.length;
	ProgressValue.value = 0;
	let count = 0;
	let resArr = [];
	timer.value = setInterval(() => {
		let { key, value } = arr[count];
		youdao.translate(value, to.value).then((res) => {
			resArr.push({
				key,
				value: res,
			});
		});
		count++;
		ProgressValue.value = Math.floor((count / length) * 100);
		if (count >= length) {
			result.value.push({
				fileName: to.value + '.json',
				content: processTreeData(resArr),
			});
			isLoading.value = false;
			Notice({ type: 'success', msg: '翻译完成' });
			clearInterval(timer.value);
		}
	}, 1000);
}

function processTreeData(data) {
	const result = {};

	function addToResult(obj, keys, value) {
		if (keys.length === 0) {
			return;
		}

		const key = keys[0];
		if (!obj[key]) {
			obj[key] = keys.length === 1 ? value : {};
		}

		addToResult(obj[key], keys.slice(1), value);
	}

	data.forEach((item) => {
		const keys = item.key.split('.');
		addToResult(result, keys, item.value);
	});

	return result;
}

// 遍历JSON树
function traverse(obj, path = '', arr = []) {
	for (const key in obj) {
		if (typeof obj[key] === 'object') {
			traverse(obj[key], path + key + '.', arr);
		} else {
			arr.push({
				key: path + key,
				value: obj[key],
			});
		}
	}
	return arr;
}

function uploadChange(e) {
	const file = e.target.files[0];
	const reader = new FileReader();
	reader.readAsText(file);
	reader.onload = () => {
		uploadJson.value = JSON.parse(reader.result);
		console.log(uploadJson.value);
	};
}

function dowloadFile(fileName, Json) {
	const blob = new Blob([JSON.stringify(Json)], { type: 'application/json' });
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = fileName;
	a.click();
	window.URL.revokeObjectURL(url);
	a.remove();
}
</script>
<template>
	<div class="mx-auto bg-slate-50 h-screen">
		<Header />
		<div class="sm:container md:mx-auto my-20">
			<h1 class="text-7xl">YouDao 翻译工具(JSON File)</h1>
			<p class="my-10 text-slate-700">
				<a href="https://ai.youdao.com/" target="_blank" class="text-blue-700">有道翻译</a>
				提供的翻译API，可以免费使用，但需要申请appkey和secret。（支持更多平台开发中）
			</p>
		</div>
		<div class="md:container md:mx-auto m-20 flex justify-between">
			<div>
				<div class="flex items-end mb-10">
					<Label label="请输入appkey">
						<input
							v-model="keys.appkey"
							type="text"
							placeholder="appkey"
							class="input input-bordered input-primary w-full max-w-xs"
						/>
					</Label>
					<Label label="请输入secret">
						<input
							v-model="keys.secret"
							type="text"
							placeholder="secret"
							class="input input-bordered input-primary w-full max-w-xs"
						/>
					</Label>
				</div>

				<div class="flex items-end">
					<Label label="请选择JSON文件">
						<input
							@change="uploadChange"
							type="file"
							class="file-input file-input-bordered file-input-primary w-full max-w-xs"
						/>
					</Label>
					<Label label="请选择目标语言">
						<select v-model="to" class="select select-primary w-full max-w-xs">
							<option v-for="item in supportedLanguages" :value="item.key" :key="item.key">{{ item.name }}</option>
						</select>
					</Label>
					<Label>
						<button class="btn btn-primary" @click="translate">点击开始翻译</button>
					</Label>
				</div>
			</div>

			<div class="flex flex-col items-center rounded-lg p-10 w-1/2 shadow shadow-blue-200">
				<div v-show="isLoading" class="flex flex-col items-center">
					<p class="my-10">正在翻译中，请耐心等待</p>
					<span>{{ ProgressValue }} %</span>
					<progress class="progress progress-primary w-56" :value="ProgressValue" max="100"></progress>
				</div>

				<div class="flex flex-col items-center">
					<div v-if="result.length > 0" class="flex flex-col items-end">
						<div v-for="item in result" :key="item.key" class="flex items-center my-6">
							<span class="mx-10">{{ item.fileName }}</span>
							<button class="btn" @click="dowloadFile(item.fileName, item.content)">下载文件</button>
						</div>
					</div>
					<div v-show="!isLoading" v-else>当前无翻译结果</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
