const EditUserForm = ({handleOnSubmitEditedUser, handleOnChangeUser, user}) => {
    return (
        <div>
             <form onSubmit={handleOnSubmitEditedUser}>
                <input 
                    type="text"
                    id="name"
                    name="name"
                    placeholder="User Name"
                    value={user.name}
                    onChange={handleOnChangeUser}
                />
                <input 
                    type="text"
                    id="role"
                    name="role"
                    placeholder="Users Role"
                    value={user.role}
                    onChange={handleOnChangeUser}
                />
                <input 
                    type="text"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleOnChangeUser}
                />
                <button className="tableBtn" type="submit">Edit</button>
            </form>
        </div>
    )
}

export default EditUserForm