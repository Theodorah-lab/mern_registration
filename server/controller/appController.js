const userSchema = require('../modal/user.modal')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const optGenerator = require('otp-generator')



/**USER AUTHANTICATION */

async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body
        let existUser = await userSchema.findOne({ username })
        if (!existUser) return res.status(404).send("user does not exists")
        next()
    } catch (error) {
        return res
            .status(500).send(error)
    }
}
/**----GET METHOD----- */

async function getUser(req, res) {
    try {
        const { username } = req.params;
        if (!username) return res.status(501).send({ error: "Invalid Username" });
        const user = await userSchema.findOne({ username })
        /** remove password from user */
        const { password, ...rest } = user.toObject();
        return res.status(201).send(rest);

    } catch (error) {
        return res.status(404).send({ error: "Cannot Find User Data" });
    }

}
async function generateOTP(req, res) {
    req.app.locals.OTP = await optGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    return res.status(200).send({ code: req.app.locals.OTP })
}
async function verifyOTP(req, res) {
    const { code } = req.query
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; //reset otp value
        req.app.locals.resetSession = true //reset seesion
        return res.status(201).send({ message: "verify successfully" })
    }
    return res.status(400).send({ message: "Invalid otp" })

}
async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        return res.status(201).send({ flag: req.app.locals.resetSession })
    }
    return res.status(440).send({ error: "Session expired!" })
}

/**----POST METHOD----- */

async function register(req, res) {
    try {
        const { username, password, email, profile } = req.body;
        const existUser = await userSchema.findOne({ username })
        if (!existUser) {
            const salt = await bcrypt.genSalt(10)
            const encryptPWD = await bcrypt.hash(password, salt)
            const user = new userSchema({
                username,
                password: encryptPWD,
                email,
            })
            const data = await user.save()
            return res.status(201).send({ message: "user registered", data: data })
        }
        return res
            .status(200).send({ message: "user already exist" })
    } catch (error) {
        return res
            .status(500).send(error)
    }
}
async function login(req, res) {
    const { username, password } = req.body
    try {
        userSchema.findOne({ username }).then((user) => {
            bcrypt.compare(password, user.password).then(passwordCheck => {
                if (!passwordCheck) return res.status(404).send({ err: "does not have Password" })
                //create jwt auth
                const token = jwt.sign({
                    userId: user._id,
                    username: user.username,
                }, process.env.JWT_SECRET, { expiresIn: '24h' })
                return res.status(200).send({
                    message: "login successfully",
                    username: user.username,
                    token
                })
            }).catch(err => {
                return res.status(404).send({ err: "Password not match" })
            })
        }).catch(err => {
            return res.status(404).send({ err: "user does not exist" })
        })
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" })
    }
}


/**----PUT METHOD----- */

async function updateuser(req, res) {
    try {
        const { userId } = req.user
        if (userId) {
            const body = req.body;
            await userSchema.updateOne({ _id: userId }, body);
            return res.status(201).send({ msg: "Record Updated...!" });
        }
        return res.status(404).send({ error: "ID not found" });
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}
async function resetpassword(req, res) {
    try {
        if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });
        const { username, password } = req.body

        const user = await userSchema.findOne({ username })
        if (user) {
            const salt = await bcrypt.genSalt(10)
            const encryptPWD = await bcrypt.hash(password, salt)
            const data = userSchema.updateOne({ user: user.username }, { password: encryptPWD })
            req.app.locals.resetSession = false
            if (data) {
                return res.status(201).send({ message: "Password updated" });
            }
            return res.status(500).send({ message: "Unable to update password" });
        }
        return res.status(404).send({ message: "User not found" });
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

module.exports = { getUser, generateOTP, verifyOTP, createResetSession, register, login, updateuser, resetpassword, verifyUser }