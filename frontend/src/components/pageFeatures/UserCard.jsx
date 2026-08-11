const UserCard = ({index, first_name, role, prepAction}) => {
    return (
        <div>
            <p>{first_name} | {role}  <button className="adminPgBtn" onClick={()=>prepAction(index, "edit")} >edit</button> <button className="adminPgBtn" onClick={()=>prepAction(index, "delete")} >delete</button></p>
        </div>
    )
}
export default UserCard