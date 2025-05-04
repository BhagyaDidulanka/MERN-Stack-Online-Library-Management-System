import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.js";

const ManageBooks = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    availableCopies: 1
  });
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get("/api/books", config);
      setBooks(data);
    };
    fetchBooks();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'multipart/form-data'
      }};
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('availableCopies', formData.availableCopies);
      if (coverImage) formDataToSend.append('coverImage', coverImage);

      const { data } = await axios.post("/api/books", formDataToSend, config);
      setBooks([...books, data]);
      setFormData({
        title: "",
        author: "",
        category: "",
        description: "",
        availableCopies: 1
      });
      setCoverImage(null);
    } catch (err) {
      alert(err.response?.data?.message || "Error adding book");
    }
  };

  const handleDelete = async (bookId) => {
    if (user.role !== "librarian") {
      alert("Only librarians are allowed to delete books.");
      return;
    }
  
    if (window.confirm("Are you sure you want to delete this book?")) {
      console.log("Deleting book with ID:", bookId); 
      try {
        const config = {
          headers: { 
            Authorization: `Bearer ${user.token}` 
          }
        };
        
        const { data } = await axios.delete(`/api/books/${bookId}`, config);
  
        setBooks(books.filter((book) => book._id !== bookId));
        alert(data.message || 'Book deleted successfully');
      } catch (err) {
        console.error("Error deleting book:", err);
        if (err.response?.status === 403) {
          alert("You are not authorized to delete this book.");
        } else {
          alert(err.response?.data?.message || "Error deleting book");
        }
      }
    }
  };
  
  

// const handleDelete = async (id) => {
  
//   if (window.confirm("Are you sure you want to delete this book?")) {
//     console.log("Deleting book with ID:", id); 
//     try {
//       const config = {
//         headers: { Authorization: `Bearer ${user.token}` },
//       };
//       await axios.delete(`/api/books/${id}`, config);
//       setBooks(books.filter((book) => book._id !== id));
//     } catch (err) {
//       console.error("Error deleting book:", err);
//     }
//   }
// };
 
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Books</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Book Form */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
            <div>
              <label className="block mb-1">Available Copies</label>
              <input
                type="number"
                name="availableCopies"
                value={formData.availableCopies}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
            <div>
              <label className="block mb-1">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Book
            </button>
          </form>
        </div>

        {/* Books List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">All Books</h2>
          <div className="space-y-4">
            {books.map((book) => (
              <div key={book._id} className="border p-4 rounded-lg flex justify-between items-start">
                <div className="flex gap-4">
                  {book.coverImage && (
                    <img 
                      src={`/${book.coverImage}`} 
                      alt={book.title} 
                      className="w-24 h-32 object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{book.title}</h3>
                    <p className="text-sm">{book.author}</p>
                    <p className="text-sm text-gray-600">{book.category}</p>
                    <p className="text-sm mt-2">{book.description}</p>
                    <p className="text-sm mt-1">Available: {book.availableCopies}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link 
                    to={`/book/edit/${book._id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </Link>

                      {user.role === "librarian" && (
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;
