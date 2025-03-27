import { io, Socket } from "socket.io-client";
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
      this.isConnected.value = true;
      this.startHeartbeat();
      // 重连时恢复订阅
      this.restoreSubscriptions();
    };

    this.ws.onclose = (e) => {
      console.log('连接关闭', e.reason);
      this.isConnected.value = false;
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
    try {
      const { event, payload } = JSON.parse(data);
      const handler = this.eventHandlers.get(event);
      handler?.(payload);
      
      // 心跳响应处理
      if (event === 'pong') {
        this.clearHeartbeatTimeout();
        this.retryCount = 0;
      }
    } catch (e) {
      console.error('消息解析失败', e);
    }
  }

  // 恢复订阅
  private restoreSubscriptions() {
    // 实现原有的订阅恢复逻辑...
  }


  /**
   * 通用订阅方法
   * @param topicType - 主题类型 (ticker/depth)
   * @param symbols - 交易对数组
   */
  subscribe(topicType: 'ticker' | 'depth', symbols: string[]) {
    const topic = `${topicType}_${symbols.join(',')}`;
    if (!this.subscriptions.has(topic)) {
      this.emit('subscribe', {
        type: topicType,
        symbols
      });
      this.subscriptions.add(topic);
    }
  }

  /**
   * 通用取消订阅方法
   * @param topicType - 主题类型 (ticker/depth)
   * @param symbols - 交易对数组
   */
  unsubscribe(topicType: 'ticker' | 'depth', symbols: string[]) {
    const topic = `${topicType}_${symbols.join(',')}`;
    if (this.subscriptions.has(topic)) {
      this.emit('unsubscribe', {
        type: topicType,
        symbols
      });
      this.subscriptions.delete(topic);
    }
  }

  /**
   * 用户主题订阅
   * @param userId - 用户ID
   * @param topics - 订阅主题数组
   */
  subscribeUser(userId: string, topics: string[]) {
    const topicKey = `${userId}_${topics.join(',')}`;
    if (!this.userSubscriptions.has(topicKey)) {
      this.emit('subscribe_user', {
        user_id: userId,
        topics
      });
      this.userSubscriptions.add(topicKey);
    }
  }

   /**
   * 用户主题取消订阅
   * @param userId - 用户ID
   * @param topics - 取消订阅主题数组
   */
   unsubscribeUser(userId: string, topics: string[]) {
    const topicKey = `${userId}_${topics.join(',')}`;
    if (this.userSubscriptions.has(topicKey)) {
      this.emit('unsubscribe_user', {
        user_id: userId,
        topics
      });
      this.userSubscriptions.delete(topicKey);
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
    // 由于类中没有socket属性，这里应使用WebSocket实例ws来处理事件
    // 原代码中没有使用socket的需求，将其替换为ws
    // 但是WebSocket本身没有on方法，可通过监听message事件并在handleMessage中处理
    // 这里不需要额外代码，因为事件处理逻辑已在handleMessage中实现
    // 因此，此代码行可移除
    // this.socket?.on(event, callback);
  }

  /**
   * 移除事件监听
   * @param event - 事件名称
   */
  off(event: string) {
    this.eventHandlers.delete(event);  // 移除处理器
    // 由于类中没有socket属性，这里应使用WebSocket实例ws来处理事件
    // WebSocket本身没有off方法，可通过移除事件处理器来实现取消监听
    // 原代码中已经在上面通过 this.eventHandlers.delete(event) 移除了处理器，因此此行代码多余，应移除
    // this.socket?.off(event);           // 取消监听
  }

  //------------------- 心跳机制私有方法 -------------------
  
  /**
   * 启动心跳检测
   */
  private startHeartbeat() {
    this.stopHeartbeat(); // 确保先停止已有定时器
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
      this.setHeartbeatTimeout();
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
      this.heartbeatTimeout = null;
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
    setTimeout(() => this.connect(), 3000); // 3秒后尝试重连
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
      this.isConnected.value = false;
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