import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'

import Shop from './Components/Shop/Shop'
import Products from './Components/Products/Products'
import Servies from './Components/Servies/Servies'


import ContactUS from './Components/ContactUS/ContactUS'
import Login from './Components/Login/Login'
import SignUp from './Components/SignUp/SignUp'
import ForgetPassword from './Components/ForgetPassword/ForgetPassword'
import GetCode from './Components/GetCode/GetCode'
import ChangePassword from './Components/ChangePassword/ChangePassword'
import Logout from './Components/Logout/Logout'

import ProductDetails from './Components/ProductDetails/ProductDetails'
import Feedback from './Components/Feedback/Feedback'

function App() {
  let routes = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },


        { path: "shop", element: <Shop /> },
        { path: "product", element: <Products /> },
        { path: "servies", element: <Servies /> },

        { path: "shop", element: <Shop /> },
        { path: "product", element: <Products /> },
        { path: "servies", element: <Servies /> },
    

        { path: "contactUs", element: <ContactUS /> },
         { path: "feedback", element: <Feedback /> },
        { path: "login", element: <Login /> },
        { path: "signUp", element: <SignUp /> },
        { path: "forgetpassword", element: <ForgetPassword /> },
        { path: "getcode", element: <GetCode /> },
        { path: "changePassword", element: <ChangePassword /> },

        { path: "logout", element: <Logout /> },
        { path: "productDetails/:id", element: <ProductDetails /> },

        { path: "logout", element: <Logout /> }

      ]
    }
  ])

  return (
    <RouterProvider router={routes} />
  )
}

export default App;
