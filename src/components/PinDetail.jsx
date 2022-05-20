import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { AiTwotoneDelete } from 'react-icons/ai';
import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import { fetchUser } from '../utils/fetchUser';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const users = fetchUser();

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPinDetail(data[0]);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };

  const deleteComment = (id) => {
    const ToRemove = [`comments[comment=="${id}"]`]
    client
      .patch(pinId)
      .unset(ToRemove)
      .commit()
  }


  if(!pinDetail) return <Spinner message="Loading pin..." />
  
  return (
    <>
    <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
      <div className='flex justify-center items-center md:items-start flex-initial'>
        <img 
         src={pinDetail?.image && urlFor(pinDetail.image).url()}
         className="pointer-events-none rounded-t-3xl rounded-bg-lg"
         alt="user-post"
        />
      </div>
      <div className='w-full p-5 flex-1 xl:min-w-620'>
        <div className='flex items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <a 
              href={`${pinDetail.image.asset.url}?dl=`}
              download
              className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
              >
                <MdDownloadForOffline />
              </a>
          </div>
          <a href={pinDetail.destination} target="_blank" rel="noreferrer">
            {pinDetail.destination?.slice(8)}
          </a>
        </div>
        <div>
          <h1 className='text-4xl font-bold break-words mt-3'>
            {pinDetail.title}
          </h1>
          <p className='mt-3'>{pinDetail?.about}</p>
        </div>
        <Link to={`/user-profile/${pinDetail.postedBy?._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
        <img
          className="pointer-events-none w-8 h-8 rounded-full object-cover"
          src={pinDetail.postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{pinDetail.postedBy?.userName}</p>
        </Link>
      <h2 className='mt-5 text-2xl'> Comments </h2>
      <div className='max-h-370 overflow-y-auto'>
        {pinDetail?.comments?.map((comment, i) => (
          <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={i}>
            <Link to={`/user-profile/${comment.postedBy?._id}`}>
            <img
              src={comment.postedBy?.image}
              alt="user-profile"
              className='pointer-events-none w-10 h-10 rounded-full cursor-pointer' 
            />
            </Link>
            <div className='flex flex-col'>
              <p className='font-bold'>{comment.postedBy?.userName}</p>
              <p>{comment.comment}</p>
            </div>
            <div className='flex flex-col mt-4'>
              {comment?.postedBy?._id === users?.googleId ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteComment(comment?.comment);
                  }}
                  className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                >
                  <ReactTooltip />
                  <p data-tip="Delete Comment"><AiTwotoneDelete /></p>
                </button>
              ):null}
            </div>
          </div>
        ))}
      </div>
      <div className='flex flex-wrap mt-6 gap-3'>
      <Link to={`/user-profile/${pinDetail.postedBy?._id}`}>
        <img
          className="pointer-events-none w-10 h-10 rounded-full cursor-pointer"
          src={user?.image}
          alt="user-profile"
        />
      </Link>
      <input
        className= "flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
        onChange={(e) => setComment(e.target.value)}
        placeholder ="Add a comment"
        value={comment}
      />
      <button
         type="button"
         className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
         onClick={addComment}
       >
         {addingComment ? 'Posting the comment...' : 'Post'}
      </button>
      </div>
      </div>
    </div>
    {pins?.length > 0 ? (
      <>
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
       <MasonryLayout pins={pins} />
      </>
    ): (
      <Spinner message="Loading more pins...." />
    )}
    </>
  )
}

export default PinDetail;