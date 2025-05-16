import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { MdPublishedWithChanges } from "react-icons/md";

const VerifyCodePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  // Get email from navigation state or prompt the user
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // Optionally prompt the user for the email
      setEmail(prompt('Please enter your email:') || '');
    }
  }, [location]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    code: Yup.string()
      .required('Verification code is required')
      .matches(/^\d+$/, 'Code must contain only numbers'),
      
    newPassword: Yup.string()
      .required('New password is required')
      .min(4, 'Password must be at least 4 characters')
      .matches(/^[A-Za-z0-9]+$/, 'Password must contain only letters and numbers'),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setError('');
    setMessage('');

    const token = localStorage.getItem('token'); // Get the token from localStorage
    if (!token) {
      setError('No valid token found.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.patch('http://localhost:8000/api/auth/verify-forgetPassword-code',
        {
          email: values.email, // Send email from Formik values
          providedCode: values.code,
          newPassword: values.newPassword, // Send new password
        },
        {
          headers: {
            'client': 'not-browser',
            'Authorization': `Bearer ${token}`, // Send the token in the header
          },
        }
      );

      if (response.data.success) {
        setMessage(response.data.message || 'Password updated successfully');
        // Redirect to login or other relevant page
        navigate('/login');
      } else {
        setError(response.data.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('Network error, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0) return; // Prevent sending if time has not elapsed

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/send-forgetPassword-code',
        { email },
        {
          headers: {
            'client': 'not-browser',
          },
        }
      );

      if (response.data.success) {
        setMessage(response.data.message || 'New code sent successfully');
        setTimeLeft(300); // Reset timer
      } else {
        setError(response.data.message || 'Failed to resend code');
      }
    } catch (err) {
      setError('Network error, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 my-10 main_color2 rounded-lg shadow-md">
      {/* Title and description */}
      <div className="flex justify-center text-8xl mt-10 text-red-500 mb-4">
         <MdPublishedWithChanges />
            </div>
      <h1 className="text-2xl font-bold text-center mb-2">Verify Your Account</h1>
      <p className="text-gray-600 text-center mb-6">
        We've sent a verification code to {email}
      </p>

      {/* Countdown timer */}
      <div className="text-center text-red-600 font-medium mb-6">
        {formatTime(timeLeft)}
      </div>

      <div className="mb-6 border-t border-gray-200"></div>

      <Formik
        initialValues={{ email, code: '', newPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            {/* Email Field */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Verification Code Field */}
            <div className="mb-6">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <Field
                type="text"
                id="code"
                name="code"
                placeholder="Enter 5 or 6-digit code"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="code" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {/* New Password Field */}
            <div className="mb-6">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <Field
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="Enter your new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="newPassword" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || timeLeft <= 0}
              className={`w-full main_color text-white py-2 px-4 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isLoading || timeLeft <= 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Changing Password...' : 'Changing..'}
            </button>

            {/* Resend Code Button */}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isLoading || timeLeft > 0}
              className={`mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                isLoading || timeLeft > 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Resend Code
            </button>

            {/* Messages */}
            {message && (
              <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-sm">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
          </Form>
        )}
      </Formik>

      {/* Help Text */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          If you're having trouble with the verification process, please check your spam folder or contact our support.
        </p>
      </div>
    </div>
  );
};

export default VerifyCodePage;
