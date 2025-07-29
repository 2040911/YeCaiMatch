// 资金池管理系统 JavaScript
class FundPool {
    constructor() {
        this.currentBalance = 7000; // 当前余额（万元）
        this.dailyInflow = 0;    // 今日流入
        this.dailyOutflow = 0;   // 今日流出
        this.maxCapacity = 10000; // 资金池最大容量（万元）
        this.minBalance = 0;     // 最小余额
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.startAnimations();
    }
    
    // 初始化DOM元素
    initializeElements() {
        this.elements = {
            inflowAmount: document.getElementById('inflow-amount'),
            outflowAmount: document.getElementById('outflow-amount'),
            inflowBtn: document.getElementById('inflow-btn'),
            outflowBtn: document.getElementById('outflow-btn'),
            currentBalance: document.getElementById('current-balance'),
            dailyInflow: document.getElementById('daily-inflow'),
            dailyOutflow: document.getElementById('daily-outflow'),
            waterLevel: document.getElementById('water-level'),
            waterPercentage: document.getElementById('water-percentage'),
            logContainer: document.getElementById('log-container')
        };
    }
    
    // 绑定事件监听器
    bindEvents() {
        this.elements.inflowBtn.addEventListener('click', () => this.handleInflow());
        this.elements.outflowBtn.addEventListener('click', () => this.handleOutflow());
        
        // 回车键触发操作
        this.elements.inflowAmount.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleInflow();
        });
        
        this.elements.outflowAmount.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleOutflow();
        });
        
        // 输入验证
        this.elements.inflowAmount.addEventListener('input', (e) => this.validateInput(e));
        this.elements.outflowAmount.addEventListener('input', (e) => this.validateInput(e));
    }
    
    // 输入验证
    validateInput(event) {
        const value = parseFloat(event.target.value);
        if (value < 0) {
            event.target.value = '';
            this.showNotification('金额不能为负数', 'error');
        }
    }
    
    // 处理资金注入
    handleInflow() {
        const amount = parseFloat(this.elements.inflowAmount.value);
        
        if (!this.validateAmount(amount)) return;
        
        if (this.currentBalance + amount > this.maxCapacity) {
            this.showNotification(`注入失败：超出资金池最大容量 ${this.maxCapacity} 万元`, 'error');
            return;
        }
        
        this.currentBalance += amount;
        this.dailyInflow += amount;
        
        this.addTransactionLog('资金注入', amount, 'inflow');
        this.updateDisplay();
        this.animateWaterLevel();
        this.elements.inflowAmount.value = '';
        
        this.showNotification(`成功注入 ${amount.toFixed(2)} 万元`, 'success');
        this.triggerInflowEffect();
    }
    
    // 处理资金流出
    handleOutflow() {
        const amount = parseFloat(this.elements.outflowAmount.value);
        
        if (!this.validateAmount(amount)) return;
        
        if (this.currentBalance - amount < this.minBalance) {
            this.showNotification(`流出失败：余额不足，当前余额 ${this.currentBalance.toFixed(2)} 万元`, 'error');
            return;
        }
        
        this.currentBalance -= amount;
        this.dailyOutflow += amount;
        
        this.addTransactionLog('资金流出', amount, 'outflow');
        this.updateDisplay();
        this.animateWaterLevel();
        this.elements.outflowAmount.value = '';
        
        this.showNotification(`成功流出 ${amount.toFixed(2)} 万元`, 'success');
        this.triggerOutflowEffect();
    }
    
    // 验证金额
    validateAmount(amount) {
        if (isNaN(amount) || amount <= 0) {
            this.showNotification('请输入有效的金额', 'error');
            return false;
        }
        return true;
    }
    
    // 更新显示
    updateDisplay() {
        this.elements.currentBalance.textContent = this.currentBalance.toFixed(2);
        this.elements.dailyInflow.textContent = this.dailyInflow.toFixed(2);
        this.elements.dailyOutflow.textContent = this.dailyOutflow.toFixed(2);
        
        // 更新水位百分比
        const percentage = Math.min((this.currentBalance / this.maxCapacity) * 100, 100);
        this.elements.waterPercentage.textContent = `${percentage.toFixed(1)}%`;
        
        // 更新水位高度
        this.elements.waterLevel.style.height = `${percentage}%`;
        
        // 根据水位调整颜色
        this.updateWaterColor(percentage);
    }
    
    // 更新水的颜色
    updateWaterColor(percentage) {
        let gradient;
        if (percentage < 30) {
            // 低水位 - 红色警告
            gradient = `linear-gradient(0deg, 
                rgba(255, 107, 107, 0.8) 0%, 
                rgba(255, 140, 83, 0.6) 50%, 
                rgba(255, 255, 255, 0.4) 100%)`;
        } else if (percentage < 70) {
            // 中等水位 - 黄色提醒
            gradient = `linear-gradient(0deg, 
                rgba(255, 193, 7, 0.8) 0%, 
                rgba(255, 235, 59, 0.6) 50%, 
                rgba(255, 255, 255, 0.4) 100%)`;
        } else {
            // 高水位 - 蓝绿色正常
            gradient = `linear-gradient(0deg, 
                rgba(0, 212, 255, 0.8) 0%, 
                rgba(0, 255, 136, 0.6) 50%, 
                rgba(255, 255, 255, 0.4) 100%)`;
        }
        
        this.elements.waterLevel.style.background = gradient;
    }
    
    // 水位动画
    animateWaterLevel() {
        this.elements.waterLevel.style.transition = 'height 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // 添加波动效果
        setTimeout(() => {
            this.elements.waterLevel.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.elements.waterLevel.style.transform = 'scale(1)';
            }, 300);
        }, 100);
    }
    
    // 注入特效
    triggerInflowEffect() {
        const poolBorder = document.querySelector('.pool-border');
        poolBorder.style.boxShadow = `
            0 0 80px rgba(0, 255, 136, 0.8),
            inset 0 0 50px rgba(0, 255, 136, 0.4)`;
        
        setTimeout(() => {
            poolBorder.style.boxShadow = `
                0 0 50px rgba(0, 212, 255, 0.5),
                inset 0 0 50px rgba(0, 212, 255, 0.2)`;
        }, 1000);
    }
    
    // 流出特效
    triggerOutflowEffect() {
        const poolBorder = document.querySelector('.pool-border');
        poolBorder.style.boxShadow = `
            0 0 80px rgba(255, 107, 107, 0.8),
            inset 0 0 50px rgba(255, 107, 107, 0.4)`;
        
        setTimeout(() => {
            poolBorder.style.boxShadow = `
                0 0 50px rgba(0, 212, 255, 0.5),
                inset 0 0 50px rgba(0, 212, 255, 0.2)`;
        }, 1000);
    }
    
    // 添加交易记录
    addTransactionLog(type, amount, direction) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <span class="log-time">${timeString}</span>
            <span class="log-desc">${type}</span>
            <span class="log-amount ${direction}">${direction === 'inflow' ? '+' : '-'}${amount.toFixed(2)}万元</span>
        `;
        
        // 添加到日志容器顶部
        this.elements.logContainer.insertBefore(logItem, this.elements.logContainer.firstChild);
        
        // 限制日志条数
        const logItems = this.elements.logContainer.querySelectorAll('.log-item');
        if (logItems.length > 20) {
            logItems[logItems.length - 1].remove();
        }
        
        // 添加动画效果
        logItem.style.opacity = '0';
        logItem.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            logItem.style.transition = 'all 0.5s ease';
            logItem.style.opacity = '1';
            logItem.style.transform = 'translateX(0)';
        }, 100);
    }
    
    // 显示通知
    showNotification(message, type = 'info') {
        // 移除现有通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // 设置样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: 'bold',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'all 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // 根据类型设置背景色
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(45deg, #00ff88, #00d4ff)';
                notification.style.boxShadow = '0 4px 15px rgba(0, 255, 136, 0.4)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e53)';
                notification.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
                break;
            default:
                notification.style.background = 'linear-gradient(45deg, #00d4ff, #26d0ce)';
                notification.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.4)';
        }
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // 启动动画
    startAnimations() {
        // 启动波浪动画
        const waves = document.querySelectorAll('.wave');
        waves.forEach((wave, index) => {
            wave.style.animationDelay = `${index * 0.5}s`;
        });
        
        // 启动数据更新动画
        this.startDataAnimation();
    }
    
    // 数据动画效果
    startDataAnimation() {
        const values = document.querySelectorAll('.value');
        values.forEach(value => {
            value.style.transition = 'all 0.5s ease';
        });
    }
    
    // 重置资金池
    reset() {
        this.currentBalance = 7000;
        this.dailyInflow = 0;
        this.dailyOutflow = 0;
        this.updateDisplay();
        this.elements.logContainer.innerHTML = `
            <div class="log-item">
                <span class="log-time">系统重置</span>
                <span class="log-desc">资金池已重置</span>
                <span class="log-amount">7000.00万元</span>
            </div>
        `;
        this.showNotification('资金池已重置', 'info');
    }
    
    // 获取资金池状态
    getStatus() {
        return {
            currentBalance: this.currentBalance,
            dailyInflow: this.dailyInflow,
            dailyOutflow: this.dailyOutflow,
            utilizationRate: (this.currentBalance / this.maxCapacity * 100).toFixed(2) + '%',
            netFlow: (this.dailyInflow - this.dailyOutflow).toFixed(2)
        };
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 创建资金池实例
    window.fundPool = new FundPool();
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl + R 重置资金池
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            if (confirm('确定要重置资金池吗？')) {
                window.fundPool.reset();
            }
        }
        
        // Ctrl + I 聚焦到注入输入框
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            document.getElementById('inflow-amount').focus();
        }
        
        // Ctrl + O 聚焦到流出输入框
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            document.getElementById('outflow-amount').focus();
        }
    });
    
    // 添加右键菜单功能
    document.querySelector('.pool-border').addEventListener('contextmenu', function(e) {
        e.preventDefault();
        const status = window.fundPool.getStatus();
        alert(`资金池状态:\n当前余额: ${status.currentBalance}万元\n利用率: ${status.utilizationRate}\n今日净流入: ${status.netFlow}万元`);
    });
    
    // 页面可见性变化时的处理
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 页面隐藏时暂停动画
            document.querySelectorAll('.wave').forEach(wave => {
                wave.style.animationPlayState = 'paused';
            });
        } else {
            // 页面显示时恢复动画
            document.querySelectorAll('.wave').forEach(wave => {
                wave.style.animationPlayState = 'running';
            });
        }
    });
    
    console.log('资金池管理系统已启动');
    console.log('快捷键: Ctrl+R(重置), Ctrl+I(注入), Ctrl+O(流出)');
});