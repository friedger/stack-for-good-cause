
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "bg-orange-500 hover:bg-orange-600 text-white border-0 font-medium transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";

export { PrimaryButton };
