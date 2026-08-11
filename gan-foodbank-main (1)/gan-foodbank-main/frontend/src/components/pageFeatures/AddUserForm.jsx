const AddUserForm = ({handleOnSubmitUser, handleOnChangeUser, newUser}) => {
    return (
        <div>
             <form onSubmit={handleOnSubmitUser}>
                <input 
                    type="text"
                    id="name"
                    name="name"
                    placeholder="User Name"
                    value={newUser.name}
                    onChange={handleOnChangeUser}
                />
                <input 
                    type="text"
                    id="role"
                    name="role"
                    placeholder="Users Role"
                    value={newUser.role}
                    onChange={handleOnChangeUser}
                />
                <input 
                    type="text"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={handleOnChangeUser}
                />
                <button className="adminPgBtn" type="submit">Add</button>
            </form>
        </div>
    )
}

export default AddUserForm