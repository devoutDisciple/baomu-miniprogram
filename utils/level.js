module.exports = (integral) => {
	let level = '小白1';
	let url = '/asserts/public/level1.png';
	const inteNum = Number(integral) || 0;
	// 分为Ⅰ级、Ⅱ级、Ⅲ级、Ⅳ
	switch (inteNum) {
		case inteNum < 500:
			level = '小白 Ⅰ';
			url = '/asserts/public/level1.png';
			break;
		case inteNum < 1000:
			level = '小白 Ⅱ';
			url = '/asserts/public/level2.png';
			break;
		case inteNum < 2000:
			level = '老油子 Ⅰ';
			url = '/asserts/public/level3.png';
			break;
		case inteNum < 4000:
			level = '老油子 Ⅱ';
			url = '/asserts/public/level4.png';
			break;
		case inteNum < 6000:
			level = '资深大佬 Ⅰ';
			url = '/asserts/public/level5.png';
			break;
		case inteNum > 10000:
			level = '资深大佬 Ⅱ';
			url = '/asserts/public/level6.png';
			break;
		default:
			level = '小白 Ⅰ';
			url = '/asserts/public/level1.png';
			break;
	}
	return { level, url };
};
