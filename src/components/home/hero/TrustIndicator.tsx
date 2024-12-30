interface TrustIndicatorProps {
  icon: string;
  text: string;
}

const TrustIndicator: React.FC<TrustIndicatorProps> = ({ icon, text }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
        <i className={`text-2xl text-white ${icon}`}></i>
      </div>
      <span className="text-white text-sm">{text}</span>
    </div>
  );
};

export default TrustIndicator;