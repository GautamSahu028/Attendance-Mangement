import { useState } from "react";

import { ReactNode } from "react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  iconPosition = "left",
  disabled = false,
  fullWidth = false,
  onClick = () => {},
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Base styles
  const baseStyles =
    "flex items-center justify-center font-medium transition-colors rounded focus:outline-none focus:ring-2 focus:ring-blue-300";

  // Size variants
  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  // Color variants
  const variantStyles = {
    primary: `bg-blue-600 hover:bg-blue-700 text-white ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`,
    secondary: `bg-gray-200 hover:bg-gray-300 text-gray-800 ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`,
    outline: `border border-gray-300 hover:bg-gray-100 ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`,
    text: `text-blue-600 hover:bg-gray-100 ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`,
  };

  // Width style
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle}`}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </button>
  );
}

// // Example usage demonstration
// const ButtonDemo = () => {
//   return (
//     <div className="p-6 space-y-6 bg-white">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">Button Component</h2>

//       <div className="space-y-4">
//         <div>
//           <h3 className="text-md font-medium text-gray-700 mb-2">Variants</h3>
//           <div className="flex flex-wrap gap-4">
//             <Button variant="primary">Primary</Button>
//             <Button variant="secondary">Secondary</Button>
//             <Button variant="outline">Outline</Button>
//             <Button variant="text">Text</Button>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-md font-medium text-gray-700 mb-2">Sizes</h3>
//           <div className="flex flex-wrap gap-4 items-center">
//             <Button size="sm">Small</Button>
//             <Button size="md">Medium</Button>
//             <Button size="lg">Large</Button>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-md font-medium text-gray-700 mb-2">States</h3>
//           <div className="flex flex-wrap gap-4">
//             <Button>Normal</Button>
//             <Button disabled>Disabled</Button>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-md font-medium text-gray-700 mb-2">With Icons</h3>
//           <div className="flex flex-wrap gap-4">
//             <Button icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>}>
//               Add Item
//             </Button>
//             <Button variant="outline" icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>}
//               iconPosition="right">
//               Download
//             </Button>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-md font-medium text-gray-700 mb-2">Full Width</h3>
//           <Button fullWidth>Full Width Button</Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ButtonDemo;
export { Button };
