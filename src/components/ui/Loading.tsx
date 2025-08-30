const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight">
          Brain <span className="text-indigo-500">Sync</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Preparing your experience...
        </p>
        {/* Spinner */}
        <div className="mt-6 w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default Loading;
