import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseClass = 'led-button';
    const variantClass = variant !== 'primary' ? ` ${variant}` : '';
    const widthClass = fullWidth ? ' w-full' : '';

    return (
        <button
            className={`${baseClass}${variantClass}${widthClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
