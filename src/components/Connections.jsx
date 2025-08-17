import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionSlice'
import { Link } from 'react-router-dom'

const Connections = () => {
    const connections = useSelector((store) => store.connections)
    const dispatch = useDispatch();

    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections",
                { withCredentials: true })
            console.log(res.data.data)
            dispatch(addConnections(res?.data?.data))
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchConnections()
    }, [])

    if (!connections) return;

    if (connections.length === 0) return <h1 className="flex justify-center my-10">No Connections Found</h1>
    return (
        <div className=' text-center my-10 px-4'>
            <h1 className="font-extrabold text-4xl mb-8 text-gray-700">Connections</h1>
             <div className="flex flex-col items-center gap-6">
            {connections.map((connection) => {
                 const { _id, firstName, lastName, about, photoUrl, age, gender } = connection
                return (
                    <div key={_id} className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-base-300 p-6 rounded-2xl shadow-md w-full max-w-2xl mx-auto hover:shadow-xl transition-shadow">
                    <div> 
                    <img alt="photo" className="w-24 h-24 rounded-full object-cover border-2 border-primary/50 shadow-sm" src={photoUrl}/>
                    </div>
                        <div className='text-left flex-1'>
                        <h2 className="text-2xl font-semibold text-gray-300">{firstName + " " + lastName}</h2>
                         {age && gender && 
                         <p className="text-sm text-gray-300 mb-2 capitalize">{age + ", " + gender}</p>}

                        <p className="text-gray-300 line-clamp-3">{about}</p>

                        
                        </div>
                        <Link to={"/chat/"+ _id}>
 <button className='btn btn-primary'>Chat</button>
                        </Link>
                         
                    </div>
                )
            }
            )}
        </div>
        </div>
    )
}

export default Connections