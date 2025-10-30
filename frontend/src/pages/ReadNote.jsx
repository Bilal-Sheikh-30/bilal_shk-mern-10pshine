import React, { useState, useEffect } from 'react';
import { User, LogOut, ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ReadNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  // Fetch note by ID
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`${backendURL}/notes/${id}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch note');
        const data = await res.json();
        setNote(data);
      } catch (err) {
        console.error('Error fetching note:', err);
      }
    };

    fetchNote();
  }, [id, backendURL]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${backendURL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (err) {
      console.error('Network error during logout', err);
    }
  };

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading note...
      </div>
    );
  }

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      <style>{`
        .note-content h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #065f46;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.2;
        }
        .note-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #047857;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        .note-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #059669;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .note-content p {
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        .note-content strong {
          font-weight: 600;
          color: #111827;
        }
        .note-content em {
          font-style: italic;
        }
        .note-content u {
          text-decoration: underline;
        }
        .note-content s {
          text-decoration: line-through;
        }
        .note-content ul, .note-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .note-content ul {
          list-style-type: disc;
        }
        .note-content ol {
          list-style-type: decimal;
        }
        .note-content li {
          margin-bottom: 0.25rem;
          line-height: 1.6;
        }
        /* Quill bullet list styling */
        .note-content li[data-list="bullet"] {
          list-style-type: disc;
        }
        /* Quill ordered list styling */
        .note-content li[data-list="ordered"] {
          list-style-type: decimal;
        }
        .note-content ul li::marker, .note-content ol li::marker {
          color: #10b981;
        }
        /* Hide Quill UI elements */
        .note-content .ql-ui {
          display: none;
        }
        .note-content .ql-align-center {
          text-align: center;
        }
        .note-content .ql-align-right {
          text-align: right;
        }
        .note-content .ql-align-justify {
          text-align: justify;
        }
      `}</style>

      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Back */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-full hover:bg-emerald-50 transition"
              >
                <ArrowLeft className="w-6 h-6 text-emerald-600" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-emerald-600">
                Read Mode
              </h1>
            </div>

            {/* Right - Profile & Logout */}
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
        </div>
      </nav>

      {/* Note Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">{note.title}</h2>
            <p className="text-sm text-gray-500 mt-2 ">
              Last modified at: {formatDate(note.updatedAt)}
            </p>
          </div>

          <div
            className="note-content text-gray-800"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />

          {/* Footer */}
          <div className="flex items-center justify-between mt-8 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500">
              Created at: {formatDate(note.createdAt)}
            </p>

            <div className="flex items-center gap-5 text-gray-600">
              <button
                onClick={() => navigate(`/editNote/${note._id}`)}
                className="hover:text-emerald-500 transition"
                title="Edit"
              >
                <Edit3 className="w-5 h-5" />
              </button>

              <button
                onClick={() => console.log('delete note logic here')}
                className="hover:text-red-600 transition"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReadNote;