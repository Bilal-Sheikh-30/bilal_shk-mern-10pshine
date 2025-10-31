import React, { useState } from "react";
import { Trash2, UndoDot } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DeletedNoteCard = ({ id, title, content }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${backendURL}/notes/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setShowPopup(false);
        window.location.reload();
      } else {
        console.error("Failed to delete note:", await response.text());
      }
    } catch (err) {
      console.error("Error deleting note:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  
  const handleRestore = async () => {
    try {
    const res = await fetch(`${backendURL}/notes/recover/${id}`, {
      method: 'PATCH',
      credentials: 'include',
    });
    const data = await res.json();
    console.log(data)
    if (res.ok) {
        window.location.reload();
    } else {
      alert(data.message || 'Failed to recover note.');
    }
  } catch (err) {
    console.error('Error recovering note:', err);
    alert('Something went wrong.');
  }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-red-300 cursor-default h-50 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 pb-3 line-clamp-1">
          {title}
        </h3>

        <div className="text-gray-600 mb-4 flex-grow overflow-hidden relative">
          <div
            className="prose prose-sm max-w-none line-clamp-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 text-gray-600">
          <button
            onClick={() => setShowPopup(true)}
            className="flex items-center gap-2 hover:text-red-600 transition"
            title="Delete Permanently"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-sm">Delete</span>
          </button>

          <button
            onClick={handleRestore}
            className="flex items-center gap-2 hover:text-emerald-600 transition"
            title="Restore Note"
          >
            <UndoDot className="w-5 h-5" />
            <span className="text-sm">Restore</span>
          </button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Permanently delete this note?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-60"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeletedNoteCard;
