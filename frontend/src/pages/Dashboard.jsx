import React, { useState, useEffect } from 'react';
import { Search, User, LogOut, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${backendURL}/notes/`, {
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

  const handleAddNote = () => {
    navigate('/newNote'); 
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

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

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
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-red-50 transition"
                title="Logout"
              >
                <LogOut className="w-6 h-6 text-emerald-600" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Notes Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Link key={note._id} to={`/note/${note._id}`}>
                <NoteCard
                  title={note.title}
                  content={
                    note.content.length > 100
                      ? note.content.slice(0, 100) + '...'
                      : note.content
                  }
                  date={`Last modified: ${new Date(note.updatedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No notes yet. Create your first note!</p>
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <button
        onClick={handleAddNote}
        className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Dashboard;
