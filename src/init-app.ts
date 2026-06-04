import http from 'http';
import { Socket } from 'net';
import path from 'path';

// enable loading from process.ENV
import dotenv from 'dotenv';
dotenv.config();
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import express, { Express, NextFunction, Request, Response, ErrorRequestHandler } from 'express';

import { normalizePort } from './lib/net';
import { getApiCredentialsFromEnvironment } from './lib/get-api-credentials';
import apiRouter from './routes/api';
import { GeocageApiService } from './services/geocage-api-service';
import { handleResponseAsJson } from './middleware/handleResponseAsJson';

export function createAppServer(port: string | number) {
    const app = createApp(port);
    return startServer(app, port);
}
/**
 * Creates the express app
 * @param {int|string} port - The port to run the app on
 * @return {*} The express app
 */
export function createApp(port: string | number) {
    const normalizedPort = normalizePort(port);
    const app: Express = express(); 
    app.set('port', normalizedPort);
    addMiddleware(app);
    addApiRoutes(app);
    addErrorHandlers(app);
    return app;
}

/**
 * Adds middleware functionality into the express app
 * @param {any} app - The express app
 */
function addMiddleware(app: Express): void {
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    const ignoreFavicon = (req: Request, res: Response) => { 
        res.status(204).end();
    };
    app.get('/favicon.ico', ignoreFavicon);
}

/**
 * Adds route info to the express app
 * @param {any} app - The express app
 */
function addApiRoutes(app: Express): void {
    const creds = getApiCredentialsFromEnvironment();
    if (!creds.apiKey) {
        throw new Error('API_KEY environment variable is required');
    }
    const service = GeocageApiService.GetInstance(creds.apiKey);
    app.use(handleResponseAsJson);
    app.use('/api', apiRouter(service.getClient()));   
}

function addErrorHandlers(app: Express): void {
    const errorHandlerMiddleWare: ErrorRequestHandler = (err: any, req: Request, res: Response, _next: NextFunction): void => { // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
    
        // render the error page
        res.status(err.status || 500);
    };
    app.use(errorHandlerMiddleWare);
}

/**
 * Runs the express app in an http server
 * @param {any} app - The express app
 * @param {int|string} port - The port to run the http server on
 * @return {function} Function that handles gracefully shutting down the http server
 */
export function startServer(app: Express, port: string | number) {
    const server = http.createServer(app);

    // error handler
    server.on('error', (error: NodeJS.ErrnoException) => {
        
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
        console.debug(`Listening on port ${port}`);
    });

    let socketId = 0;
    const sockets: { [number: number]: Socket } = {};
    server.on('connection', (socket: Socket) => {
        const id = socketId++;
        sockets[id] = socket;
        socket.on('close', () => delete sockets[id]);
    });

    // start it up
    server.listen(port);

    return () => {
        server.close(() => console.log('Server connection closed'));
        Object.values(sockets).forEach((socket: Socket) => socket.destroy());
    };
}
