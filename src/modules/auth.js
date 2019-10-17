const config = require('config');
const crypto = require('crypto');

module.exports = {
    generateSalt() {
        return crypto.randomBytes(config.get('auth.local.saltSize')).toString('base64');
    },
    hashPassword(password, salt) {
        return crypto.pbkdf2Sync(password, salt,
            config.get('auth.local.pbkdf2.iteration'),
            config.get('auth.local.pbkdf2.keylen'),
            config.get('auth.local.pbkdf2.digest')).toString('base64');
    },
}