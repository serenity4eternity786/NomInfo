exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                        'mongodb://user:user@ds019906.mlab.com:19906/nominfo' :
                        'mongodb://user:user@ds019906.mlab.com:19906/nominfo');
exports.PORT = 3000;