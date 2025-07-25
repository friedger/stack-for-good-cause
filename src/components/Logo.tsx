
import { Link } from "react-router-dom";
import { configService } from "@/services/configService";

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

  const logoTitle = configService.getLogoTitle();
  const logoSubtitle = configService.getLogoSubtitle();

  return (
    <Link to="/" className={`flex items-center text-white hover:text-blue-700/80 transition-colors ${className}`}>
      <div className={`${sizeClasses[size]} mr-2 relative`}>
        <img
          src="/img/logo.png"
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
            mask: 'url(/img/logo.png) no-repeat center/contain',
            WebkitMask: 'url(/img/logo.png) no-repeat center/contain'
          }}
        />
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold`}>
          {logoTitle}<span className="text-blue-700/80">{logoSubtitle}</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
