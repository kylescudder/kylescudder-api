import { verify, sign } from 'jsonwebtoken'
import { Request, Response } from 'express'

const bcrypt = require('bcryptjs')

const BIGDAYPLANNERUSER = require('../models/bigDayPlanner/user-model');
const GUEST = require('../models/bigDayPlanner/guest-model')

type UserData = {
  id: string
}

const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      email, password, passwordCheck,
    } = req.body;
    let { displayName } = req.body

    // validate

    if (!email || !password || !passwordCheck) return res.status(400).json({ msg: 'Not all fields have been entered.' });
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: 'The password needs to be at least 5 characters long.' });
    }
    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: 'Enter the same password twice for verification.' });
    }

    const existingUser = await BIGDAYPLANNERUSER.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: 'An account with this email already exists.' });
    }

    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new BIGDAYPLANNERUSER({
      email,
      password: passwordHash,
      displayName,
    });
    const savedUser = await newUser.save();
    return res.json(savedUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password) return res.status(400).json({ msg: 'Not all fields have been entered.' });
    const user = await BIGDAYPLANNERUSER.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: 'No account with this email has been registered.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' });

    const token = sign({ id: user._id }, process.env.JWT_SECRET as string);
    return res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await BIGDAYPLANNERUSER.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const tokenIsValidUser = async (req: Request, res: Response) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.json(false);

    const verified:UserData = verify(token, process.env.JWT_SECRET as string) as UserData;
    if (!verified) return res.json(false);
    const user = await BIGDAYPLANNERUSER.findById(verified.id);
    if (!user) return res.json(false);
    
    return res.json(true);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getUserInfo = async (req: Request, res: Response) => {
  const user = await BIGDAYPLANNERUSER.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
  });
};

const createGuest = async (req: Request, res: Response) => {
  try {
    const { body } = req
    if (!body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a guest',
      })
    }

    const guest = new GUEST(body)

    if (!guest) {
      return res.status(400).json({ success: false, error: 'Could not create new guest' })
    }
    await guest.create({
      forename: guest.forename,
      surname: guest.surname,
      guestGroupID: guest.guestGroupID
    })
    return res.status(201).json({
      success: true,
      id: guest._id,
      message: 'Guest created!',
    })
  } catch (err: any) {
    return res.status(400).json({ err, message: 'Guest not created!', })
  }
}

const updateGuest = async (req: Request, res: Response) => {
  try {
    const { body } = req

    if (!body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a body to update',
      })
    }

    const guest = await GUEST.findOne({ _id: req.params.id })
    if (!guest.length) {
      return res.status(404).json({
        message: 'Guest not found!',
      })
    }
    guest.forename = body.forename
    guest.surname = body.surname
    guest.guestGroupID = body.guestGroupID
    await guest.updateOne({ _id: guest._id }, {
      forename: guest.forename,
      surname: guest.surname,
      guestGroupID: guest.guestGroupID
    })
    return res.status(200).json({
      success: true,
      id: guest._id,
      message: 'Guest updated!',
    })
  } catch (err: any) {
    return res.status(404).json({ err, message: 'Guest not updated!', })
  }
}

const deleteGuest = async (req: Request, res: Response) => {
  try {
    const guest = await GUEST.findOneAndDelete({ _id: req.params.id })
    if (!guest) {
      return res.status(404).json({ success: false, error: 'Guest not found' })
    }

    return res.status(200).json({ success: true, data: guest })
  } catch(err: any) {
    return res.status(400).json({ success: false, error: err })
  }
}

const getGuestById = async (req: Request, res: Response) => {
  try {
    const guest = await GUEST.findOne({ _id: req.params.id })
    if (!guest) {
      return res
        .status(404)
        .json({ success: false, error: 'Guest not found' })
    }
    return res.status(200).json({ success: true, data: guest })
  } catch (err: any) {
      return res.status(400).json({ success: false, error: err }) 
  }
}

const getGuests = async (_req: Request, res: Response) => {
  try {
    const guests = await GUEST.find({})
    if (!guests.length) {
      return res.status(404).json({ success: false, error: 'Guest not found' })
    }
    return res.status(200).json({ success: true, data: guests })
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err })
  }
}

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  tokenIsValidUser,
  getUserInfo,
  createGuest,
  updateGuest,
  deleteGuest,
  getGuests,
  getGuestById,
};
