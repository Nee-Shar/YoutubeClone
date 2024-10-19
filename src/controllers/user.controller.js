import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloud } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //steps
  //take input username , name ,id ,password , images etc
  // add validation
  // check if user already exists: username and (or) email
  // store them in db and cloud and send 200
  const { fullName, email, username, password } = req.body;
  //console.log(fullName, email, username, password);

  if (fullName === "") {
    throw new ApiError(400, "Full Name is required");
  }
  if (email === "" || !email.includes("@")) {
    throw new ApiError(400, "Email is required");
  }
  if (username === "") {
    throw new ApiError(400, "Username is required");
  }
  if (password === "") {
    throw new ApiError(400, "Password is required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  //Finds first record from mongo db
  // where username or email matches

  if (existedUser) {
    throw new ApiError(409, "Username or email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverLocalPath = req.files?.cover[0]?.path;

  let coverLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.cover) &&
    req.files.cover.length > 0
  ) {
    coverLocalPath = req.files.cover[0].path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloud(avatarLocalPath);
  let cover;
  if (coverLocalPath) {
    cover = await uploadOnCloud(coverLocalPath);
  }

  if (!avatar) {
    throw new ApiError(500, "Avatar upload failed");
  }

  const user = await User.create({
    fullname: fullName,
    avatar: avatar.url,
    email,
    username: username.toLowerCase(),
    coverImage:
      cover?.url ||
      "https://static-cse.canva.com/blob/1145215/1.magebyRodionKutsaevviaUnsplash.jpg",
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" // we dont want these to pass to user hence we select all fileds except these
  );

  if (!createdUser) {
    throw new ApiError(500, "User registration failed at server");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (e) {
    throw new ApiError(500, "Token generation failed from server side");
  }
};

const loginUser = asyncHandler(async (req, res) => {
  //todos
  // take data from req body
  //validate email , username
  // find user
  // check password
  // generate access and refresh token
  // send cookie
  const { email, username, password } = req.body;
  if (!email || !username) {
    //either usernam+pss or email+pss is reqd
    throw new ApiError(400, "Email or username is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({
    $or: [
      {
        email,
      },
      { username },
    ],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isValid = await user.isPasswordCorrect(password);

  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // to dos
  // find remove refrsh token , reset cookies
  // we have user from middleware verifyJWT
  // so we can use req.user

  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
