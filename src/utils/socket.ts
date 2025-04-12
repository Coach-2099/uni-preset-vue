/// <reference types="@dcloudio/types" />
import { ref } from "vue";

// 事件回调类型定义
type EventCallback<T = any> = (data: T) => void;

class SocketService {
  private ws: WebSocket | null = null;
  private eventHandlers = new Map<string, EventCallback>();
  public isConnected = ref(false);

  // 心跳机制相关属性
  private heartbeatInterval = 30000;
  private heartbeatTimeout = 5000;
  private heartbeatTimer: number | null = null;
  private retryCount = 0;
  private maxRetry = 3;


  private subscriptions = new Set<string>(); // 存储已订阅主题
  private userSubscriptions = new Set<string>(); // 存储用户主题订阅

  // 断开连接时的处理函数
  private disconnectHandlers: Function[] = [];

  /**
   * 构造函数
   * @param url - WebSocket服务器地址
   * @param options - 配置选项
   */
  constructor(
    private readonly url: string,
    options: SocketOptions = {}
  ) {
    this.heartbeatInterval = options.heartbeatInterval || 30000;
    this.heartbeatTimeout = options.heartbeatTimeout || 5000;
    this.maxRetry = options.maxRetry || 3;
  }


  // 增加多端事件监听
  private handleReconnectEvents() {
    // 通用网络状态监听
    uni.onNetworkStatusChange((res) => {
      if (res.isConnected && !this.isConnected.value) {
        this.handleDisconnect();
      }
    });

    
    // #ifdef H5
    // H5端使用页面可见性API
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.handleDisconnect();
      }
    });
    // #endif


    // #ifdef APP-PLUS
    // APP端使用uni-app生命周期
    let appShowCallback: Function;

    // 前台事件
    appShowCallback = () => {
      if (!this.isConnected.value) {
        this.handleDisconnect();
      }
    };
    uni.onAppShow(appShowCallback);

    // 后台事件
    uni.onAppHide(() => {
      this.disconnect();
    });

    // 清理监听
    this.disconnectHandlers.push(() => {
      uni.offAppShow(appShowCallback);
    });
    // #endif


    // #ifdef APP-PLUS
    // 区分平台处理
    const platform = uni.getSystemInfoSync().platform;
    // 安卓锁屏处理（iOS通常不需要）
    if (platform === 'android' && typeof plus !== 'undefined') {
      plus.globalEvent.addEventListener('lock', () => this.disconnect());
      plus.globalEvent.addEventListener('unlock', () => this.handleDisconnect());
    }
    // #endif
  }

  // 多端websocket 初始化方式
  private createWebSocket() {
    // #ifdef H5
    this.ws = new WebSocket(this.url);
    console.log('H5 WebSocket 初始化完成');
    // #endif
  
    // #ifdef APP-PLUS
    this.ws = uni.connectSocket({
      url: this.url,
      complete: (v) => {
				console.log("正准备建立websocket中...", v);
				// 返回实例
			},
    });
    console.log('APP WebSocket 初始化完成');
    // #endif
  }

  /**
   * 建立WebSocket连接
   */
  connect() {
    console.log('链接地址：', this.url);

    // this.ws = new WebSocket(this.url);
    this.createWebSocket();

    // #ifdef H5
    // 基础事件监听
    this.ws!.onopen = () => {
      // this.isConnected.value = true;
      this.startHeartbeat();
      if(this.retryCount>0){
        location.reload() //为了防止页面断开时已订阅内容数据无法重新监听，强制刷新
        this.retryCount = 0
      }
      // 重连时恢复订阅, 已刷新当前页，重新恢复订阅无效，因数据无法被监听处理
      // this.restoreSubscriptions();
    };

    this.ws!.onmessage = (event) => {
      this.handleMessage(event.data);
    };
    // #endif

    // #ifdef APP-PLUS
    // 使用uni-app事件监听
      uni.onSocketOpen(() => this.handleOpen());
      uni.onSocketMessage((e: any) => {
        console.log('收到消息：', e.data);
        this.handleMessage(e.data)
      });
    // #endif

    // 公共错误和关闭处理
    uni.onSocketError((err) => {
      console.error('连接错误详情:', {
        errCode: err.errCode,
        errMsg: err.errMsg,
        url: this.url,
        platform: uni.getSystemInfoSync().platform
      });
      // this.handleReconnectEvents(); // 处理重连事件
      this.handleDisconnect(); 
    });
    uni.onSocketClose((e) => {
      console.log('连接关闭', e);
      this.handleDisconnect();
    });
  }

  private handleOpen() {
    this.startHeartbeat();
    
    // #ifdef H5
    if(this.retryCount > 0) {
      location.reload(); // H5端强制刷新恢复订阅
      this.retryCount = 0;
    }
    // #endif
  
    // APP端不需要强制刷新，直接恢复订阅
    // #ifdef APP-PLUS
    // this.restoreSubscriptions();

    // #endif
  }
  

  // 消息处理核心方法
  private handleMessage(data: string) {
    if (data === 'ok') return; // 过滤服务端确认消息
    // 心跳响应处理
    else if(data === 'pong'){
      this.clearHeartbeatTimeout();
      this.retryCount = 0;
      return;
    }
    try {
      const { event, payload,type } = JSON.parse(data);
      const handler = this.eventHandlers.get(event);
      handler?.(payload,type);
    } catch (e) {
      // console.error('消息解析失败', e);
    }
  }

  // 恢复订阅
  private restoreSubscriptions() {
    // 实现原有的订阅恢复逻辑...
    const  subscribes = Array.from(this.subscriptions)
    console.log('this.subscriptions= {0}',subscribes)
    subscribes.forEach(topic=>{
      this.subscribe(topic,'')
    })
  }


  /**
     * 通用订阅方法
     * @param topicType - 主题类型 (ticker/depth)
     * @param symbols - 交易对数组
     */
    subscribe(topicType: string, symbol: string) {
      let topic  = ''
      if (!symbol || symbol.length === 0) {
        topic = `${topicType}`
      } else {
        // 组合式
        topic = `${symbol}-${topicType}`;
      }
      if (!this.subscriptions.has(topic)) {
        // {"event":"subscribe","data":"ticker"}
		    this.ws?.send(JSON.stringify({ event: 'subscribe', data: topic }));	
        this.subscriptions.add(topic);
      }
    }
  
    /**
     * 通用取消订阅方法
     * @param topicType - 主题类型 (ticker/depth)
     * @param symbols - 交易对数组
     */
    unsubscribe(topicType: string, symbol: string) {
      let topic  = ''
      if (!symbol || symbol.length === 0) {
        topic = `${topicType}`
      } else {
        // 组合式
        topic = `${symbol}-${topicType}`;
      }
      if (this.subscriptions.has(topic)) {
        this.ws?.send(JSON.stringify({ event: 'unsubscribe', data: topic }));
        this.subscriptions.delete(topic);
      }
    }
  
    /**
     * 用户主题订阅
     * @param userId - 用户ID
     * @param topics - 订阅主题数组
     */
    subscribeUser(userId: string) {
      if (!this.userSubscriptions.has(userId)) {
			this.ws?.send(JSON.stringify({ event: 'subscribe_user', data: userId }));
        this.userSubscriptions.add(userId);
      }
    }
  
     /**
     * 用户主题取消订阅
     * @param userId - 用户ID
     * @param topics - 取消订阅主题数组
     */
     unsubscribeUser(userId: string) {
      if (this.userSubscriptions.has(userId)) {
        this.ws?.send(JSON.stringify({ event: 'unsubscribe_user', data: userId }));
        this.userSubscriptions.delete(userId);
      }
    }
  

  /**
   * 发送消息
   * @param event - 事件名称
   * @param data - 发送数据
   */
  emit<T = any>(event: string, data?: T) {
    // #ifdef H5
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }));
    }
    // #endif

    // #ifdef APP-PLUS
    if (this.ws && (this.ws as UniApp.SocketTask).readyState === 0) {
      uni.sendSocketMessage({
        data: JSON.stringify({ event, data })
      });
    }
    // #endif
  }


  /**
   * 注册事件监听
   * @param event - 事件名称
   * @param callback - 回调函数
   */
  on<T = any>(event: string, callback: EventCallback<T>) {
    this.eventHandlers.set(event, callback); // 保存处理器
  }

  /**
   * 移除事件监听
   * @param event - 事件名称
   */
  off(event: string) {
    this.eventHandlers.delete(event);  // 移除处理器
  }

  //------------------- 心跳机制私有方法 -------------------
  
  /**
   * 启动心跳检测
   */
  private startHeartbeat() {
    this.stopHeartbeat(); // 确保先停止已有定时器
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
      // this.setHeartbeatTimeout();
    }, this.heartbeatInterval) as unknown as number;
  }

  /**
   * 发送心跳包
   */
  private sendHeartbeat() {
    // #ifdef H5
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event: "ping", data: Date.now() }));
    }
    // #endif

    // #ifdef APP-PLUS
    if (this.ws && (this.ws as unknown as UniApp.SocketTask).readyState === 0) {
      uni.sendSocketMessage({
        data: JSON.stringify({ event: "ping", data: Date.now() })
      });
    }
    // #endif
  }

  /**
   * 设置心跳超时检测
   */
  private setHeartbeatTimeout() {
    this.clearHeartbeatTimeout();
    this.heartbeatTimeout = setTimeout(() => {
      if (this.retryCount < this.maxRetry) {
        this.retryCount++;
        this.sendHeartbeat();         // 重试发送心跳
        this.setHeartbeatTimeout();   // 重置超时计时器
      } else {
        console.error("Heartbeat timeout, reconnecting...");
        this.handleDisconnect();      // 触发重连逻辑
      }
    }, this.heartbeatTimeout) as unknown as number;
  }

  /**
   * 清除超时计时器
   */
  private clearHeartbeatTimeout() {
    // 修改为使用已存在的属性
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      // 修改为 null 是因为类型不匹配，修改为 undefined 以符合类型定义
      this.heartbeatTimeout = undefined;
    }
  }

  /**
   * 停止心跳检测
   */
  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    this.clearHeartbeatTimeout();
  }

  /**
   * 处理断开连接
   */
  private handleDisconnect() {
    // this.stopHeartbeat();
    // this.disconnect();
    // setTimeout(() => {
    //   this.connect()
    //   this.retryCount++;
    // }, 3000); // 3秒后尝试重连
    const retryDelay = this.calculateRetryDelay(); 
    this.retryTimer = setTimeout(() => {
      if (this.retryCount < this.maxRetry) {
        console.log(`第${this.retryCount + 1}次重连...`);
        this.connect();
        this.retryCount++;
      }
    }, retryDelay);
  }

  private calculateRetryDelay(): number {
    // 根据平台采用不同策略
    const isMobile = uni.getSystemInfoSync().platform !== 'h5';
    return isMobile ? 
      Math.min(3000 * Math.pow(2, this.retryCount), 30000) : // APP端指数退避
      3000; // H5端固定间隔
  }

  /**
   * 主动断开连接
   */
  disconnect() {
    console.log('主动断开连接');
    // 清理所有事件监听
    this.disconnectHandlers.forEach(handler => handler());
    this.disconnectHandlers = [];

    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, '正常关闭');
      this.ws = null;
      // this.isConnected.value = false;
    }
  }
}
// 配置项接口定义
// 更新配置接口
interface SocketOptions {
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
  maxRetry?: number;
}

/**
 * 创建SocketService实例（工厂函数）
 * @param url - WebSocket服务器地址
 * @returns SocketService实例
 */
export const useSocket = (url: string, options?: SocketOptions) => {
  return new SocketService(url, options);
};