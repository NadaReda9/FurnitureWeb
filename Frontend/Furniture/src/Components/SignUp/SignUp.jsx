import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import img1 from "./../../assets/login.jpg";

export default function SignUp() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      agree: false
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
      agree: Yup.boolean().oneOf([true], "You must agree to terms")
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.post('http://localhost:8000/api/auth/signup', {
          name: values.name,
          email: values.email,
          password: values.password
        });

        setMessage(res.data.message);

        if (res.data.success) {
          setTimeout(() => navigate("/login"),2000); // redirect after 2 seconds
        }

      } catch (error) {
        if (error.response && error.response.data) {
          setMessage(error.response.data.message);
        } else {
          setMessage("Something went wrong");
        }
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="container mx-auto">
      <div className="lg:flex p-20">
        <div className="Login lg:w-1/2">
          <form onSubmit={formik.handleSubmit} className="max-w-sm mx-auto lg:p-0 p-10">
            <h1 className='font-bold text-2xl mt-10'>Get Start Now</h1>

            {message?<div class=" mt-4 text-xl text-red-800 rounded-lg " role="alert">
 {message}
</div>:null}

            <div className="mb-5 mt-10">
              <label htmlFor="name" className="block mb-2 text-sm font-medium">Name</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                id="name"
                {...formik.getFieldProps('name')}
                placeholder="example"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
              )}
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-sm font-medium">Email Address</label>
              <input
                type="email"
                id="email"
                {...formik.getFieldProps('email')}
               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="example@gmail.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
              <input
                type="password"
                id="password"
                {...formik.getFieldProps('password')}
               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="*******"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>

            <div className="flex items-start mb-5">
              <input
                id="agree"
                type="checkbox"
                {...formik.getFieldProps('agree')}
                className="me-2 mt-1"
              />
              <label htmlFor="agree" className="text-sm font-medium">I agree to the terms & policy</label>
            </div>
            {formik.touched.agree && formik.errors.agree && (
              <p className="text-red-500 text-sm mb-2">{formik.errors.agree}</p>
            )}

            <button
              type="submit"
              className="w-full text-white main_color p-2 border rounded-lg disabled:opacity-50"
              disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
            >
              {formik.isSubmitting ? "Submitting..." : "Submit"}
            </button>

            <div className="flex mt-4">
              <p>Already have account?</p>
              <NavLink to="/login" className="Nav_link font-semibold ms-1 text-green-700 rounded-sm">Sign In</NavLink>
            </div>
          </form>
        </div>

        <div className="hidden lg:block lg:w-1/2">
          <img src={img1} alt="Login img" className='img_login' />
        </div>
      </div>
    </div>
  );
}
