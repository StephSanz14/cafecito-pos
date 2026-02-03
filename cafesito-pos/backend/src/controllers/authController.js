import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Customer} from '../models/customer.js' 

const generateToken = (customerId, role) => {
    return jwt.sign({ id: customerId, role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '365d' }); //acuerdate de cambiar esto mas adelante
}

const generateRefreshToken = (customerId) => {
    const refreshToken = jwt.sign({ id: customerId }, 
        process.env.JWT_REFRESH_SECRET, 
        { expiresIn: '365d' });
        return refreshToken;
}

const generatePassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt); //salt es un numero que indica la complejidad del hash
}

async function checkCustomerExists(phoneOrEmail) {
  const value = (phoneOrEmail || "").trim();
  const isEmail = value.includes("@");
  const normalized = isEmail ? value.toLowerCase() : value;

  return Customer.findOne({ phoneOrEmail: normalized });
}

async function registerCustomer(req, res, next) {
    try {
        const { name, phoneOrEmail, password } = req.body; 
        const existingCustomer = await checkCustomerExists(phoneOrEmail);
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer already exists' });
        }

        const hashedPassword = await generatePassword(password);
        const newCustomer = new Customer({
            name,
            phoneOrEmail,
            password: hashedPassword,
            role: "seller",
        });
        await newCustomer.save();
        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (error) {
        next(error);
    }
}

async function loginCustomer(req, res, next) {
    try {
        const { phoneOrEmail, password } = req.body;
        const customerExist = await checkCustomerExists(phoneOrEmail);
        if (!customerExist) {
            return res.status(400).json({ message: 'User does not exist. You must to sign in'  });
        }
        console.log(customerExist);
        const isMatch =  await bcrypt.compare(password, customerExist.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(customerExist._id, customerExist.role);
        const refreshToken = generateRefreshToken(customerExist._id);
        res.json({ token, refreshToken:refreshToken, role: customerExist.role});
    } catch (error) {
        next(error);
    }
}

const checkphoneOrEmailalredyRegistered = async (req, res, next) => {
    try {
        const { phoneOrEmail } = req.query;
        console.log(phoneOrEmail);
        const customer = await checkCustomerExists(phoneOrEmail);
        res.json({ exists: !!customer });
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const customer = await Customer.findById(decoded.id);
        if (customer) {
            const newToken = generateToken(customer._id, customer.role, customer.name);

            res.json({ token: newToken });
        } else {
            res.status(401).json({ message: 'Invalid refresh token' });
        }
    } catch (error) {
        next(error);
    }
};

export { registerCustomer, loginCustomer, checkphoneOrEmailalredyRegistered, refreshToken };