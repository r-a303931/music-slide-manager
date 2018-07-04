import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import { join } from 'path';

import * as io from 'socket.io';

import conf from './conf';
import sockets from './sockets';

const app = express();

const port = process.env.PORT || 3001;
app.set('port', port);
app.disable('x-powered-by');

const server = http.createServer(app);
server.listen(port);
server.on('listening', () => {
	// tslint:disable-next-line:no-console
	console.log(`Server listening on port ${port}`);
});

process.on('uncaughtException', console.log);
process.on('unhandledRejection', console.log);
server.on('error', console.log);

const socketServer = io(server, {
	path: '/api/ws'
});
sockets(socketServer);

app.use(bodyParser.json());

app.use('/teapot', (req, res) => {
	res.status(418);
});

app.use(express.static(join(conf.clientFolder, 'build')));
app.use('*', (req, res) => {
	res.sendFile(join(conf.clientFolder, 'build', 'index.html'));
});