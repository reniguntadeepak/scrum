import React from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import { RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Root from './components/Root';
import Home from './components/Home';
import SigninPage from './components/SigninPage';
import { AuthProvider } from './components/AuthProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/400.css';
import About from './components/About.js';
import { ReactNotifications } from 'react-notifications-component';
import Voting from './components/Voting.js';
import Sessions from './components/Sessions.js';
import JoinSession from './components/JoinSession.js';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="loginpage" element={<LoginPage />} />
      <Route path="home" element={<Home/>} />
      <Route path='signinpage' element={<SigninPage/>}/>
      <Route path='about' element={<About/>}/>
      <Route path='/voting/:id' element={<Voting/>}/>
      <Route path='session' element={<Sessions/>}/>
      <Route path='joinsession' element={<JoinSession/>}/>
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <ReactNotifications />
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;
