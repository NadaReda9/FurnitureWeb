import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BsEmojiTear } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios

const SendResetCodePage = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    email: ''
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
  });

  const handleSubmit = async (values) => {
    if (codeSent) {
     
      navigate('/getcode', { state: { email: values.email } });
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.patch('http://localhost:8000/api/auth/send-forgetPassword-code', {
        email: values.email
      });

      
      if (response.data.success) {
        setMessage(response.data.message || 'Reset code sent successfully to your email');
        setCodeSent(true);
      } else {
        setError(response.data.message || 'Failed to send code, please try again later');
      }
    } catch (err) {
      setError('Network error, please try again');
      console.error('Error sending reset code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-6 main_color2 rounded-lg shadow-md">
      {/* Icon */}
      <div className="flex justify-center text-8xl mt-10 text-red-500 mb-4">
        <BsEmojiTear />
      </div>
      
      {/* Title and description */}
      <h1 className="text-2xl font-bold text-center mb-2">Forgot Your Password?</h1>
      <p className="text-gray-600 text-center mb-6">Enter your email to receive a reset code</p>
      
      <div className="mb-6 border-t border-gray-200"></div>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            {/* Email Field */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="e.g. username@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={codeSent}
                aria-label="Email address input"
              />
              <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full main_color text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label={isLoading ? 'Sending reset code' : codeSent ? 'Proceed to verification' : 'Send reset code'}
            >
              {isLoading 
                ? 'Sending...' 
                : codeSent 
                  ? 'Continue' 
                  : 'Send Reset Code'}
            </button>
            
            {/* Back to Login link */}
            <div className="mt-4 text-center">
              <a href="/login" className="text-blue-600 hover:text-blue-800 text-sm">
                Back to Login
              </a>
            </div>
            
            {/* Success/Error Messages */}
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
      
      {/* Security Notice */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <strong>Security Notice:</strong> For your protection, we'll send a password reset link to your registered email. The link will expire in 24 hours.
        </p>
      </div>
    </div>
  );
};

export default SendResetCodePage;
