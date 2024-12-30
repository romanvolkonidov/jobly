import Link from 'next/link';

export function DesktopMenu() {
  return (
    <div className="hidden md:flex space-x-6">
      <Link href="/tasks" className="text-gray-600 hover:text-gray-900">
        Find Tasks
      </Link>
      <Link href="/projects" className="text-gray-600 hover:text-gray-900">
        My Projects
      </Link>
      <Link href="/create" className="text-gray-600 hover:text-gray-900">
        Post a Task
      </Link>
    </div>
  );
}
