import axios from 'axios'
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import { useEffect } from 'react';
import UserCard from './UserCard';

const Feed = () => {
  const feed = useSelector((store) => store.feed)
  const dispatch = useDispatch()

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      console.log(res, "res")
      dispatch(addFeed(res.data.data))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getFeed();
  }, [])

  if(feed?.length === 0 )
      return (
    <div className="flex justify-center my-16">
      <h1 className="text-xl font-semibold text-gray-500">
        No New Users Found
      </h1>
    </div>
  );

  return (
    feed && (
    <div className='flex justify-center my-8'>
      <UserCard user={feed[0]} />
    </div>
    )
  )
}

export default Feed