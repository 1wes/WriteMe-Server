import express, { Request, Response, NextFunction } from "express";
import { hashPassword, comparePassword } from "../utils/password";
import generateId from "../utils/generateId";
import generateToken from "../utils/token";
import verifyToken from "../middleware/cookie-validation";
import bcrypt from "bcrypt";
import db from "../utils/prisma";

const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    next();
});

router.post("/register", async (req: Request, res: Response) => {
  const { firstName, lastName, email, dialCode, phoneNumber, confirmPassword } =
    req.body;

  try {
    // check if user with this email exists
    let emailCount = await db.user.count({
      where: { email },
    });

    if (emailCount > 0) {
      res.sendStatus(403);
    } else {
      let userId = generateId(100000);
      const phone = dialCode + phoneNumber;
      const salt = await bcrypt.genSalt(10 as number);
      const hashedPassword = await hashPassword(confirmPassword, salt);
      const role = "User";

      await db.user.create({
        data: {
          uuid: userId,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phone,
          salt: salt,
          password: hashedPassword,
          role: role,
        },
      });

      res.sendStatus(200);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/login", async (req: Request, res: Response) => {

  const { email, password } = req.body;

  try {
    let user = await db.user.findUnique({
      where: { email: email },
      select: {
        firstName: true,
        lastName: true,
        password: true,
        uuid: true,
        role: true,
      },
    });

    // if user does not exist
    if (!user) {
      res.sendStatus(404);
      return;
    }

    const { firstName, lastName, uuid, role } = user;

    let passwordMatch = await comparePassword(password, user.password);

    if (passwordMatch) {
      let token = generateToken(email, uuid, role, firstName, lastName);

      res.cookie("authorizationToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

      res.json({
        code: 200,
        role: role,
        firstName: firstName,
        lastName: lastName,
      });
    } else {
      return res.sendStatus(403);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/user-details", verifyToken, async (req: Request, res: Response) => {
  const { tokenInfo } = req;

  const { email } = tokenInfo;

  try {
    const user = await db.user.findUnique({
      where: { email },
      select: {
        firstName: true,
        lastName: true,
      },
    });

    const userName = `${user?.firstName} ${user?.lastName}`;

    res.send(userName);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/logout", (req: Request, res: Response) => {

  res.clearCookie("authorizationToken", { domain: "localhost", path: "/" });

  res.sendStatus(200);
});

router.get("/check-token", verifyToken, (req: Request, res: Response) => {
  const { tokenInfo } = req;

  res.json({
    code: 200,
    role: tokenInfo.role,
    firstName: tokenInfo.firstName,
    lastName: tokenInfo.lastName,
  });    
});

router.post("/forgot-password", (req: Request, res: Response) => {});

export default router;
