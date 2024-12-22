const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

module.exports = {
    checkRole(req, res, next){
        if(req.session.user && req.session.user.role == 'admin'){
            return next();
        }else{
            res.redirect('/');
        }
    },
    signIn(req,res){
        res.render('login',{
            errors: [],
            username: '',
            password: ''
        });
    },
    async signInAction(req, res) {
        const { username, password } = req.body;
        // Kiểm tra lỗi
        if (req.errors && req.errors.length > 0) {
            return res.render('login', {
                errors: req.errors, // Truyền lỗi vào view để hiển thị
                username,
                password,
            });
        }
        try {
            // Tìm người dùng trong database
            const user = await User.findOne({ username });
            
            if (!user) {
                // Nếu không tìm thấy người dùng
                return res.render('login', {
                    errors: ['Invalid username or password'],
                    username,
                    password
                });
            }

            // So sánh mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('login', {
                    errors: ['Invalid username or password'],
                    username,
                    password
                });
            }

            // Đăng nhập thành công, lưu thông tin người dùng vào session
            req.session.user = user;  // Lưu thông tin người dùng vào session

            if(user.role == 'patient'){
                // Redirect tới trang chính hoặc trang người dùng
                res.redirect('/patient/dashboard');  
            }else if(user.role == 'admin'){
                res.redirect('/admin');  
            }else if(user.role == 'doctor'){
                res.redirect('/doctor/dashboard');  
            }else if(user.role == 'pharmacist'){
                res.redirect('/pharmacist/dashboard');  
            }else if(user.role == 'nurse'){
                res.redirect('/nurse/dashboard');  
            }

        } catch (error) {
            next(error);
        }
    },
    signUp(req,res){
        res.render('register', {
            username : '',
            email : '',
            password : '',
            confirmPassword : '',
            errors : [],
        });
    },
    signUpAction(req, res, next) {
        const { username, email, password, confirmPassword } = req.body;
    
        // Kiểm tra lỗi
        if (req.errors && req.errors.length > 0) {
            return res.render('register', {
                errors: req.errors, // Truyền lỗi vào view để hiển thị
                username,
                email,
                password,
                confirmPassword,
            });
        }
    
        // Kiểm tra xem email hoặc username đã tồn tại chưa
        User.findOne({ $or: [{ email }, { username }] })
            .then(user => {
                if (user) {
                    req.errors = ['Email or Username already exists.'];
                    return res.render('register', {
                        errors: req.errors,
                        username,
                        email,
                        password,
                        confirmPassword,
                    });
                }
    
                // Nếu không có lỗi, tạo mới người dùng và lưu vào CSDL
                const newUser = new User({
                    username,
                    email,
                    password, // Mật khẩu sẽ được mã hóa trong User model
                    role: 'patient', // Mặc định hoặc có thể thay đổi tùy theo yêu cầu
                });
    
                newUser.save()
                    .then(() => {
                        res.redirect('/signIn'); // Redirect đến trang đăng nhập
                    })
                    .catch(err => {
                        req.errors = ['An error occurred while registering.'];
                        res.render('register', {
                            errors: req.errors,
                            username,
                            email,
                            password,
                            confirmPassword,
                        });
                    });
            })
            .catch(err => {
                req.errors = ['Database error occurred.'];
                res.render('register', {
                    errors: req.errors,
                    username,
                    email,
                    password,
                    confirmPassword,
                });
            });
    },
    logout(req, res){
        req.session.destroy((err) => {
            res.clearCookie('connect.sid'); // Xóa cookie của session
            res.redirect('/'); // Chuyển hướng đến trang login sau khi logout
          });        
    },
    async updateUserInfor(req,res){
        const {
            fullname,
            username,
            email,
            address,
            phoneNumber
          } = req.body;
        
        // Tìm người dùng theo ID từ session
        const currentUser = await User.findById(req.session.user._id);
    
        // Kiểm tra nếu người dùng không tồn tại
        if (!currentUser) {
        return res.status(404).send('User not found');
        }
    
        // Cập nhật thông tin người dùng
        currentUser.fullname = fullname;
        currentUser.username = username;
        currentUser.email = email;
        currentUser.address = address;
        currentUser.phoneNumber = phoneNumber;
    
        // Lưu thông tin đã cập nhật vào cơ sở dữ liệu
        await currentUser.save();

        req.session.user = currentUser;
    
        // Chuyển hướng đến trang dashboard của bệnh nhân
        res.redirect(`/${req.params.type}/dashboard`);
    }
}