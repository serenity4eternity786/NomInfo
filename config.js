exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                        'mongodb://localhost/nom-info' :
                        'mongodb://localhost/nom-info');
exports.PORT = 3000;