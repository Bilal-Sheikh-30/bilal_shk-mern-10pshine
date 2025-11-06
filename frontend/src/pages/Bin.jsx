import React, { useState, useEffect } from 'react';
import { User, LogOut, House  } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DeletedNoteCard from '../components/DeletedNoteCard';

const Bin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${backendURL}/notes/bin`, {
          method: 'GET',
          credentials: 'include', 
        });

        if (!res.ok) throw new Error('Failed to fetch notes');

        const data = await res.json();
        setNotes(data.requestedNotes || []); 
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };

    fetchNotes();
  }, [backendURL]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${backendURL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Network error during logout', err);
    }
  };


  const handlehome = () => {
    navigate('/'); 
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-emerald-600">Notes.</h1>

            {/* Profile & Logout */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="p-2 rounded-full hover:bg-emerald-50 transition"
                >
                  <User className="w-6 h-6 text-emerald-600" />
                </button>
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-56 bg-emerald-50/80 backdrop-blur-md rounded-xl shadow-lg border border-emerald-100">
                    <div className="px-4 py-3 border-b border-emerald-100">
                      <p className="text-sm font-semibold text-emerald-800">{user.name}</p>
                      <p className="text-sm text-emerald-600">{user.email}</p>
                      <p className="text-sm text-emerald-600 mt-1">
                        Joined: {new Date(user.signupDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handlehome}
                className="p-2 rounded-full hover:bg-emerald-50 transition"
                title="Home"
              >
                <House className="w-6 h-6 text-emerald-600" />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-red-50 transition"
                title="Logout"
              >
                <LogOut className="w-6 h-6 text-emerald-600" />
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* Notes Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <DeletedNoteCard
                id={note._id}
                title={note.title}
                content={note.content}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No notes yet. Create your first note!</p>
          </div>
        )}
      </main>

    </div>
  );
};

export default Bin;
