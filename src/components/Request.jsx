import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequest } from '../utils/requestSlice'

const Request = () => {
    const requests = useSelector((store) => store.requests)
const dispatch = useDispatch();
    const fetchRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/requests",
                { withCredentials: true })

            console.log(res.data.data)
            dispatch(addRequest(res.data?.data))
        } catch (err) {
            console.error(err, "Err in getting requests")
        }

    }

    useEffect(() => {
        fetchRequests()
    }, [])

   if (!requests) return;

    if (requests.length === 0) return <h1>No Request Found</h1>
    return (
        <div className=' text-center my-10'>
            <h1 className='text-bold text-3xl'>Requests</h1>
            {requests.map((request) => {
                 const { _id, firstName, lastName, about, photoUrl, age, gender } = request.fromUserId
                return (
                    <>
                        <div key={_id} className='flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 w-2/3 mx-auto'>
                            <div>
                                <img alt="photo" className="w-20 h-20 rounded-full" src={photoUrl} />
                            </div>
                            <div className='text-left mx-4'>
                                <h2 className='font-bold'>{firstName + " " + lastName}</h2>
                                {age && gender && <p>{age + ", " + gender}</p>}
                                <p>{about}</p>
                            </div>
                            <div className='flex'>
                            <button className="btn btn-active btn-primary mx-2">Accept</button>
                            <button className="btn btn-active btn-error mx-2">Reject</button>
                        </div>
                        </div>
                        
                    </>
                )
            }
            )}
        </div>
    )
}

export default Request