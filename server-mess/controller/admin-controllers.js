const User = require('../models/User');

const home = async (req, res) => {
    try {
        res.status(200).send('Hello Developers!, this is admin router');
    } catch (err) {
        console.log(err);
    }
};

const getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({ isPending: true });
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isPending = false;
        user.isApproved = true;
        await user.save();

        res.status(200).json({ message: 'User approved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const denyUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the user from the database (or set a flag to indicate denial)
        await user.remove();

        res.status(200).json({ message: 'User denied successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getPendingUsers, approveUser, denyUser, home };