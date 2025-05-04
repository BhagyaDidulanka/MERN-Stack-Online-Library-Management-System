import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.js";

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const usersData = await axios.get("/api/users", config);
      const borrowsData = await axios.get("/api/borrow/all", config);
      setUsers(usersData.data);
      setBorrows(borrowsData.data);
    };
    fetchData();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <h2 className="text-xl font-semibold mb-2">All Users</h2>
      <ul className="list-disc ml-6">
        {users.map(u => (
          <li key={u._id}>{u.name} - {u.email} ({u.role})</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">All Borrows</h2>
      <ul className="list-disc ml-6">
      {borrows.map(b => (
  <li key={b._id}>
    {b.user ? b.user.name : "Unknown User"} borrowed {b.book ? b.book.title : "Unknown Book"} - {b.returned ? "Returned" : "Borrowed"}
  </li>
))}
      </ul>
    </div>
  );
};

export default AdminPanel;
