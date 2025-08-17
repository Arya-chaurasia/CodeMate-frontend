import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { removeUser } from '../utils/userSlice'

export default function NewNavbar(){
  const user = useSelector(s => s.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async ()=>{
    try{
      await axios.post(BASE_URL + '/logout', {}, { withCredentials: true })
      dispatch(removeUser())
      navigate('/login')
    }catch(e){
      console.error(e)
    }
  }

  return (
    <header className="w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur sticky top-0 z-40 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-20 flex items-center">
        <div className="flex items-center gap-4 flex-1">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-white font-bold">CM</div>
            <div className="hidden sm:block">
              <div className="text-lg font-semibold">CodeMate</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Connect • Collaborate • Create</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-800 rounded-full px-3 py-1 gap-2 w-[38rem]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386-1.414 1.415-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" /></svg>
            <input aria-label="Search developers" className="bg-transparent outline-none w-full text-sm" placeholder="Search skills, companies, locations... " />
          </div>
        </div>

        <nav className="flex items-center gap-6">
          {/* <Link to="/premium" className="hidden sm:inline-block btn btn-sm btn-ghost">Premium</Link> */}
          {!user ? (
            <Link to="/login" className="btn btn-sm">Login</Link>
          ) : (
            <div className="flex items-center gap-8">
              <Link to="/connections" className="hidden md:inline text-md font-bold text-gray-600 dark:text-gray-300">Connections</Link>

              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full overflow-hidden border-2 border-indigo-300/80">
                    <img src={user.photoUrl || '/default-avatar.png'} alt="avatar" />
                  </div>
                </label>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/requests">Requests</Link></li>
                  <li>
                <Link to="/premium" className="hover:bg-primary/20 transition">Premium</Link>
              </li>
                  <li><Link to="/chats" onClick={(e)=>{ /* optionally handle open chat list */ }}>Messages</Link></li>
                  <li><a onClick={handleLogout}>Logout</a></li>
                </ul>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}