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

  private connectionStatus = {
    lastConnectTime: 0,
    lastMessageTime: 0,
    disconnectCount: 0,
    disconnectReasons: [] as string[],
    networkType: ''
  };

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

    // 确保 isConnected 始终是 ref 对象
    if (typeof this.isConnected !== 'object' || this.isConnected === null || !('value' in this.isConnected)) {
      this.isConnected = ref(false);
    }
  
    console.log('初始化可见性监听');
    this.handleReconnectEvents(); // 确保初始化时注册监听

    // 添加网络状态监控
    uni.getNetworkType({
      success: (res) => {
        this.connectionStatus.networkType = res.networkType;
        console.log('当前网络类型:', res.networkType);
      }
    });
    
    // 监听网络状态变化
    uni.onNetworkStatusChange((res) => {
      const oldNetworkType = this.connectionStatus.networkType;
      this.connectionStatus.networkType = res.networkType;
      console.log(`网络状态变化: ${oldNetworkType} -> ${res.networkType}, 连接状态: ${res.isConnected}`);
      
      // 记录网络变化日志
      this.logConnectionEvent(`网络类型变化: ${oldNetworkType} -> ${res.networkType}`);
      
      if (res.isConnected && !this.isConnected.value) {
        this.handleDisconnect();
      }
    });

  }

  // 添加连接事件日志方法
  private logConnectionEvent(event: string) {
    const now = new Date();
    const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    console.log(`[${timestamp}] ${event}`);
    
    // 在生产环境中，这里可以考虑将日志发送到服务器
    // 或存储在本地，以便后续分析
  }

  // 新增可见性变化回调方法
  private handleVisibilityChange(isVisible: boolean) {
    // 在发送心跳包之前 先判断是否存在socket连接 或者 socket连接状态是否正常，正常才执行，不然就重新执行socket连接事件
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED || this.ws.readyState === WebSocket.CLOSED || this.ws.readyState === WebSocket.CLOSING) {
      console.log('检测到连接已关闭，尝试重新连接');
      this.connect();
      return;
    }
    console.log('应用可见状态变化:', isVisible);
    if (isVisible) {
      // 触发心跳检测连接状态
	  if (!this.isConnected.value) {
	    this.handleDisconnect();
	  }else{
		this.sendHeartbeat();
	  }
    } else {
      // 暂停非必要网络活动
      this.stopHeartbeat();
    }
  }

  // 页面获取焦点时处理
  private handlePageFocus() {
    this.handleVisibilityChange(true);
  }

  // 页面显示处理（适用于移动设备从后台恢复）
  handlePageShow(event: any) {
    // persisted属性为true表示页面是从bfcache中恢复的
    //  || this.pageWasHidden
    if (event.persisted) {
      console.log('页面从缓存恢复，检查WebSocket状态');
      this.handleVisibilityChange(true);
      // this.pageWasHidden = false;
    }
  }

  // 增加多端事件监听
  private handleReconnectEvents() {
    console.log('触发多端监听事件')
    // 通用网络状态监听
    uni.onNetworkStatusChange((res) => {
      if (res.isConnected && !this.isConnected.value) {
        this.handleDisconnect();
      }
    });


    // 统一可见性监听（新增以下代码）
    // #ifdef H5
    // 处理页面可见性变化
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange(document.visibilityState === 'visible');
    });
    // 处理页面重新获得焦点
    window.addEventListener('focus', this.handlePageFocus.bind(this));
    // 移动设备特有的事件
    window.addEventListener('pageshow', this.handlePageShow.bind(this));
    // 添加网络状态监听
    window.addEventListener('online', () => {
      console.log('网络已连接，尝试重新连接WebSocket')
      if (!this.isConnected.value) {
        this.handleDisconnect();
      }
    })
    // #endif

    // #ifdef APP-PLUS
    let visible = true;
    uni.onAppShow(() => {
      if (!visible) {
        this.handleVisibilityChange(true);
        visible = true;
      }
    });
    
    uni.onAppHide(() => {
      this.handleVisibilityChange(false);
      visible = false;
    });
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
      header: {
        'content-type': 'application/json',
        'Cache-Control': 'no-cache',  // 防止缓存
        'Pragma': 'no-cache'
      },
      // 关键：设置更多连接参数
      method: 'GET',             // 使用GET方法建立连接
      protocols: ['protocol1'],  // 协议
      tcpNoDelay: true,          // 禁用Nagle算法，减少小数据包延迟
      perMessageDeflate: false,  // 禁用压缩可以减少CPU使用
      timeout: 15000,            // 15秒连接超时
      success: () => {
        console.log('底层连接已初始化'); 
      },
      fail: (err) => {
        console.error('连接初始化失败', err);
        this.logConnectionEvent(`连接初始化失败: ${JSON.stringify(err)}`);
      }
    });
    // console.log('APP WebSocket 初始化完成', this.ws);

    const socketTask = this.ws as UniApp.SocketTask;
    socketTask.onOpen(() => {
      console.log('WebSocket连接真正建立成功');
      this.handleOpen();
    });

    socketTask.onError((err) => {
      console.error('连接错误详细信息:', {
        errCode: err.errCode,
        errMsg: err.errMsg,
        readyState: socketTask.readyState
      });
      this.handleDisconnect();
    });
    // #endif
  }

  /**
   * 建立WebSocket连接
   */
  connect() {
    console.log('链接地址：', this.url);
    this.connectionStatus.lastConnectTime = Date.now();
    this.logConnectionEvent(`尝试连接: ${this.url}`);

    // this.ws = new WebSocket(this.url);
    this.createWebSocket();

    // #ifdef H5
    // 基础事件监听
    this.ws!.onopen = () => {
      // this.isConnected.value = true;
      this.startHeartbeat();
      if(this.retryCount>0 && this.subscriptions.size>0){
        location.reload() //为了防止页面断开时已订阅内容数据无法重新监听，强制刷新
        this.retryCount = 0
      }
      // 重连时恢复订阅, 已刷新当前页，重新恢复订阅无效，因数据无法被监听处理
      // this.restoreSubscriptions();
    };

    this.ws!.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    uni.onSocketClose((e) => {
      console.log('连接关闭', e);
      this.handleReconnectEvents();
      // this.handleDisconnect();
    });

    // #endif

    // #ifdef APP-PLUS
    // 使用uni-app事件监听
    uni.onSocketOpen(() => {
      console.log('WebSocket连接真正建立成功 onSocketOpen !!');
      this.logConnectionEvent('连接成功建立');
      this.handleOpen();
    });

    uni.onSocketError((error) => {
      this.logConnectionEvent(`Socket错误: ${JSON.stringify(error)}`);
      console.error('Socket错误详情:', error);
    });

    uni.onSocketMessage((e: any) => {
      // console.log('收到消息：!!!', e.data);
      this.handleMessage(e.data)
    });

    uni.onSocketClose((reason) => {
      this.logConnectionEvent(`连接关闭: ${JSON.stringify(reason)}`);
      this.connectionStatus.disconnectCount++;
      this.connectionStatus.disconnectReasons.push(JSON.stringify(reason));
      console.log('连接关闭', reason);
      // 记录连接状态信息，以便分析断开原因
      console.log('连接状态信息:', {
        disconnectCount: this.connectionStatus.disconnectCount,
        lastConnectTime: new Date(this.connectionStatus.lastConnectTime).toLocaleString(),
        lastMessageTime: new Date(this.connectionStatus.lastMessageTime).toLocaleString(),
        networkType: this.connectionStatus.networkType,
        socketState: this.ws ? this.ws.readyState : 'null',
        retryCount: this.retryCount
      });
      this.handleReconnectEvents();
    });

    // #endif

    // 公共错误和关闭处理
    uni.onError((err) => {
      console.error('连接错误详情:', {
        errCode: err.errCode,
        errMsg: err.errMsg,
        url: this.url,
        platform: uni.getSystemInfoSync().platform
      });
      this.handleReconnectEvents(); // 处理重连事件
      // this.handleDisconnect(); 
    });
  }

  private handleOpen() {
    console.log('WebSocket 连接已建立，当前平台:', uni.getSystemInfoSync().platform);

    // 检查 isConnected 是否是 ref 对象
    if (typeof this.isConnected === 'object' && this.isConnected !== null && 'value' in this.isConnected) {
      this.isConnected.value = true;
    } else {
      // 如果不是，重新创建它
      console.warn('isConnected 不是 ref 对象，尝试重新创建');
      this.isConnected = ref(true);
    }

    this.startHeartbeat();

    // 重连逻辑，仅在重试时执行
    if (this.retryCount > 0) {
      console.log(`这是第 ${this.retryCount} 次重连，开始恢复订阅`);
      
      // #ifdef H5
      // H5 端保持原有的刷新页面逻辑
      if (this.subscriptions.size > 0) {
        // location.reload();
        this.retryCount = 0;
        return;
      }
      // #endif
      
      // #ifdef APP-PLUS
      // App 端使用恢复订阅逻辑而不是刷新
      if (this.subscriptions.size > 0) {
        console.log('App 端恢复订阅，不刷新页面');
        this.restoreSubscriptions();
      }
      // #endif
      
      this.retryCount = 0;
    } else {
      console.log('首次连接，不需要恢复订阅');
    }

    // 重置断开计数，如果连接稳定一段时间
    setTimeout(() => {
      if (this.isConnected.value) {
        // 如果连接保持了30秒，认为连接稳定，重置重试计数
        this.retryCount = 0;
        console.log('连接已稳定，重置重试计数');
      }
    }, 30000);
  }

  // 消息处理核心方法
  private handleMessage(data: string) {
    // 更新最后消息时间
    this.connectionStatus.lastMessageTime = Date.now();
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
    const subscribes = Array.from(this.subscriptions);
    console.log('恢复订阅，当前订阅主题:', subscribes);
    
    // 添加延迟，确保连接已完全建立
    setTimeout(() => {
      subscribes.forEach(topic => {
        // 解析主题格式，从主题中提取 symbol 和 topicType
        const parts = topic.split('-');
        let symbol = '';
        let topicType = topic;
        
        if (parts.length > 1) {
          symbol = parts[0];
          topicType = parts.slice(1).join('-');
        }
        
        // 重新订阅
        console.log(`重新订阅: ${topicType}, symbol: ${symbol}`);
        this.subscribe(topicType, symbol);
      });
      
      // 触发所有已注册事件监听器的重新初始化
      console.log('触发事件监听器重新初始化');
      this.triggerEventHandlersReconnect();
    }, 1000);
  }

  // 新增：触发事件监听器重新初始化
  private triggerEventHandlersReconnect() {
    // 向每个事件监听器发送重连通知
    this.eventHandlers.forEach((callback, event) => {
      // 只处理特定格式的事件（如 symbol-ticker）
      if (event.includes('-')) {
        try {
          // 发送一个特殊事件通知监听器重新初始化
          callback({ type: 'reconnect' });
        } catch (e) {
          console.error(`重连通知事件 ${event} 处理失败:`, e);
        }
      }
    });
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
      // if (!this.subscriptions.has(topic)) {
        // {"event":"subscribe","data":"ticker"}
		    // this.ws?.send(JSON.stringify({ event: 'subscribe', data: topic }));
        const message = JSON.stringify({ event: 'subscribe', data: topic });
        // #ifdef H5
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(message);
        }
        // #endif

        // #ifdef APP-PLUS
        if (this.ws?.readyState === 1) {
          uni.sendSocketMessage({ data: message });
        }
        // #endif
        this.subscriptions.add(topic);
      // }
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
    if (this.ws && this.ws.readyState === 1) {
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
      console.log('发送心跳包')
      this.ws.send(JSON.stringify({ event: "ping", data: Date.now() }));
    }
    // #endif


    // #ifdef APP-PLUS
    try {
      // App 端的连接状态检查应更严格
      if (this.ws) {
        // readyState 为 1 表示连接已打开
        if (this.ws.readyState === 1) {
          uni.sendSocketMessage({
            data: JSON.stringify({ event: "ping", data: Date.now() }),
            success: () => {
              console.log('心跳发送成功 (App)');
              this.setHeartbeatTimeout(); // 设置超时检测
            },
            fail: (error) => {
              console.error('心跳发送失败 (App):', error);
              this.handleDisconnect();
            }
          });
        } else {
          console.log(`当前 WebSocket 状态: ${this.ws.readyState}, 需要重连`);
          this.handleDisconnect();
        }
      } else {
        console.log('WebSocket 实例不存在，需要重新连接');
        this.handleDisconnect();
      }
    } catch (error) {
      console.error('发送心跳时出错:', error);
      this.handleDisconnect();
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
    console.log('处理断开连接，当前重试次数:', this.retryCount);
    
    // 先清理任何现有的连接和计时器
    this.stopHeartbeat();
    if (this.ws) {
      try {
        // #ifdef H5
        this.ws.close();
        // #endif
        
        // #ifdef APP-PLUS
        uni.closeSocket();
        // #endif
        
        this.ws = null;
      } catch (e) {
        console.error('关闭现有 Socket 出错:', e);
      }
    }
    
    // 修复: 检查 isConnected 是否仍然是 ref 对象
    if (typeof this.isConnected === 'object' && this.isConnected !== null && 'value' in this.isConnected) {
      this.isConnected.value = false;
    } else {
      // 如果不是 ref 对象，则尝试重新创建它
      console.warn('isConnected 不是 ref 对象，尝试重新创建');
      this.isConnected = ref(false);
    }
    
    // 使用递增的重试延迟，但最大值被限制
    const retryDelay = this.calculateRetryDelay();
    console.log(`将在 ${retryDelay/1000} 秒后尝试第 ${this.retryCount + 1} 次重连`);
    
    // 清除任何现有的重试计时器
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    
    // 设置新的重试计时器，去掉最大重试次数限制
    this.retryTimer = setTimeout(() => {
      this.retryCount++; // 继续递增重试次数，用于计算退避时间
      console.log(`执行第 ${this.retryCount} 次重连...`);
      this.connect();
      
      // 如果重试次数过大，可以在日志中输出警告，但仍然继续重试
      if (this.retryCount > 10) {
        console.warn(`已重试 ${this.retryCount} 次，连接仍未成功，继续尝试...`);
      }
    }, retryDelay);
  }
  

  // 修改退避时间计算，设置更合理的上限
  private calculateRetryDelay(): number {
    // 根据平台采用不同策略
    const isMobile = uni.getSystemInfoSync().platform !== 'h5';
    
    if (isMobile) {
      // 修改为指数退避，但最大值为2分钟
      const maxDelay = 2 * 60 * 1000; // 2分钟
      const baseDelay = 3000; // 3秒基础延迟
      
      // 使用指数退避，但最多不超过最大延迟
      return Math.min(baseDelay * Math.pow(1.5, Math.min(this.retryCount, 10)), maxDelay);
    } else {
      // H5端保持固定间隔
      return 3000;
    }
  }

  /**
   * 主动断开连接
   */
  disconnect() {
    console.log('主动断开连接');
    // #ifdef H5
    // 清理监听
    console.log('初始化可见性监听');
    document.removeEventListener('visibilitychange', () => {
      this.handleVisibilityChange(document.visibilityState === 'visible');
    });
    // #endif

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