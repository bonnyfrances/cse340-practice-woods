import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';

const router = Router();

/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({ min: 8 })
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];

/**
 * Display the registration form page.
 */
const showRegistrationForm = (req, res) => {
    res.render('forms/registration/form', {
        title: 'User Registration'
    });
};

/**
 * Handle user registration with validation and password hashing.
 */
const processRegistration = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    // Inside your validation error check
    if (!errors.isEmpty()) {
        // Store each validation error as a separate flash message
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/register');
    }

    // Extract validated data
    const { name, email, password } = req.body;

    try {
        // Check if email already exists in database
        const doesEmailExist = await emailExists(email);

        // if email exists, redirect user back to registration form
        if (doesEmailExist) {
            req.flash('warning', 'Email already exists in system. Please use a unique email address.');            
            return res.redirect("/register");
        }

        // Hash the password before saving to database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database with hashed password
        await saveUser(name, email, hashedPassword);
        req.flash('success', 'You successfully registered, great job!');  

        // const user = await saveUser(name, email, hashedPassword);
        // if (!empty(user)) {
        //     req.flash('success', 'You successfully registered, great job!');  
        // } else {
        //     req.flash('error', 'Could not save user, please try again.');
        // }
        
    } catch (error) {
        req.flash('error', 'Could not save user, please try again.');
        console.error('Could not save user:', error);
    }
    res.redirect('/register');
};

/**
 * Display all registered users.
 */
const showAllUsers = async (req, res) => {
    // Initialize users as empty array
    let users = [];

    try {
        users = await getAllUsers();
    } catch (error) {
        req.flash('error', 'Error retrieving users');
        console.error('Error retrieving users:', error);
    }

    res.render('forms/registration/list', {
        title: 'Registered Users',
        users
    });
};

/**
 * GET /register - Display the registration form
 */
router.get('/', showRegistrationForm);

/**
 * POST /register - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration);

/**
 * GET /register/list - Display all registered users
 */
router.get('/list', showAllUsers);

export default router;