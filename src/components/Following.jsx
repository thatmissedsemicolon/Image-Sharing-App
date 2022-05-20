import React, { useState, useEffect } from 'react'
import Spinner from './Spinner';
import { useParams, Link } from 'react-router-dom';
import { client } from '../client';
import { fetchUser } from '../utils/fetchUser';

import { userfollowing } from '../utils/data';

const Following = () => {
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [length, setLength] = useState();
    const { userId } = useParams();
    const user = fetchUser();
  
    const Following = () => {
        setLoading(true);
        client
        .fetch(userfollowing)
        .then((data) => {
            const index1 = (data?.map((index) => (index?.save?.map((index) => index?.postedBy?._id === userId))));
            const index2 = (index1?.map((value) => (value?.filter((Boolean)))));
            const index3 = (index2?.filter(Boolean).map((index) => index?.length).filter(Number));
            const index4 =  (a1, a2) => a1.map((index, i) => [index, a2[i]]);
            const index5 =  (a1, a2) => a1.map((index,i) => [index, a2[i]]);
            const index6 = (index4(data?.map((index) => index?.save?.map((index) => index?.postedBy?._id === userId).reduce((acc,cv)=>(cv)?acc+1:acc,0) && index?.image).filter((Boolean)),data?.map((index) => index?.save?.map((index) => index?.postedBy?._id === userId).reduce((acc,cv)=>(cv)?acc+1:acc,0) && index?._id).filter((Boolean))));
            const index7 = data?.map((index) => index?.save?.map((index) => index?.postedBy?._id === userId).reduce((acc,cv)=>(cv)?acc+1:acc,0) && index?.userName).filter((Boolean));
            setLength(index3?.length);
            setFollowing(index5(index6,index7));
            setLoading(false);       
        })
    }
  
    useEffect(() => {
      Following();
    },[userId]);

    const Unfollow = (id) => {
        const ToRemove = [`save[userId=="${userId}"]`]
        client
          .patch(id)
          .unset(ToRemove)
          .commit()
    }

    if(loading) return <Spinner message="Loading..." />
  
    if(!length) return <Spinner message="You are currently not following anyone..." />
  
    return (
        <>
            <div className='md:flex md:flex-row '>
                {following?.map((index, i) => (
                    <div className="flex gap-2 ml-2 lg:w-1/6 md:w-full mt-5 items-center bg-white rounded-lg" key={i}>
                        <Link to={`/user-profile/${index?.[0]?.[1]}`}>
                            <img
                                src={`${index?.[0]?.[0]}`}
                                alt="user-profile"
                                className='pointer-events-none w-10 h-10 rounded-full cursor-pointer md:w-full lg:w-10 lg:h-10' 
                            />
                        </Link>
                        <Link to={`/user-profile/${index?.[0]?.[1]}`}>
                            <div className='flex flex-col'>
                               <p className='font-bold'>{index?.[1]}</p>
                            </div>
                        </Link>
                        {userId === user?.googleId && (
                           <button 
                             onClick={(e) => {
                                 e.stopPropagation();
                                 Unfollow(`${index?.[0]?.[1]}`);
                             }}
                             className='font-bold text-red-500 ml-28 md:m-0'
                           >
                              Unfollow 
                           </button>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

export default Following;