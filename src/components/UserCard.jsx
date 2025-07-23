const UserCard = ({ user }) => {
  if (!user) return null
  const { firstName, lastName, about, photoUrl, age, gender } = user

  return (
    <div className="card bg-base-300 w-full max-w-sm shadow-md">
      <figure className="h-60 overflow-hidden">
        <img src={photoUrl} alt="profile" className="object-cover w-full h-full" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-xl">
          {firstName} {lastName}
        </h2>
        {age && gender && <p className="text-sm text-gray-400">{age} • {gender}</p>}
        <p className="text-sm">{about}</p>
        <div className="card-actions justify-center mt-4">
          <button className="btn btn-outline btn-error">Ignore</button>
          <button className="btn btn-primary">Interested</button>
        </div>
      </div>
    </div>
  )
}

export default UserCard
