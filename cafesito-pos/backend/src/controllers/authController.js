import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Customer from '../models/customer.js' 

const generateToken = (customerId, role) => {
    return jwt.sign({ id: customerId, role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '365d' }); //acuerdate de cambiar esto mas adelante
}

const generateRefreshToken = (customerId) => {
    const refreshToken = jwt.sign({ id: customerId }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '365d' });
        return refreshToken;
}

const generatePassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt); //salt es un numero que indica la complejidad del hash
}

const checkCustomerExists = async (emailOrPhone) => {
    const customer = await Customer.findOne({ email: emailOrPhone });
    return customer;
}

async function registerCustomer(req, res) {
    try {
        const { name, emailOrPhone, password } = req.body;
        const existingCustomer = await checkCustomerExists(emailOrPhone);
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer already exists' });
        }
        let role = 'customer';
        const hashedPassword = await generatePassword(password);
        const newCustomer = new Customer({
            name,
            emailOrPhone,
            password: hashedPassword,
            role,
        });
        await newCustomer.save();
        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (error) {
        next(error);
    }
}