const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Book = require('./book');
const User = require('./user').default;

const resolvers = {
    books: async () => {
        try {
            const books = await Book.find();
            return books;
        } catch (err) {
            throw err;
        }
    },
    users: async () => {
        try {
            const users = await User.find();
            return users;
        } catch (err) {
            throw err;
        }
    },
    addBook: async ({ bookInput }) => {
        try {
            const book = new Book({
                title: bookInput.title,
                author: bookInput.author
            });
            const result = await book.save();
            return result;
        } catch (err) {
            throw err;
        }
    },
    register: async ({ userInput }) => {
        try {
            const existingUser = await User.findOne({ username: userInput.username });
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = await bcrypt.hash(userInput.password, 12);
            const user = new User({
                username: userInput.username,
                password: hashedPassword
            });
            const result = await user.save();
            return result;
        } catch (err) {
            throw err;
        }
    },
    login: async ({ username, password }) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Password is incorrect');
            }
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return { userId: user.id, token, tokenExpiration: 1 };
        } catch (err) {
            throw err;
        }
    }
};

module.exports = resolvers;
