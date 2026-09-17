import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'bg-[#b80035] text-white shadow-sm hover:bg-[#9e002d]',
                destructive:
                    'bg-rose-600 text-white shadow-xs hover:bg-rose-700',
                outline:
                    'border border-zinc-200 bg-white text-zinc-900 shadow-2xs hover:bg-zinc-50 hover:text-zinc-900',
                secondary:
                    'bg-[#006c49] text-white shadow-sm hover:bg-[#005236]',
                ghost: 'hover:bg-zinc-100 hover:text-zinc-900',
                link: 'text-[#b80035] underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-8 rounded-lg px-3 text-[11px]',
                lg: 'h-12 rounded-2xl px-6 text-sm',
                icon: 'h-9 w-9 rounded-xl',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
