import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.js";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    availableCopies: 1
  });
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/books/${id}`, config);
      setBook(data);
      setFormData({
        title: data.title,
        author: data.author || "",
        category: data.category || "",
        description: data.description || "",
        availableCopies: data.availableCopies || 1
      });
    };
    fetchBook();
  }, [id, user]);

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

      const { data } = await axios.put(`/api/books/${id}`, formDataToSend, config);
      setBook(data);
      alert("Book updated successfully");
      navigate("/manage-books");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating book");
    }
  };

  if (!book) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
      
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
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
          <label className="block mb-1">Current Cover Image</label>
          {book.coverImage && (
            <img 
              src={`/${book.coverImage}`} 
              alt={book.title} 
              className="w-24 h-32 object-cover mb-2"
            />
          )}
          <label className="block mb-1">New Cover Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Book
          </button>
          <button
            type="button"
            onClick={() => navigate("/manage-books")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBook;