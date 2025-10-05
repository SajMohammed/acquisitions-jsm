export const cookies = {
  getOptions: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',  //same site origin
    maxAge: 15 * 60 * 1000
  }),

  set: (res, name, value, options = {}) => {
    res.cookie(name, value, { ...cookies.getOptions(), ...options});
  },

  clear: (res, name, options = {}) => {
    return res.clearCookie(name, { ...cookies.getOptions(), ...options});
  },

  get: (req, name) => {
    return req.cookie[name];
  }

};