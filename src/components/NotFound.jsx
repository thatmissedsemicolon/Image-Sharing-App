import React from 'react';
import Spinner from './Spinner';
import { useParams } from 'react-router-dom';

const NotFound = () => {

  const { Id } = useParams();

  return (
    <div className='mt-80'>
        <Spinner message={`The requested URL /${Id} was not found.`} />
    </div>
  )
}

export default NotFound;