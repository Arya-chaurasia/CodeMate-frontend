import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastname] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl);
  const [age, setAge] = useState(user?.age);
  const [gender, setGender] = useState(user?.gender);
  const [about, setAbout] = useState(user?.about);
  const [error, setError] = useState();
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, about, photoUrl, age, gender },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error(err, "err in saving profile");
      setError(err.response?.data);
    }
  };
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-start gap-12 p-8 min-h-screen bg-base-200">
        {/* Left: Edit Form */}
        <div className="bg-white dark:bg-base-100 p-8 rounded-2xl shadow-xl w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-6">Edit Your Profile</h2>

          <div className="space-y-5">
            <input
              type="text"
              name="firstName"
              value={firstName || ""}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="lastName"
              value={lastName || ""}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Last Name"
              className="input input-bordered w-full"
            />
            <input
              type="number"
              name="age"
              value={age || ""}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              className="input input-bordered w-full"
            />
            <select
              name="gender"
              value={gender || ""}
              onChange={(e) => setGender(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>

            <input
              type="text"
              name="photoUrl"
              value={photoUrl || ""}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Photo URL"
              className="input input-bordered w-full"
            />
            <textarea
              name="about"
              value={about || ""}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="About yourself"
              className="textarea textarea-bordered w-full"
            />
            {error && <p className="text-error font-semibold">{error}</p>}
           <button className="btn btn-primary w-full text-lg hover:bg-primary-focus transition" onClick={saveProfile}>
              Save Profile
            </button>
          </div>
        </div>

        {/* Right: UserCard */}
        <div className="w-full md:w-1/2 flex justify-center">
          <UserCard
            user={{ firstName, lastName, photoUrl, age, gender, about }}
          />
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
