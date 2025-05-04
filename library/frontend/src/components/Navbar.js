import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 flex justify-between text-white">
      <div>
        <Link to="/" className="font-bold">Library</Link>
      </div>
      <div className="flex gap-4">
        {user ? (
          <>
            {/* <Link to="/dashboard">Dashboard</Link> */}
            {user.role === "user" && <Link to="/dashboard">dashboard</Link>}
            {(user.role === "librarian" || user.role === "admin") && (<Link to="/admin">AdminDshbord</Link>)}
            {(user.role === "librarian") && (<Link to="/manage-books">Manage Books</Link>)}
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
