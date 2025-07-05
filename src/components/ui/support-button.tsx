
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SupportButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const SupportButton = React.forwardRef<HTMLButtonElement, SupportButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "bg-pink-500 hover:bg-pink-600 text-white border-0 font-medium transition-all duration-200 shadow-lg hover:shadow-xl",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

SupportButton.displayName = "SupportButton";

export { SupportButton };
