import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, about, photoUrl, age, gender } = user;

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );

      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err, "error");
    }
  };

  return (
   <div className="card bg-base-300 w-full max-w-sm shadow-2xl hover:shadow-xl transition-all duration-300 rounded-2xl">
      <figure className="h-60 overflow-hidden">
        <img
          src={photoUrl}
          alt="profile"
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body p-6">
       <h2 className="card-title text-2xl font-bold mb-2">
          {firstName} {lastName}
        </h2>
        {age && gender && (
          <p className="text-sm text-gray-300 mb-2">
            <span>{age} </span>
        <span>•</span>
        <span className="ml-1 capitalize">{gender}</span>
          </p>
        )}
         <p className="text-base text-gray-700 line-clamp-3">{about}</p>
        <div className="card-actions justify-center mt-6 gap-4">
          <button
            className="btn btn-outline btn-error px-8  transition"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-primary px-8 hover:bg-primary-focus transition"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
