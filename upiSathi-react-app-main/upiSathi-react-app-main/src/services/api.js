const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const fetchWithCredentials = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);
    const data = await response.json();
    
    
    // if (data.message) {
    //   console.log(data.message);
    // }
    
    if (!response.ok || data.success === false) {
      throw new Error(data.message || data.error || 'API Request Failed');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = (username, email, password) => {
  return fetchWithCredentials('/user/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
};

export const loginUser = (email, password) => {
  return fetchWithCredentials('/user/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const getCurrentUser = () => {
  return fetchWithCredentials('/user/');
};

export const logoutUser = () => {
  return fetchWithCredentials('/user/logout', {
    method: 'POST',
  });
};

export const getOthersProfile = (userId) => {
  return fetchWithCredentials(`/user/profile/${userId}`);
};

export const createRequest = (payload) => {
  return fetchWithCredentials('/exchange/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const cancelRequest = (requestId) => {
  return fetchWithCredentials(`/exchange/cancel/${requestId}`, {
    method: 'PATCH',
  });
};

export const getPublicRequests = (lng, lat, radius = 5) => {
  return fetchWithCredentials(`/exchange/public?lng=${lng}&lat=${lat}&radius=${radius}`);
};

export const getMyRequests = (cursor) => {
  return fetchWithCredentials(`/exchange/me${cursor ? `?cursor=${cursor}` : ''}`);
};

export const acceptRequest = (requestId) => {
  return fetchWithCredentials(`/match/accept/${requestId}`, {
    method: 'POST',
  });
};

export const confirmMatch = (matchId) => {
  return fetchWithCredentials(`/match/confirm/${matchId}`, {
    method: 'PATCH',
  });
};

export const rejectMatch = (matchId) => {
  return fetchWithCredentials(`/match/reject/${matchId}`, {
    method: 'PATCH',
  });
};

export const completeMatch = (matchId) => {
  return fetchWithCredentials(`/match/complete/${matchId}`, {
    method: 'PATCH',
  });
};

export const cancelActiveMatch = (matchId) => {
  return fetchWithCredentials(`/match/cancel/${matchId}`, {
    method: 'PATCH',
  });
};

export const getPendingMatches = () => {
  return fetchWithCredentials('/match/pending');
};

export const getChat = (matchId, cursor) => {
  return fetchWithCredentials(`/chat/${matchId}${cursor ? `?cursor=${cursor}` : ''}`);
};

export const getChatHistory = (matchId, cursor) => {
  return fetchWithCredentials(`/chat/history/${matchId}${cursor ? `?cursor=${cursor}` : ''}`);
};

export const getActiveMatches = () => {
  return fetchWithCredentials('/match/active');
};

export const getNotifications = (cursor) => {
  return fetchWithCredentials(`/notification${cursor ? `?cursor=${cursor}` : ''}`);
};

export const getUnreadNotificationCount = () => {
  return fetchWithCredentials('/notification/unread-counter');
};

export const deleteNotifications = () => {
  return fetchWithCredentials('/notification', {
    method: 'DELETE',
  });
};

export const unreadNotification = (id) => {
  return fetchWithCredentials(`/notification/unread/${id}`, {
    method: 'PATCH',
  });
};

export const unreadAllNotification = () => {
  return fetchWithCredentials('/notification/unread-all', {
    method: 'PATCH',
  });
};

export const getMatchHistory = (cursor) => {
  return fetchWithCredentials(`/match/history${cursor ? `?cursor=${cursor}` : ''}`);
};

export const createReview = (matchId, rating, comment) => {
  return fetchWithCredentials('/reviews', {
    method: 'POST',
    body: JSON.stringify({ matchId, rating, comment }),
  });
};

export const getMyReviews = (cursor) => {
  return fetchWithCredentials(`/reviews/me${cursor ? `?cursor=${cursor}` : ''}`);
};

export const getUserReviews = (userId, cursor) => {
  return fetchWithCredentials(`/reviews/user/${userId}${cursor ? `?cursor=${cursor}` : ''}`);
};

export const getCompletedCounter = () => {
  return fetchWithCredentials('/match/complete/counter');
};

export const getCancelledCounter = () => {
  return fetchWithCredentials('/match/cancel/counter');
};

export const loginWithGoogle = (credential) => {
  return fetchWithCredentials('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });
};

export const sendOtp = (email, purpose) => {
  return fetchWithCredentials('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email, purpose }),
  });
};

export const verifyOtp = (email, otp, purpose) => {
  return fetchWithCredentials('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp: otp.toString(), purpose }),
  });
};

export const forgotPassword = (email, newPassword) => {
  return fetchWithCredentials('/user/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email, newPassword }),
  });
};

export const getPasswordStatus = () => {
  return fetchWithCredentials('/user/password-status');
};

export const setPassword = (newPassword) => {
  return fetchWithCredentials('/user/set-password', {
    method: 'POST',
    body: JSON.stringify({ newPassword }),
  });
};

export const changePassword = (oldPassword, newPassword) => {
  return fetchWithCredentials('/user/change-password', {
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword }),
  });
};

export const createReport = (reportedUserId, matchId, reason, description) => {
  return fetchWithCredentials('/report/create', {
    method: 'POST',
    body: JSON.stringify({ reportedUserId, matchId, reason, description }),
  });
};

export const getMyReports = () => {
  return fetchWithCredentials('/report/me');
};



