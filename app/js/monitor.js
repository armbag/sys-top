const path = require('path');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

let cpuOverload = 5;
let alertFrequency = 1;

notifyUser({
	title: 'CPU Overload',
	body: `CPU is over ${cpuOverload}%`,
	icon: path.join(__dirname, 'img', 'icon.png'),
});

// run every 2 seconds
setInterval(() => {
	// cpu usage
	cpu.usage().then((info) => {
		document.getElementById('cpu-usage').innerText = info + '%';

		document.getElementById('cpu-progress').style.width = info + '%';

		// make progress bar red if overload
		if (info >= cpuOverload) {
			document.getElementById('cpu-progress').style.background = 'red';
		} else {
			document.getElementById('cpu-progress').style.background = '#30c88b';
		}

		// check overload
		if (info >= cpuOverload && runNotify(alertFrequency)) {
			notifyUser({
				title: 'CPU Overload',
				body: `CPU is over ${cpuOverload}%`,
				icon: path.join(__dirname, 'img', 'icon.png'),
			});

			localStorage.setItem('lastNotify', new Date());
		}
	});

	cpu.free().then((info) => {
		document.getElementById('cpu-free').innerText = info + '%';
	});

	// uptime
	document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime());
}, 2000);

// set modal
document.getElementById('cpu-model').innerText = cpu.model();

// computer name
document.getElementById('comp-name').innerText = os.hostname();

// os
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`;

// total mem
mem.info().then((info) => {
	document.getElementById('mem-total').innerText = info.totalMemMb;
});

// show days, hours, mins, sec
function secondsToDhms(seconds) {
	seconds += seconds;
	const d = Math.floor(seconds / (3600 * 24));
	const h = Math.floor((seconds % (3600 * 24)) / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60);
	return `${d}d, ${h}h, ${m}m, ${s}s`;
}

// send notification
function notifyUser(options) {
	new Notification(options.title, options);
}

// check how much time has passed since notification
function runNotify(frequency) {
	if (localStorage.getItem('lastNotify') === null) {
		// store timestamp
		localStorage.setItem('lastNotify', +new Date());
		return true;
	}
	const notifyTime = new Date(localStorage.getItem('lastNotify'));
	consolelocalStorage.getItem('lastNotify'));
	const now = new Date();
	console.log(now);
	const diffTime = Math.abs(now - notifyTime);
	console.log(diffTime);

	const minutesPassed = Math.ceil(diffTime / (1000 * 60));

	if (minutesPassed > frequency) {
		return true;
	} else {
		return false;
	}
}
