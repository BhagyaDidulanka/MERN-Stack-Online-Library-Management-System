import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.js";

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loadingReturnId, setLoadingReturnId] = useState(null);

  const fetchHistory = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get("/api/borrow/history", config);
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError("Failed to load borrow history.");
    }
  };

  useEffect(() => {
    fetchHistory(); 
  }, [user]); 

  const handleReturn = async (borrowId) => {
    if (!window.confirm("Are you sure you want to return this book?")) return;

    try {
      setLoadingReturnId(borrowId);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/borrow/return/${borrowId}`, {}, config);
      await fetchHistory(); // Refresh history after return
    } catch (err) {
      console.error("Failed to return book:", err);
      alert("Failed to return book.");
    } finally {
      setLoadingReturnId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Your Borrow History</h1>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {history.map((item) => (
        <div key={item._id} className="p-4 mb-2 border rounded">
          <p><strong>Book:</strong> {item.book ? item.book.title : "Deleted Book"}</p>
          <p><strong>Borrowed On:</strong> {new Date(item.borrowDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {item.returned ? "Returned" : "Borrowed"}</p>
          {item.fine > 0 && <p><strong>Fine:</strong> ₹{item.fine}</p>}

          {!item.returned && (
            <button
              onClick={() => handleReturn(item._id)}
              className="px-4 py-1 mt-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              disabled={loadingReturnId === item._id}
            >
              {loadingReturnId === item._id ? "Returning..." : "Return Book"}
            </button>
          )}
        </div>
      ))}

      {history.length === 0 && !error && (
        <p>You have no borrow history.</p>
      )}
    </div>
  );
};

export default Dashboard;
