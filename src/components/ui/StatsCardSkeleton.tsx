const StatsCardSkeleton = () => {
    return (
        <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-6 border border-gray-200 dark:border-slate-700 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gray-300 dark:bg-slate-600 h-10 w-10"></div>
            </div>
            <div>
                <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-400 dark:bg-slate-500 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded w-20"></div>
            </div>
        </div>
    );
}

export default StatsCardSkeleton
