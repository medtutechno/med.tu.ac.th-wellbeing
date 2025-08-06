// Cookie management utility functions
export const setCookie = (name, value, days = 14) => {
  try {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
    return true;
  } catch (error) {
    console.error('Error setting cookie:', error);
    return false;
  }
};

export const getCookie = (name) => {
  try {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length);
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
};

export const checkAssessmentAvailability = () => {
  try {
    const lastAssessment = getCookie('lastAssessmentDate');
    if (!lastAssessment) return { canTake: true };

    const lastDate = new Date(lastAssessment);
    const currentDate = new Date();
    const twoWeeks = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
    const timeLeft = twoWeeks - (currentDate - lastDate);
    
    if (timeLeft <= 0) {
      return { canTake: true };
    }

    const nextAvailableDate = new Date(lastDate.getTime() + twoWeeks);
    return {
      canTake: false,
      nextDate: nextAvailableDate,
      daysLeft: Math.ceil(timeLeft / (24 * 60 * 60 * 1000))
    };
  } catch (error) {
    console.error('Error checking assessment availability:', error);
    return { canTake: true }; // Default to allowing assessment if there's an error
  }
};

export const setAssessmentComplete = () => {
  return setCookie('lastAssessmentDate', new Date().toISOString());
};