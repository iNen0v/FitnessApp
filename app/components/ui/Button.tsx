'use clieent'

interface ButtonProps {
    children: React.ReactNode
    onClick: () => void
    variant?: "primary" | "secondary"
    className?: string
}
export default function Button({
    children,
    onClick,
    variant = "primary",
    className = ""
}: ButtonProps) {
    const baseStyle ="px-4 py-2 roundeed-md transition duratiopn-colors"
    const variantStyles = {
        primary: "bg-blue-500 hover:bg-blue-600 text-white",
        secondary:"bg-gray-200 hover:bg-gray-300 text-gray-800"
    }
    return(
        <button
        onClick={onClick}
        className={`${baseStyle} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    )
    
}