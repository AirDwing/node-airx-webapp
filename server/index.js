const app = require('./server');
const { server: serverOptions } = require('./config');

app.listen(serverOptions);
