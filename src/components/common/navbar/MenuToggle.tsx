//src/components/common/navbar/MenuToggle.tsx
import { Menu } from 'lucide-react';
import { withLazyLoading } from '@/src/components/common/Performance';

type MenuToggleProps = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function MenuToggle({ isMobileMenuOpen, setIsMobileMenuOpen }: MenuToggleProps) {
  return (
    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
      <Menu className="h-6 w-6 text-gray-600" />
    </button>
  );
}

export default withLazyLoading(MenuToggle);

