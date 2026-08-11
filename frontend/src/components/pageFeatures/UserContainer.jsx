import UserCard from "./UserCard.jsx"

const UserContainer = ({users, prepAction}) => {
    return (
        <div>
            {users.map((user)=>(
                <UserCard key={user.user_id} {...user} prepAction={prepAction} />
            ))}
        </div>
    )
}
export default UserContainer