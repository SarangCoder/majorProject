const User = require("../models/user");


module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
}




module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
             return next(err);
            }

            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings")

        })
        
    } catch (e) {
        req.flash("error", "user is already exist");
        res.redirect("/signup");
    }
}


module.exports.renderLoginFrom = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.logOut = (req,res , next) => {
    req.logOut((err) => {
        if(err){
         return next();
        }
        req.flash("success" , "You are logged out !");
        res.redirect("/listings");
    })
}

module.exports.login = async (req, res) => {
    req.flash("success" , "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}