export const calculateStreak = (logs: any[]) => {
  let streak = 0;
  let current = new Date();

  while (true) {
    const dateStr = current.toDateString();

    const found = logs.find(
      (log: any) =>
        new Date(log.date).toDateString() === dateStr
    );

    if (!found) break;

    streak++;
    current.setDate(current.getDate() - 1);
  }

  return streak;
};
