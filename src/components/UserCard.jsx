// src/components/UserCard.jsx
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import React, { useState } from "react";

const UserCard = ({ user = {}, showActions = true }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, about, photoUrl, age, gender } = user;
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async (status, userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("request error:", err);
      // optionally show toast with error.response?.data?.message
    } finally {
      setLoading(false);
    }
  };

  const imgSrc = photoUrl || "/default-avatar.png";

  return (
    <div className="card bg-base-300 w-full max-w-sm shadow-2xl hover:shadow-xl transition-all duration-300 rounded-2xl">
      <figure className="h-90 overflow-hidden">
        <img
          src={imgSrc}
          alt={firstName ? `${firstName} ${lastName}` : "Profile picture"}
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

        {/* safe clamp fallback so you don't need the plugin immediately */}
        <p
          className="text-base text-gray-700 mb-2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {about || "No bio provided."}
        </p>

        {showActions && (
          <div className="card-actions justify-center mt-6 gap-4">
            <button
              className="btn btn-outline btn-error px-6 transition"
              onClick={() => handleSendRequest("ignored", _id)}
              disabled={loading}
              aria-label={`Ignore ${firstName}`}
            >
              {loading ? "Please wait..." : "Ignore"}
            </button>
            <button
              className="btn btn-primary px-6 hover:bg-primary-focus transition"
              onClick={() => handleSendRequest("interested", _id)}
              disabled={loading}
              aria-label={`Send interest to ${firstName}`}
            >
              {loading ? "Sending..." : "Interested"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
