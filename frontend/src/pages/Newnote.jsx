import React, { useState } from 'react';
import { User, LogOut, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const NewNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [popup, setPopup] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  // React Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align'
  ];

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

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setPopup({
        type: 'error',
        message: 'Please fill in both title and content'
      });
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${backendURL}/notes/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          content,
          tags: []
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPopup({
          type: 'success',
          message: data.message || 'Note created successfully!'
        });
      } else {
        setPopup({
          type: 'error',
          message: data.message || 'Failed to save note'
        });
      }
    } catch (err) {
      console.error('Error saving note:', err);
      setPopup({
        type: 'error',
        message: 'Network error while saving note'
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePopupOk = () => {
    setPopup(null);
    if (popup?.type === 'success') {
      navigate('/');
    }
  };

  const handleCancelDraft = () => {
    if (title.trim() || content.trim()) {
      setShowCancelConfirm(true);
    } else {
      navigate('/');
    }
  };

  const confirmCancelDraft = () => {
    setShowCancelConfirm(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <h3 className="text-2xl font-bold">⚠ Discard Draft?</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-6">
                Are you sure you want to discard this draft? All unsaved changes will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Keep Editing
                </button>
                <button
                  onClick={confirmCancelDraft}
                  className="flex-1 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {popup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            <div className={`p-6 ${popup.type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white`}>
              <h3 className="text-2xl font-bold">
                {popup.type === 'success' ? '✓ Success' : '✕ Error'}
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-6">{popup.message}</p>
              <button
                onClick={handlePopupOk}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                  popup.type === 'success'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Back Button & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-full hover:bg-emerald-50 transition"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-6 h-6 text-emerald-600" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-emerald-600">Create Mode</h1>
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

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Title Input */}
          <div className="p-6 border-b border-gray-200">
            <input
              type="text"
              placeholder="Note Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl md:text-3xl font-bold text-gray-800 placeholder-gray-400 outline-none focus:ring-0 border-none"
            />
          </div>

          {/* React Quill Editor */}
          <div className="quill-wrapper">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Start writing your note..."
              className="quill-editor"
            />
          </div>

          {/* Save Button */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
            <button
              onClick={handleCancelDraft}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Note
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <style>{`
        .quill-wrapper {
          position: relative;
        }

        .quill-editor {
          background: white;
        }   

        .quill-editor .ql-container {
          min-height: 400px;
          font-size: 16px;
          border: none;
        }

        .quill-editor .ql-editor {
          min-height: 400px;
          padding: 24px;
          line-height: 1.8;
          text-align: left;
          padding-left: 1rem;
        }

        .quill-editor .ql-toolbar {
          background: rgb(236 253 245 / 0.5);
          border: none;
          border-bottom: 1px solid #e5e7eb;
          padding: 12px;
        }

        .quill-editor .ql-toolbar button {
          color: #374151;
        }

        .quill-editor .ql-toolbar button:hover {
          color: #10b981;
        }

        .quill-editor .ql-toolbar button.ql-active {
          color: #10b981;
        }

        .quill-editor .ql-stroke {
          stroke: #374151;
        }

        .quill-editor .ql-toolbar button:hover .ql-stroke {
          stroke: #10b981;
        }

        .quill-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #10b981;
        }

        .quill-editor .ql-fill {
          fill: #374151;
        }

        .quill-editor .ql-toolbar button:hover .ql-fill {
          fill: #10b981;
        }

        .quill-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #10b981;
        }

        .quill-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }

        @media (max-width: 768px) {
          .quill-editor .ql-container {
            min-height: 300px;
            font-size: 14px;
          }

          .quill-editor .ql-editor {
            min-height: 300px;
            padding: 16px;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NewNote;