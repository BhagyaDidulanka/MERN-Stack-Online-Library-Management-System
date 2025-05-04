import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.js";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      const { data } = await axios.get(`/api/books/${id}`);
      setBook(data);
    };
    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post("/api/borrow/borrow", { bookId: id }, config);
      alert("Book Borrowed Successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error borrowing book");
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{book.title}</h1>
      <p className="mt-2">{book.description}</p>
      {book.coverImage && (
        <img
          src={`/${book.coverImage}`}
          alt={book.title}
          className="w-64 h-96 object-cover mt-4"
        />
      )}

      {/* Only show Borrow button if the logged-in user is a normal 'user' */}
      {user && user.role === "user" && (
        <button
          onClick={handleBorrow}
          className="bg-green-600 text-white p-2 rounded mt-4"
        >
          Borrow Book
        </button>
      )}
    </div>
  );
};

export default BookDetails;
