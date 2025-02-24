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
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
};
