module.exports = {
  apps: [
    {
      name: 'dfgroup-monitor',
      script: 'yarn run start',
      env: {
        NODE_ENV: 'dev',
      },
      env_test: {
        NODE_ENV: 'test',
      },
      env_prod: {
        NODE_ENV: 'prod',
      },
      // 实例个数
      instances: 2,
      // 集群模式
      // exec_mode: 'cluster',
      // 完整日志路径
      output: '/root/logs/dfgroup-monitor/output.log',
      // 错误日志路径
      error: '/root/logs/dfgroup-monitor/error.log',
      // 访问日志路径
      log: '/root/logs/dfgroup-monitor/access_log.log',
      // 日志格式
      log_type: 'json',
      // 合并日志
      merge_logs: true,
      // 日志日期格式
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
