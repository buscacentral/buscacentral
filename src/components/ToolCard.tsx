import Link from 'next/link';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  color?: string;
}

export default function ToolCard({ title, description, href, icon, color = 'blue' }: ToolCardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    green: 'bg-green-50 border-green-200 hover:border-green-400',
    purple: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    orange: 'bg-orange-50 border-orange-200 hover:border-orange-400',
  };

  return (
    <Link
      href={href}
      className={`group block p-10 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${colorClasses[color]}`}
    >
      <div className="text-7xl mb-6 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-base text-gray-600 leading-relaxed">{description}</p>
    </Link>
  );
}
