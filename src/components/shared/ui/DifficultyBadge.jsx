const DifficultyBadge = ({ difficulty }) => {
  const difficultyStyles = {
    Easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        difficultyStyles[difficulty] || 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300'
      }`}
    >
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
