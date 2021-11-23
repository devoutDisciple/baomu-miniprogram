const filterContentTypeByTxt = (type) => {
	let txt = '帖子';
	switch (Number(type)) {
		case 1:
			txt = '帖子';
			break;
		case 2:
			txt = '博客';
			break;
		case 3:
			txt = '投票';
			break;
		case 4:
			txt = 'PK';
			break;
		case 5:
			txt = '视频';
			break;
		case 6:
			txt = '图片';
			break;
		default:
			break;
	}
	return txt;
};

const filterContentTypeByField = (type) => {
	let txt = '帖子';
	switch (type) {
		case 'posts':
			txt = '帖子';
			break;
		case 'blogs':
			txt = '博客';
			break;
		case 'vote':
			txt = '投票';
			break;
		case 'battle':
			txt = 'PK';
			break;
		case 'video':
			txt = '视频';
			break;
		case 'img':
			txt = '图片';
			break;
		default:
			break;
	}
	return txt;
};

const filterUserIdentity = (type) => {
	let txt = '认证科目教师(已实名)';
	switch (Number(type)) {
		case 1:
			txt = '';
			break;
		case 2:
			txt = '认证学校教师(已实名)';
			break;
		case 3:
			txt = '认证机构教师(已实名)';
			break;
		default:
			txt = '认证科目教师(已实名)';
			break;
	}
	return txt;
};

const filterContentTypeByNum = (type) => {
	let txt = 'posts';
	switch (type) {
		case 1:
			txt = 'posts';
			break;
		case 2:
			txt = 'blogs';
			break;
		case 3:
			txt = 'vote';
			break;
		case 4:
			txt = 'battle';
			break;
		case 5:
			txt = 'video';
			break;
		case 6:
			txt = 'img';
			break;
		default:
			break;
	}
	return txt;
};

module.exports = {
	filterContentTypeByTxt,
	filterContentTypeByField,
	filterContentTypeByNum,
	filterUserIdentity,
};
