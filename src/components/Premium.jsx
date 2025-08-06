import React from 'react'

const Premium = () => {
    return (
        <div className="m-10">
            <div className="flex w-full flex-col lg:flex-row gap-6 items-center justify-center">
                {/* Silver Membership */}
                <div className="card bg-gray-800 text-white rounded-2xl shadow-xl p-6 w-full max-w-md transform hover:scale-105 transition-transform duration-300">
                    <h1 className="font-extrabold text-3xl mb-4 text-center">Silver Membership</h1>
                    <ul className="space-y-2 mb-6 text-gray-300 text-sm">
                        <li className="flex items-center">✅ Chat with other people</li>
                        <li className="flex items-center">✅ 100 connection requests/day</li>
                        <li className="flex items-center">✅ Blue Tick</li>
                        <li className="flex items-center">✅ Valid for 3 months</li>
                    </ul>
                     <button className="btn bg-black text-white w-full hover:bg-gray-900 transition-all">
                        Buy Now
                    </button>
                </div>

                {/* OR Divider */}
                <div className="hidden lg:block text-gray-400 font-semibold text-xl">OR</div>

                {/* Gold Membership */}
                <div className="card bg-gray-800 text-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-md transform hover:scale-105 transition-transform duration-300">
                    <h1 className="font-extrabold text-3xl mb-4 text-center text-white">Gold Membership</h1>
                    <ul className="space-y-2 mb-6 text-white text-sm">
                        <li className="flex items-center">🔥 Chat with other people</li>
                        <li className="flex items-center">🔥 Unlimited connection requests/day</li>
                        <li className="flex items-center">🔥 Blue Tick</li>
                        <li className="flex items-center">🔥 Valid for 6 months</li>
                    </ul>
                    <button className="btn bg-black text-white w-full hover:bg-gray-900 transition-all">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Premium
