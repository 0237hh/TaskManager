import useAuth from "../hooks/useAuth";

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) return <p>Loading...</p>;

    return (
        <div className="container">
            <h2>Profile</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Profile;
