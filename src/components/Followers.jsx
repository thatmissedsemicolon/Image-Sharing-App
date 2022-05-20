import React, { useState, useEffect } from 'react'
import Spinner from './Spinner';
import { useParams, Link } from 'react-router-dom';
import { client } from '../client';
import { fetchUser } from '../utils/fetchUser';

import { userfollowers } from '../utils/data';

const Followers = () => {
   
  const [followers, setFollowers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState();
  const { userId } = useParams();
  const user = fetchUser();

  const Followers = () => {
    setLoading(true);
    const followers = userfollowers(userId);
    client.fetch(followers).then((data) => {
      setFollowers(data[0]);
      setLength(data[0]?.save?.filter((index) => index.postedBy)?.length);
      setLoading(false);
    });
  }

  useEffect(() => {
    Followers();
  }, [userId]);

  const Unfollow = (id) => {
    const ToRemove = [`save[userId=="${id}"]`]
    client
      .patch(userId)
      .unset(ToRemove)
      .commit()
      .then((data) => {
        console.log(data);
      })
  }

  if(loading) return <Spinner message="Loading followers..." />

  if (!length) return <Spinner message="No followers found.." />
  

  return (
    <>
      <div className='md:flex md:flex-row '>
        {followers?.save?.map((index, i) => (
            <div className="flex gap-2 ml-2 lg:w-1/6 md:w-full mt-5 items-center bg-white rounded-lg" key={i}>
              <Link to={`/user-profile/${index.postedBy?._id}`}>
              <img
                src={index?.postedBy?.image}
                alt="user-profile"
                className='pointer-events-none w-10 h-10 rounded-full cursor-pointer md:w-30 md:h-30 lg:w-10 ' 
              />
              </Link>
              <Link to={`/user-profile/${index.postedBy?._id}`}>
                <div className='flex flex-col'>
                  <p className='font-bold'>{index.postedBy?.userName}</p>
                </div>
              </Link>
              {userId === user?.googleId && (
                <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      Unfollow(`${index.postedBy?._id}`);
                  }}
                  className='font-bold text-red-500 ml-28 md:ml-0 md:text-sm'
                >
                  Remove 
                </button>
              )}
            </div>
        ))}
      </div>
    </>
  )
}

export default Followers;
