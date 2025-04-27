// GoldBrokerRssParser.js
import axios from 'axios';
// 使用多种代理服务作为备选方案，提高成功率
const proxyServices = [
	{
		name: 'RSS2JSON',
		url: 'https://api.rss2json.com/v1/api.json?rss_url=',
		processResponse: (response) => {
			if (response.data.status !== 'ok') {
				throw new Error('RSS2JSON 返回非成功状态');
			}

			return {
				title: response.data.feed.title,
				description: response.data.feed.description,
				link: response.data.feed.link,
				lastBuildDate: response.data.feed.lastBuildDate,
				items: response.data.items.map(item => ({
					title: item.title,
					link: item.link,
					pubDate: item.pubDate,
					creator: item.author,
					categories: item.categories,
					description: item.description || item.content
				}))
			};
		}
	},
	// {
	// 	name: 'AllOrigins',
	// 	url: 'https://api.allorigins.win/raw?url=',
	// 	processResponse: async (response) => {
	// 		// 这里我们收到的是原始 XML
	// 		const parser = new DOMParser();
	// 		const xmlDoc = parser.parseFromString(response.data, 'text/xml');

	// 		// 解析 RSS 源
	// 		const channel = xmlDoc.querySelector('channel');
	// 		if (!channel) {
	// 			throw new Error('找不到 RSS 频道信息');
	// 		}

	// 		// 提取信息
	// 		const getElementText = (element, tagName) => {
	// 			const el = element.querySelector(tagName);
	// 			return el ? el.textContent : null;
	// 		};

	// 		// 解析所有文章条目
	// 		const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => {
	// 			return {
	// 				title: getElementText(item, 'title'),
	// 				link: getElementText(item, 'link'),
	// 				pubDate: getElementText(item, 'pubDate'),
	// 				creator: getElementText(item, 'dc\\:creator') || getElementText(item, 'creator'),
	// 				categories: Array.from(item.querySelectorAll('category')).map(cat => cat.textContent),
	// 				description: getElementText(item, 'description')
	// 			};
	// 		});

	// 		return {
	// 			title: getElementText(channel, 'title'),
	// 			description: getElementText(channel, 'description'),
	// 			link: getElementText(channel, 'link'),
	// 			lastBuildDate: getElementText(channel, 'lastBuildDate'),
	// 			items
	// 		};
	// 	}
	// },
	// {
	// 	name: 'Cors Anywhere',
	// 	url: 'https://cors-anywhere.herokuapp.com/',
	// 	processResponse: async (response) => {
	// 		const parser = new DOMParser();
	// 		const xmlDoc = parser.parseFromString(response.data, 'text/xml');

	// 		const channel = xmlDoc.querySelector('channel');
	// 		if (!channel) {
	// 			throw new Error('找不到 RSS 频道信息');
	// 		}

	// 		const getElementText = (element, tagName) => {
	// 			const el = element.querySelector(tagName);
	// 			return el ? el.textContent : null;
	// 		};

	// 		const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => {
	// 			return {
	// 				title: getElementText(item, 'title'),
	// 				link: getElementText(item, 'link'),
	// 				pubDate: getElementText(item, 'pubDate'),
	// 				creator: getElementText(item, 'dc\\:creator') || getElementText(item, 'creator'),
	// 				categories: Array.from(item.querySelectorAll('category')).map(cat => cat.textContent),
	// 				description: getElementText(item, 'description')
	// 			};
	// 		});

	// 		return {
	// 			title: getElementText(channel, 'title'),
	// 			description: getElementText(channel, 'description'),
	// 			link: getElementText(channel, 'link'),
	// 			lastBuildDate: getElementText(channel, 'lastBuildDate'),
	// 			items
	// 		};
	// 	}
	// }
];

// 尝试从 RSS 源获取数据
export default {
	async fetchRssData() {
		const targetRssUrl = 'https://goldbroker.com/news.rss';
		let feedData = {}
		// 依次尝试每种代理服务，直到成功
		for (const service of proxyServices) {
			try {
				console.log(`尝试使用 ${service.name} 获取 RSS 数据...`);
				const response = await axios.get(`${service.url}${encodeURIComponent(targetRssUrl)}`);

				// 处理响应
				feedData = service.processResponse(response);
				
				console.log(`使用 ${service.name} 成功获取数据`);
				break; // 如果成功获取了数据，跳出循环
			} catch (err) {
				console.error(`使用 ${service.name} 获取数据失败:`, err);
				// 继续尝试下一个服务
			}
		}

		// 检查是否成功获取数据
		if (!feedData) {
			console.log('所有代理服务均无法获取 RSS 数据，请检查网络连接或稍后再试。');
		}
		return feedData

	}
};