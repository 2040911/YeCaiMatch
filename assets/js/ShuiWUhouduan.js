const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();
const port = 3000;

// 启用CORS解决跨域问题[7](@ref)
app.use(cors());

// 数据库配置（验证密码是否正确）
const config = {
    user: 'sa',
    password: '1234', // 确认是否与SQL Server实际密码一致
    server: 'localhost',
    database: 'YeCaiMatch',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 10, // 防止连接泄漏[7](@ref)
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// 全局连接池（避免每次请求新建连接）
const poolPromise = new sql.ConnectionPool(config).connect();

app.get('/api/tax', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT CAST(Amount AS FLOAT) AS Amount 
                    FROM Nashuishenbaobiao 
                    WHERE RowID = 20`);
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: '未找到税务数据' });
        }
        
        res.json({ 
            taxAmount: result.recordset[0].Amount 
        });
    } catch (err) {
        console.error("数据库错误:", err);
        res.status(500).json({ 
            error: '数据获取失败',
            details: err.message 
        });
    }
});

app.listen(port, () => {
    console.log(`服务已启动: http://localhost:${port}`);
});