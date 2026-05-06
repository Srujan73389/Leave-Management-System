export const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};