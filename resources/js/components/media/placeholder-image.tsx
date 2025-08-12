import { cn } from '@/lib/utils';

export default function PlaceholderImage({ className }: { className?: string }) {
    return (
        <div className={cn('relative overflow-hidden rounded-md bg-[linear-gradient(135deg,#2b002d_0%,#30082c_40%,#1a0b1d_100%)]', className)}>
            <div className="absolute inset-0 opacity-20 [background:radial-gradient(ellipse_at_center,rgba(188,142,46,0.6),transparent_60%)]" />
            <div className="absolute inset-0 opacity-10 [background:repeating-linear-gradient(45deg,transparent,transparent_12px,rgba(255,255,255,0.2)_12px,rgba(255,255,255,0.2)_24px)]" />
        </div>
    );
}
