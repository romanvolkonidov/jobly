//src/components/common/navbar/MenuToggle.tsx
//this file works in the following way: it contains the menu toggle button for the navbar
import { Menu } from 'lucide-react';
import { withLazyLoading } from '@/src/components/common/Performance';

type MenuToggleProps = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function MenuToggle({ isMobileMenuOpen, setIsMobileMenuOpen }: MenuToggleProps) {
  return (
    <button 
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
    >
      <Menu className="h-5 w-5 text-gray-600" />
    </button>
  );
}

export default withLazyLoading(MenuToggle);