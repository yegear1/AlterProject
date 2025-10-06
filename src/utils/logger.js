const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

const getTimestamp = () => {
    return new Date().toLocaleString('pt-BR');
};

const logInfo = (...args) => {
    console.log(`${colors.cyan}[INFO]${colors.reset} [${getTimestamp()}]`, ...args);
};

const logSuccess = (...args) => {
    console.log(`${colors.green}[SUCCESS]${colors.reset} [${getTimestamp()}]`, ...args);
};

const logError = (...args) => {
    console.error(`${colors.red}[ERROR]${colors.reset} [${getTimestamp()}]`, ...args);
};

const logWarning = (...args) => {
    console.warn(`${colors.yellow}[WARNING]${colors.reset} [${getTimestamp()}]`, ...args);
};

export {logError, logInfo, logSuccess, logWarning};