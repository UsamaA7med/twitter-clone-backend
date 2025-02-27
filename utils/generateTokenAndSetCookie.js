import JsonWebToken from "jsonwebtoken";
export default async (username, email, fullname, id, res) => {
  const token = JsonWebToken.sign(
    {
      userName: username,
      email: email,
      fullName: fullname,
      _id: id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true, // set to true for production
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};
