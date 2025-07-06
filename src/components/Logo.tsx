
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const Logo = ({ size = "md", showText = true, className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  return (
    <Link to="/" className={`flex items-center text-white hover:text-blue-700/80 transition-colors ${className}`}>
      <div className={`${sizeClasses[size]} mr-2 relative`}>
        <img
          src="/lovable-uploads/edfad3b9-edd8-4928-a9d4-7a01d9605d4b.png"
          alt="FastPool Logo"
          className="w-full h-full object-contain brightness-0 invert"
          style={{
            filter: 'brightness(0) saturate(100%) invert(1) sepia(0) saturate(0) hue-rotate(0deg)'
          }}
        />
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'white',
            mask: 'url(/lovable-uploads/edfad3b9-edd8-4928-a9d4-7a01d9605d4b.png) no-repeat center/contain',
            WebkitMask: 'url(/lovable-uploads/edfad3b9-edd8-4928-a9d4-7a01d9605d4b.png) no-repeat center/contain'
          }}
        />
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold`}>
          Zero<span className="text-blue-700/80">Authority</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
