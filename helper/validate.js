const validateRegister = (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;
    const errors = [];
  
    // Kiểm tra username
    if (!username || username.trim() === '') {
      errors.push('Username is required.');
    } else if (username.length < 3) {
      errors.push('Username must be at least 3 characters long.');
    }
  
    // Kiểm tra email
    if (!email || email.trim() === '') {
      errors.push('Email is required.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email is invalid.');
    }
  
    // Kiểm tra password
    if (!password || password.trim() === '') {
      errors.push('Password is required.');
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters long.');
    }
  
    // Kiểm tra confirm password
    if (!confirmPassword || confirmPassword.trim() === '') {
      errors.push('Confirm Password is required.');
    } else if (password !== confirmPassword) {
      errors.push('Passwords do not match.');
    }
  
    if (errors.length > 0) {
      // Lưu lỗi vào req.errors thay vì tạo error object
      req.errors = errors;
      return next(); // Không cần trả về error, chỉ cần gọi next() để tiếp tục xử lý
    }
  
    next(); // Nếu không có lỗi, tiếp tục với controller
  };

const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    const errors = [];

    // Kiểm tra username
    if (!username || username.trim() === '') {
        errors.push('Username is required.');
    }

    // Kiểm tra password
    if (!password || password.trim() === '') {
        errors.push('Password is required.');
    }

    if (errors.length > 0) {
        const error = new Error('Validation failed');
        error.status = 400;
        error.errors = errors;
        req.errors = errors;
        return next();
    }

    next();  // Nếu không có lỗi, tiếp tục với controller
};

module.exports = {
    validateRegister,
    validateLogin
};
  