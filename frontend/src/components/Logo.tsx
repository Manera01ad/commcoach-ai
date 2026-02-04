import React from 'react';

interface LogoProps {
    className?: string;
    variant?: 'light' | 'dark' | 'auto';
}

const Logo: React.FC<LogoProps> = ({ className = "h-10", variant = 'auto' }) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <img
                src="/commsage-logo.svg"
                alt="CommSage Logo"
                className="h-full w-auto object-contain"
                style={{
                    // Ensure the logo scales properly within its container
                    maxHeight: '100%',
                    maxWidth: '100%'
                }}
            />
        </div>
    );
};

export default Logo;
