const express = require("express");

const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Crypto = require("crypto");
const cors = require("cors");
const parser = require("body-parser");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

dotenv.config();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const User = require("./models/User");
const Post = require("./models/Post");
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const newUser = new User({ name, email, password });
    newUser.verificationToken = Crypto.randomBytes(20).toString("hex"); // Assign verificationToken to newUser
    await newUser.save();
    sendVerficationEmail(newUser.email, newUser.verificationToken); // Use newUser.verificationToken
    res
      .status(200)
      .json({ message: "Registration success. Please check your email." });
  } catch (error) {
    console.log("Error registering User", error);
    res.status(500).send("Error registering User");
  }
});

const sendVerficationEmail = async (email, verficationEmail) => {
  const transPorter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "inamul2002@gmail.com",
      pass: "gsourcafshsjdsxp",
    },
  });
  const mailOptions = {
    from: "threads.com",
    to: email,
    subject: "Email Verification",
    text: `Please click on the link to verify your email http://localhost:5000/verify/${verficationEmail}`,
  };
  try {
    await transPorter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

app.get("/verify/:Token", async (req, res) => {
  try {
    const { Token } = req.params;
    const user = await User.findOne({ verificationToken: Token });
    if (!user) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({ message: "User Verified Successfully" });
  } catch (error) {
    console.log("error verfiying User", error);
    res.status(500).send("Error verfiying User");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({ message: "Login Success", token });
  } catch (error) {
    console.log("Error logging in User", error);
    res.status(500).send("Error logging in User");
  }
});

//endpoint to get Users

app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    User.find({ _id: { $ne: userId } })
      .then((users) => {
        res.status(200).json({ users });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "error getting user" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error getting user" });
  }
});

//Follow

app.post("/follow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });
    // await User.findByIdAndUpdate(currentUserId,{$push:{following:selectedUserId}})
    res.status(200).json({ message: "Followed Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/unfollow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $pull: { followers: currentUserId },
    });
    // await User.findByIdAndUpdate(currentUserId,{$pull:{following:selectedUserId}})
    res.status(200).json({ message: "unFollowed Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//create-post

app.post("/create-post", async (req, res) => {
  try {
    const { content, userId } = req.body;
    const newPostData = {
      user: userId,
    };
    if (content) {
      newPostData.content = content;
    }
    const newPost = new Post(newPostData);
    await newPost.save();
    res.status(200).json({ message: "Post created successfully" });
  } catch (error) {
    console.log(error);
  }
});

//likes endpoint

app.put("/post/:postId/:userId/like", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId).populate("user", "name");

    const upDatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: userId },
      },
      { new: true }
    );
    if (!upDatedPost) {
      res.status(404).json({ message: "Post not found" });
    }
    upDatedPost.user = post.user;
    res.json(upDatedPost);
  } catch (error) {
    console.log(error);
  }
});

app.put("/post/:postId/:userId/unlike", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId).populate("user", "name");

    const upDatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: userId },
      },
      { new: true }
    );
    if (!upDatedPost) {
      res.status(404).json({ message: "Post not found" });
    }
    upDatedPost.user = post.user;
    res.json(upDatedPost);
  } catch (error) {
    console.log(error);
  }
});

//get-allPost

app.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
});
