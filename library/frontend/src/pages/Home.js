import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await axios.get("/api/books");
      setBooks(data);
    };
    fetchBooks();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {books.map((book) => (
        <Link key={book._id} to={`/book/${book._id}`} className="border p-4 rounded hover:shadow-lg">
          <h2 className="text-xl font-semibold">{book.title}</h2>
          <p className="text-sm">{book.author}</p>
          {book.coverImage && <img src={`/${book.coverImage}`} alt={book.title} className="w-full h-48 object-cover mt-2" />}
        </Link>
      ))}
    </div>
  );
};

export default Home;
