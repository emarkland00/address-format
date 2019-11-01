import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { getApiCredentialsFromEnvironment } from './lib/get-api-credentials';
import apiRouter from './routes/api';

import { geocageApiService } from './services/geocage-api-service';

import dotenv from 'dotenv';

dotenv.config();

const app = express();

// app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

module.exports = app;
