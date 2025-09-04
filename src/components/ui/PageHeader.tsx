import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    icon?: LucideIcon;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    buttonText,
    buttonLink,
    icon: Icon,
}) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                {subtitle && <p className="mt-1 text-gray-600 dark:text-gray-300">{subtitle}</p>}
            </div>
            {buttonText && buttonLink && (
                <Link
                    to={buttonLink}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                               bg-blue-600 text-white hover:bg-blue-700
                               dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    {Icon && <Icon className="h-4 w-4 text-white dark:text-white" />}
                    <span className="text-white dark:text-white">{buttonText}</span>
                </Link>
            )}
        </div>
    );
};

export default PageHeader;
