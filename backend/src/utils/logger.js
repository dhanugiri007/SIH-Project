const levels = { info: '\x1b[36m', warn: '\x1b[33m', error: '\x1b[31m' };
const reset = '\x1b[0m';

function log(level, message) {
  const color = levels[level] || '';
  console.log(`${color}[${level.toUpperCase()}]${reset} ${new Date().toISOString()} - ${message}`);
}

module.exports = {
  info: (msg) => log('info', msg),
  warn: (msg) => log('warn', msg),
  error: (msg) => log('error', msg),
};