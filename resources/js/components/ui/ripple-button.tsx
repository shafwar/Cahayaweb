import { useRef } from 'react';
import { cn } from '@/lib/utils';

export function RippleButton({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const ref = useRef<HTMLSpanElement>(null);
    return (
        <button
            className={cn('relative overflow-hidden rounded-md bg-primary px-4 py-2 text-primary-foreground', className)}
            {...props}
            onClick={(e) => {
                const span = ref.current;
                if (!span) return;
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                span.style.left = `${e.clientX - rect.left}px`;
                span.style.top = `${e.clientY - rect.top}px`;
                span.classList.remove('animate-ripple');
                // Trigger reflow
                void span.offsetWidth;
                span.classList.add('animate-ripple');
                props.onClick?.(e);
            }}
        >
            {children}
            <span ref={ref} className="pointer-events-none absolute size-0 rounded-full bg-white/30" />
        </button>
    );
}


