import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // إذا كنتِ تستخدمين ملف CSS
import App from './App.jsx';  // تأكدي من أن اسم الملف هو App.jsx
// إذا لم تستخدمين reportWebVitals، يمكنك حذف السطر التالي
// import reportWebVitals from './reportWebVitals';  

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // هذا يقوم بإرفاق التطبيق إلى div في index.html
);

// إذا كنتِ تستخدمين تقرير الأداء
// reportWebVitals();  // يمكنك حذفه إذا لم تستخدمينه
