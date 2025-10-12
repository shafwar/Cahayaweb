import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FloatingSidebarTriggerProps {
    onToggle: () => void;
    isOpen: boolean;
}

export default function FloatingSidebarTrigger({ onToggle, isOpen }: FloatingSidebarTriggerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    // Show/hide trigger based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
            
            // Show trigger after scrolling down 100px
            setIsVisible(currentScrollY > 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    transition={{ 
                        duration: 0.3,
                        ease: [0.25, 0.25, 0, 1]
                    }}
                    className="fixed bottom-6 right-6 z-[10000] md:hidden"
                    style={{
                        isolation: 'isolate',
                        pointerEvents: 'auto',
                    }}
                >
                    <button
                        onClick={onToggle}
                        className={`group relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
                            isOpen 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90'
                        }`}
                        style={{
                            touchAction: 'manipulation',
                            WebkitTouchCallout: 'none',
                            WebkitUserSelect: 'none',
                            userSelect: 'none',
                        }}
                        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
                    >
                        {/* Ripple effect */}
                        <motion.div
                            className={`absolute inset-0 rounded-full ${
                                isOpen ? 'bg-red-400' : 'bg-secondary/30'
                            }`}
                            initial={{ scale: 0, opacity: 0 }}
                            whileTap={{ scale: 1.2, opacity: 0.3 }}
                            transition={{ duration: 0.2 }}
                        />
                        
                        {/* Icon */}
                        <motion.div
                            animate={{ 
                                rotate: isOpen ? 180 : 0,
                                scale: isOpen ? 1.1 : 1 
                            }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6 text-white" />
                            ) : (
                                <Menu className="h-6 w-6 text-white" />
                            )}
                        </motion.div>

                        {/* Pulse animation when closed */}
                        {!isOpen && (
                            <motion.div
                                className="absolute inset-0 rounded-full bg-secondary/20"
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.1, 0.3]
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            />
                        )}

                        {/* Tooltip */}
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            whileHover={{ opacity: 1, x: 0 }}
                            className="absolute right-full mr-3 rounded-lg bg-black/90 px-3 py-2 text-sm text-white backdrop-blur-sm"
                            style={{ pointerEvents: 'none' }}
                        >
                            {isOpen ? 'Close Menu' : 'Open Menu'}
                            <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rotate-45 bg-black/90" />
                        </motion.div>
                    </button>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -left-16 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                    >
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-px bg-gray-400" />
                            <span className="whitespace-nowrap">Menu</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
