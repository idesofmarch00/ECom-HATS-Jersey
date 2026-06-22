const express = require('express');
const { createUser, loginUser, checkAuth, resetPasswordRequest, resetPassword, logout, sendOTP, loginUserWithOTP } = require('../controller/Auth');
const passport = require('passport');
const { validateSignup, validateLogin, handleValidationErrors } = require('../middleware/validate');

const router = express.Router();
//  /auth is already added in base path
router.post('/signup', validateSignup, handleValidationErrors, createUser)
.post('/login', validateLogin, handleValidationErrors, passport.authenticate('local'), loginUser)
.get('/check',passport.authenticate('jwt'), checkAuth)
.get('/logout', logout)
.post('/reset-password-request', resetPasswordRequest)
.post('/reset-password', resetPassword)
.post('/otp/send', sendOTP)
.post('/otp/login', loginUserWithOTP);

exports.router = router;

