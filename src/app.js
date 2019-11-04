import http from 'http';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// enable loading from process.ENV
import dotenv from 'dotenv';
dotenv.config();

import { normalizePort } from './lib/net';
import { getApiCredentialsFromEnvironment } from './lib/get-api-credentials';
import apiRouter from './routes/api';
import { geocageApiService } from './services/geocage-api-service';

/**
 * Creates the express app
 * @param {int|string} port - The port to run the app on
 * @return {*} The express app
 */
function createApp(port) {
    const app = express();
    app.set('port', port);
    addMiddleware(app);
    addRoutes(app);
    return app;
}

/**
 * Adds middleware functionality into the express app
 * @param {any} app - The express app
 */
function addMiddleware(app) {
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
}

/**
 * Adds route info to the express app
 * @param {any} app - The express app
 */
function addRoutes(app) {
    const apiClient = geocageApiService(getApiCredentialsFromEnvironment());
    app.use('/api', apiRouter(getApiCredentialsFromEnvironment, apiClient.forwardGeocode));

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
    });
}

/**
 * Runs the express app in an http server
 * @param {any} app - The express app
 * @param {int|string} port - The port to run the http server on
 * @return {function} Function that handles gracefully shutting down the http server
 */
function startServer(app, port) {
    const server = http.createServer(app);

    // error handler
    server.on('error', error => {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bindType = typeof port === 'string' ? 'Pipe' : 'Port';
        const bind = `${bindType} ${port}`;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });

    // listen handler
    server.on('listening', () => {
        const addr = server.address();
        const bindType = typeof addr === 'string' ? 'pipe' : 'port';
        const serverPort = addr.port || addr;
        const msg = `${bindType} ${serverPort}`;
        console.debug(`Listening on ${msg}`);
    });

    let socketId = 0;
    const sockets = {};
    server.on('connection', socket => {
        const id = socketId++;
        sockets[id] = socket;
        const deleteSocketOnClose = () => (delete sockets[id]);
        
        socket.on('close', deleteSocketOnClose);
    });

    // start it up
    server.listen(port);

    const destroySocket = socket => (socket.destroy());
    return () => {
        console.log('Closing server connection');
        server.close(() => console.log('Server connection closed'));
        Object.values(sockets).forEach(destroySocket);
        console.log('All sockets closed');
    };
}

// execution script
const port = normalizePort(process.env.PORT || 3000);
const app = createApp(port);
const shutdownServer = startServer(app, port);
process.on('SIGINT', shutdownServer);

export default app;
