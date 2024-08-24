const jwt = require('jsonwebtoken')


const login = (req, res) => {
    try {
        // Sample hardcoded credentials
        const email1 = "test1@gmail.com";
        const password1 = "12345";

        // Extract email and password from request body
        const { email, password } = req.body;

        // Check if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Validate credentials
        if (email1 === email && password1 === password) {

            let tokan =  jwt.sign({password:password,email:email},'TechNishal')
            console.log(tokan)
            return res.status(200).send({msg:"Login Success",tokan});

        } else {
            return res.status(401).send({error:"Invalid Credentials"});
        }
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { login };
