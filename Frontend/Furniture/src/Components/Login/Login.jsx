import React from 'react';
import img1 from "./../../assets/login.jpg";
import { NavLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const response = await axios.post('http://localhost:8000/api/auth/signin', values);
        if (response.data.success) {
          console.log('Login response data:', response.data);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("username",response.data.name)
          navigate('/'); 
          window.location.reload();
          setStatus({ success: response.data.message });
          
        } else {
          setStatus({ error: "Login failed" });
        }
      } catch (error) {
        setStatus({ error: error.response?.data?.message || "Something went wrong" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <div className="container mx-auto">
        <div className="lg:flex p-10">
          <div className="Login lg:w-1/2">
            <form className="max-w-sm mx-auto lg:p-0 p-10" onSubmit={formik.handleSubmit}>
              <h1 className='font-bold text-2xl mt-10'>WELCOME</h1>
              <p className='text-lg font-thin mt-4'>Enter your credentials to access your account</p>

              <div className="mb-5 mt-10">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email Address</label>
                <input
                  type="email"
                  id="email"
                  {...formik.getFieldProps('email')}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="example@gmail.com"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div className="mb-5">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input
                  type="password"
                  id="password"
                  {...formik.getFieldProps('password')}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="*******"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                )}
                <NavLink to='/forgetpassword' className="text-sm text-green-700 ms-1"> Forget Password</NavLink>
              </div>


              <button
                type="submit"
               className="w-full text-white main_color p-2 border rounded-lg disabled:opacity-50"
                disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
>
  {formik.isSubmitting ? "Logging in..." : "Login"}
</button>


              {formik.status?.success && (
                <p className="text-green-500 mt-2">{formik.status.success}</p>
              )}
              {formik.status?.error && (
                <p className="text-red-500 mt-2">{formik.status.error}</p>
              )}

            </form>
          </div>

          <div className="hidden lg:block lg:w-1/2">
            <img src={img1} alt="Login" className='img_login' />
          </div>
        </div>
      </div>
    </>
  );
}


