import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate } from 'react-router-dom';
import 'react-notifications-component/dist/theme.css';
import { ReactNotifications, Store } from 'react-notifications-component';
import './SigninPage.css';

function SigninPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const showNotification = (title, message, type = "success") => {
    Store.addNotification({
      title: title,
      message: message,
      type: type,
      insert: "top",
      container: "bottom-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 4000
      }
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!validateEmail(formData.email)) {
      setValidationError('Invalid email address');
      showNotification("Error", "Invalid email address", "danger");
      return;
    }

    if (!validatePassword(formData.password)) {
      setValidationError('Password must be at least 8 characters long');
      showNotification("Error", "Password must be at least 8 characters long", "danger");
      return;
    }

    const response = await fetch('http://localhost:3000/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.redirected) {
      window.location.href = response.url;
      showNotification("Success","Sucessfully","success")
    } else {
      setError('Try with a different username, password, and email');
      showNotification("Error", "Try with a different username, password, and email", "danger");
    }
  };

  return (
    <div>
      <div className="signin-container">
        {isAuthenticated && <Navigate to="/home" />}
        <h1>Sign in</h1>
        <form onSubmit={submitForm}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default SigninPage;
