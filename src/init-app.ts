import http from 'http';
import express, { Express, NextFunction } from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// enable loading from process.ENV
import dotenv from 'dotenv';
dotenv.config();

import { getApiCredentialsFromEnvironment } from './lib/get-api-credentials';
import apiRouter from './routes/api';
import { geocageApiService } from './services/geocage-api-service';
import { AddressInfo, Socket } from 'net';

/**
 * Creates the express app
 * @param {int|string} port - The port to run the app on
 * @return {*} The express app
 */
export function createApp(port: any) {
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
function addMiddleware(app: Express) {
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
function addRoutes(app: Express) {
    const apiClient = geocageApiService(getApiCredentialsFromEnvironment());
    app.use('/api', apiRouter(getApiCredentialsFromEnvironment, apiClient.forwardGeocode));

    // catch 404 and forward to error handler
    app.use(function(req, res, next: NextFunction) {
        res.status(404);
        next(new Error('Not Found'));
    });

    // error handler
    app.use(function(err: any, req: any, res: any, next: NextFunction) {
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
export function startServer(app: Express, port: any) {
    const server = http.createServer(app);

    // error handler
    server.on('error', (error: any) => {
        
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
        const serverPort = (addr as AddressInfo).port || addr || 3000;        
        const msg = `${bindType} ${serverPort}`;
        console.debug(`Listening on ${msg}`);
    });

    let socketId = 0;
    const sockets: { [number: number]: Socket } = {};
    server.on('connection', socket => {
        const id = socketId++;
        sockets[id] = socket;
        const deleteSocketOnClose = () => (delete sockets[id]);
        socket.on('close', deleteSocketOnClose);
    });

    // start it up
    server.listen(port);

    const destroySocket = (socket: Socket) => (socket.destroy());
    return () => {
        server.close(() => console.log('Server connection closed'));
        Object.values(sockets).forEach(destroySocket);
    };
}
