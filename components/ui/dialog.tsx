interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dialog = ({ open, onClose, children, className = '' }: DialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto ${className}`}>
        {children}
      </div>
    </div>
  );
};
