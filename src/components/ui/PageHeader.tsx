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
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {buttonText && buttonLink && (
                <Link
                    to={buttonLink}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{buttonText}</span>
                </Link>
            )}
        </div>
    );
};

export default PageHeader;
