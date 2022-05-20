import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import toast, { Toaster } from 'react-hot-toast';
import Loader from './Loader';

import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();

  const [isloading, setLoading] = useState(false);

  const responseGoogle = (response) => {
    
    localStorage.setItem('user', JSON.stringify(response.profileObj));

    if (!response.profileObj) {
      toast.error("error: popup_closed_by_user");
    }

    const { name, googleId, imageUrl } = response.profileObj;

    setLoading(true);

    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl,
    }

    client.createIfNotExists(doc)
     .then(() => {
       navigate('/', {replace: true})
       setLoading(false);
     }).catch((error) => {
       console.log(error);
     })

  }

  if(isloading) return <Loader message="Loading..." />

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <Toaster />
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover pointer-events-none"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" className='pointer-events-none' />
          </div>

          <div className="shadow-2xl">
            <GoogleLogin
              clientId={`${process.env.REACT_APP_GOOGLE_PROJECT_TOKEN}`}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" /> Sign in with Google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
