import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";

const Request = () => {
    const requests = useSelector((store) => store.requests);
    const dispatch = useDispatch();

    const reviewRequest = async (status, _id) => {
        try {
            const res = await axios.post(
                BASE_URL + "/request/review/" + status + "/" + _id,
                {},
                { withCredentials: true }
            );
            console.log(res);
            dispatch(removeRequest(_id))
        } catch (err) {
            console.error(err, "err");
        }
    };
    const fetchRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/requests", {
                withCredentials: true,
            });

            console.log(res.data.data);
            dispatch(addRequest(res.data?.data));
        } catch (err) {
            console.error(err, "Err in getting requests");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (!requests) return;

    if (requests.length === 0)
        return <h1 className="flex justify-center my-10">No Request Found</h1>;

    return (
      <div className="text-center my-10 px-4">
           <h1 className="font-extrabold text-4xl mb-8 text-gray-700">Requests</h1>
            <div className="flex flex-col items-center gap-6">
            {requests.map((request) => {
                const { _id, firstName, lastName, about, photoUrl, age, gender } =
                    request.fromUserId;
                return (
                
                        <div
                            key={_id}
                             className="flex flex-col md:flex-row justify-between items-center gap-4 bg-base-300 p-6 rounded-2xl shadow-md w-full max-w-2xl mx-auto hover:shadow-xl transition-shadow"
                        >
                            <div>
                                <img
                                    alt="photo"
                                  className="w-24 h-24 rounded-full object-cover border-2 border-primary/50 shadow-sm"
                                    src={photoUrl}
                                />
                            </div>
                            <div className="text-left flex-1">
                                <h2 className="text-2xl font-semibold text-gray-300">{firstName + " " + lastName}</h2>
                                {age && gender && <p className="text-sm text-gray-300 mb-2 capitalize">{age + ", " + gender}</p>}
                                <p className="text-gray-300 line-clamp-3">{about}</p>
                            </div>
                             <div className="flex gap-4 mt-4 md:mt-0">
                                <button
                                     className="btn btn-primary px-8 hover:bg-primary-focus transition"
                                    onClick={() => reviewRequest("accepted", request._id)}
                                >
                                    Accept
                                </button>
                                <button
                                  className="btn btn-error px-8 hover:bg-error-focus transition"
                                    onClick={() => reviewRequest("rejected", request._id)}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    
                );
            })}
        </div>
        </div>
    );
};

export default Request;
