// Storage management utility functions
export const setAssessmentDate = () => {
  try {
    const currentDate = new Date().toISOString();
    localStorage.setItem('lastAssessmentDate', currentDate);
    return true;
  } catch (error) {
    console.error('Error setting assessment date:', error);
    return false;
  }
};

export const checkAssessmentAvailability = () => {
  try {
    const lastAssessment = localStorage.getItem('lastAssessmentDate');
    if (!lastAssessment) return { canTake: true };

    const lastDate = new Date(lastAssessment);
    const currentDate = new Date();
    const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const timeLeft = sevenDays - (currentDate - lastDate);
    
    if (timeLeft <= 0) {
      return { canTake: true };
    }

    const nextAvailableDate = new Date(lastDate.getTime() + sevenDays);
    const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60 * 1000));

    return {
      canTake: false,
      nextDate: nextAvailableDate.toISOString(),
      daysLeft: daysLeft
    };
  } catch (error) {
    console.error('Error checking assessment availability:', error);
    return { canTake: true };
  }
};
