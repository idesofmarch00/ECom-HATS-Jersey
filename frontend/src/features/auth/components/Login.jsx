import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectError, selectLoggedInUser, sendOTPAsync, loginUserWithOTPAsync } from '../authSlice';
import { Link, Navigate } from 'react-router-dom';
import { loginUserAsync } from '../authSlice';
import { useForm } from 'react-hook-form';

export default function Login() {
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const user = useSelector(selectLoggedInUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'phone'
  const [phoneNum, setPhoneNum] = useState('');
  const [otpVal, setOtpVal] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSendOTP = async () => {
    if (!phoneNum) {
      setLocalError('Phone number is required');
      return;
    }
    setLocalError('');
    setOtpMessage('Sending OTP...');
    try {
      const result = await dispatch(sendOTPAsync(phoneNum)).unwrap();
      setOtpSent(true);
      setOtpMessage(`OTP sent! For dev/testing, the code is: ${result.otp} (also printed in server console)`);
    } catch (err) {
      setLocalError(err.message || 'Failed to send OTP. Please check your inputs.');
      setOtpMessage('');
    }
  };

  const handleOTPLogin = async (e) => {
    e.preventDefault();
    if (!phoneNum || !otpVal) {
      setLocalError('Phone number and OTP are required');
      return;
    }
    setLocalError('');
    try {
      await dispatch(loginUserWithOTPAsync({ phone: phoneNum, otp: otpVal })).unwrap();
    } catch (err) {
      setLocalError(err.message || 'Invalid or expired OTP');
    }
  };

  return (
    <>
      {user && <Navigate to="/" replace={true}></Navigate>}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-16 w-auto object-contain"
            src="/logo.png"
            onError={(e) => { e.target.src = "/ecommerce.png" }}
            alt="ECom HATS Jersey"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Log in to your premium hats & jerseys store
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
          {/* Tab Switcher */}
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-8" role="tablist" aria-label="Tabs">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('email');
                setLocalError('');
              }}
              className={`w-full py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                loginMethod === 'email'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod('phone');
                setLocalError('');
              }}
              className={`w-full py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                loginMethod === 'phone'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Phone & OTP
            </button>
          </div>

          {loginMethod === 'email' ? (
            <form
              noValidate
              onSubmit={handleSubmit((data) => {
                dispatch(
                  loginUserAsync({ email: data.email, password: data.password })
                );
              })}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                        message: 'Email not valid',
                      },
                    })}
                    type="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>
                {(error || localError) && (
                  <p className="text-red-500 text-sm mt-3">
                    {localError || (error && (error.message || error))}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                >
                  Log in
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOTPLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone Number
                </label>
                <div className="mt-2 flex space-x-2">
                  <input
                    id="phone"
                    type="text"
                    placeholder="+1234567890"
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 border border-indigo-200 transition-colors shrink-0"
                  >
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    6-Digit OTP Code
                  </label>
                  <div className="mt-2">
                    <input
                      id="otp"
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={otpVal}
                      onChange={(e) => setOtpVal(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 tracking-widest text-center font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              {otpMessage && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-800 text-xs leading-relaxed">
                  {otpMessage}
                </div>
              )}

              {(error || localError) && (
                <p className="text-red-500 text-sm mt-3">
                  {localError || (error && (error.message || error))}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={!otpSent}
                  className={`flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all ${
                    otpSent
                      ? 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600 cursor-pointer'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Verify & Log in
                </button>
              </div>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link
              to="/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

