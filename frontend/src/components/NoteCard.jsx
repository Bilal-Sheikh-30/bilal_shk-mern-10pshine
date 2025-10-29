import React from 'react';
import { Calendar } from 'lucide-react';

const NoteCard = ({ title, content, date }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-emerald-300 cursor-pointer">
      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-1">
        {title}
      </h3>

      <div
        className="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="w-4 h-4 text-emerald-600" />
        <span>{formatDate(date)}</span>
      </div>
    </div>
  );
};

export default NoteCard;
