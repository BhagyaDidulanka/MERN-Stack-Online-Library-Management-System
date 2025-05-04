import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Dashboard from "./pages/Dashboard.js";
import AdminPanel from "./pages/AdminPanel.js";
import BookDetails from "./pages/BookDetails.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import Navbar from "./components/Navbar.js";
import ManageBooks from "./pages/ManageBooks.js";
import EditBook from "./pages/EditBook.js";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route 
  path="/admin" 
  element={
    <ProtectedRoute role={["admin", "librarian"]}>
      <AdminPanel />
    </ProtectedRoute>
  } 
/>

        <Route 
          path="/manage-books" 
          element={
            <ProtectedRoute role={["librarian"]}>
              <ManageBooks />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/book/edit/:id" 
          element={
            <ProtectedRoute role={["librarian"]}>
              <EditBook />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
