// middlewares/roleMiddleware.js
export const allowRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        res.status(403);
        throw new Error('Not authorized');
      }
      next();
    };
  };
  