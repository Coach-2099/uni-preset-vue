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

  /**
   * 建立WebSocket连接
   */
  connect() {
    console.log('链接地址：', this.url);

    this.ws = new WebSocket(this.url);

    // 基础事件监听
    this.ws.onopen = () => {
      console.log('WebSocket连接成功');
      // this.isConnected.value = true;
      this.startHeartbeat();
      // 重连时恢复订阅
      this.restoreSubscriptions();
    };

    this.ws.onclose = (e) => {
      console.log('连接关闭', e.reason);
      // this.isConnected.value = false;
      // 原代码中没有handleReconnection方法，推测此处应该调用handleDisconnect方法
      this.handleDisconnect()
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket错误:', error);
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event.data);
    };
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
      const { event, payload } = JSON.parse(data);
      const handler = this.eventHandlers.get(event);
      handler?.(payload);
    } catch (e) {
      console.error('消息解析失败', e);
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
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket未连接");
      return;
    }
    this.ws.send(JSON.stringify({ event, data }));
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
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ event: "ping", data: Date.now() })); // 发送当前时间戳
      }
    }
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
    this.stopHeartbeat();
    this.disconnect();
    setTimeout(() => {
		this.connect()
		location.reload() //为了防止页面断开时已订阅内容数据无法重新监听，强制刷新
	}
	, 3000); // 3秒后尝试重连
  }

  /**
   * 主动断开连接
   */
  disconnect() {
    console.log('主动断开连接');
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