const env = process.env;

module.exports = {
  port: env.port || 8080,
  host: env.host || '127.0.0.1',
  get serverUrl() {
    return `http://${this.host}:${this.port}`;
  },
};
