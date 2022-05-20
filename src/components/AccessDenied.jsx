import React from 'react'
import Spinner from './Spinner';

const AccessDenied = () => {
  return (
    <div className='mt-80'>
        <Spinner message="Access-Denied to Admin's Following Page!" />
    </div>
  )
}

export default AccessDenied;