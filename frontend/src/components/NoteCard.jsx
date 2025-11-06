import React from 'react';
import { Calendar } from 'lucide-react';

const NoteCard = ({ title, content, date }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-emerald-300 cursor-pointer h-50 flex flex-col">
      <h3 className="text-xl font-bold text-gray-800  pb-3 line-clamp-1">
        {title}
      </h3>

      <div className="text-gray-600 mb-4 flex-grow overflow-hidden relative">
        <div
          className="prose prose-sm max-w-none line-clamp-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
        <Calendar className="w-4 h-4 text-emerald-600" />
        <span>Last edit: {formatDate(date)}</span>
      </div>
    </div>
  );
};

export default NoteCard;
