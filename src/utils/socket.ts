import { io, Socket } from "socket.io-client";
import { ref } from "vue";

// 事件回调类型定义
type EventCallback<T = any> = (data: T) => void;

class SocketService {
  private socket: Socket | null = null;              // Socket.io实例
  private eventHandlers = new Map<string, EventCallback>(); // 事件处理器映射表
  public isConnected = ref(false);                   // 连接状态响应式变量

  // 心跳机制相关属性
  private heartbeatInterval = 30000;                 // 心跳发送间隔（默认30秒）
  private heartbeatTimeout = 5000;                   // 心跳响应超时时间（默认5秒）
  private heartbeatTimer: number | null = null;      // 心跳定时器
  private heartbeatTimeoutTimer: number | null = null; // 心跳超时定时器
  private retryCount = 0;                            // 当前重试次数
  private maxRetry = 3;                              // 最大重试次数（默认3次）

  /**
   * 构造函数
   * @param url - WebSocket服务器地址
   * @param options - 配置选项
   */
  constructor(
    private readonly url: string,
    options: SocketOptions = {}
  ) {
    // 合并配置参数
    this.heartbeatInterval = options.heartbeatInterval || 30000;
    this.heartbeatTimeout = options.heartbeatTimeout || 5000;
    this.maxRetry = options.maxRetry || 3;
  }

  /**
   * 建立WebSocket连接
   */
  connect() {
    console.log('链接地址：', this.url);

    // 初始化Socket.io实例
    this.socket = io(this.url, {
      transports: ["websocket"],       // 强制使用WebSocket传输
      reconnection: true,              // 启用自动重连
      reconnectionAttempts: 3,         // 最大重连尝试次数
      reconnectionDelay: 3000,         // 重连延迟时间
    });

    // 监听服务器pong响应（心跳检测）
    this.socket.on("pong", () => {
      this.clearHeartbeatTimeout();    // 收到响应后清除超时计时器
      this.retryCount = 0;             // 重置重试计数器
    });

    // 基础事件监听
    this.socket.on("connect", () => {
      this.isConnected.value = true;   // 更新连接状态
    });

    this.socket.on("disconnect", () => {
      console.log('socket disconnected???')
      this.isConnected.value = false;  // 更新断开状态
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error); // 错误日志输出
    });

    // 连接成功回调
    this.socket.on("connect", () => {
      this.isConnected.value = true;
      console.log('链接成功回调!!!')
      this.startHeartbeat();           // 启动心跳检测
    });

    // 注册已保存的事件监听器
    this.eventHandlers.forEach((handler, event) => {
      this.socket?.on(event, handler);
    });
  }

  /**
   * 发送消息
   * @param event - 事件名称
   * @param data - 发送数据
   */
  emit<T = any>(event: string, data?: T) {
    if (!this.socket) {
      console.warn("Socket not connected");
      return;
    }
    this.socket.emit(event, data);
  }

  /**
   * 注册事件监听
   * @param event - 事件名称
   * @param callback - 回调函数
   */
  on<T = any>(event: string, callback: EventCallback<T>) {
    this.eventHandlers.set(event, callback); // 保存处理器
    this.socket?.on(event, callback);        // 注册监听
  }

  /**
   * 移除事件监听
   * @param event - 事件名称
   */
  off(event: string) {
    this.eventHandlers.delete(event);  // 移除处理器
    this.socket?.off(event);           // 取消监听
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
    if (this.socket?.connected) {
      this.socket.emit("ping", Date.now()); // 发送当前时间戳
    }
  }

  /**
   * 设置心跳超时检测
   */
  private setHeartbeatTimeout() {
    this.clearHeartbeatTimeout();
    this.heartbeatTimeoutTimer = setTimeout(() => {
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
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
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
    this.stopHeartbeat(); // 停止心跳检测
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected.value = false;
    }
  }
}

// 配置项接口定义
interface SocketOptions {
  heartbeatInterval?: number; // 心跳间隔（毫秒）
  heartbeatTimeout?: number;  // 心跳超时时间（毫秒）
  maxRetry?: number;          // 最大重试次数
  autoReconnect?: boolean;    // 是否自动重连（未实现）
}

/**
 * 创建SocketService实例（工厂函数）
 * @param url - WebSocket服务器地址
 * @returns SocketService实例
 */
export const useSocket = (url: string) => {
  return new SocketService(url);
};