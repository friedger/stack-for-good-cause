
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SecondaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const SecondaryButton = React.forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={cn(
          "text-white border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 font-medium transition-all duration-200 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

SecondaryButton.displayName = "SecondaryButton";

export { SecondaryButton };
