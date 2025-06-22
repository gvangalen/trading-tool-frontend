// components/cards/NotificationCard.jsx
'use client';
export default function NotificationCard({ icon, title, subtitle, color = 'bg-white' }) {
  return (
    <div className={`p-4 rounded-xl shadow-md ${color} w-full sm:w-60`}>
      <div className="text-xl mb-1">{icon} <strong>{title}</strong></div>
      <p className="text-sm text-gray-700">{subtitle}</p>
    </div>
  );
}
