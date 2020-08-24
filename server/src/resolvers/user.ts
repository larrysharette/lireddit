import { PasswordReset } from "./../entities/PasswordReset";
import { User } from "../entities/User";
import { Resolver, Query, Arg, Ctx, Mutation } from "type-graphql";
import { MyContext } from "src/types";
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { UserResponse } from "./UserResponse";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(@Arg("token") token: string, @Arg("newPassword") newPassword: string, @Ctx() { req }: MyContext): Promise<UserResponse> {
    const changePasswordRow = await PasswordReset.findOne({ token });

    if (!changePasswordRow) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const user = await User.findOne(changePasswordRow.userId);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    const hashed = await argon2.hash(newPassword);
    User.update({ id: user.id }, { password: hashed });

    PasswordReset.delete({ token });

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string) {
    const person = await User.findOne({ email });
    if (!person) {
      return true;
    }

    const token = v4();

    await PasswordReset.create({ token, userId: person.id }).save();

    await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`);

    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    if (!req.session.userId) {
      return undefined;
    }

    return await User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(@Arg("input") input: UsernamePasswordInput, @Ctx() { req }: MyContext): Promise<UserResponse> {
    const errors = validateRegister(input);

    if (errors) {
      return { errors };
    }

    try {
      const userCheck = await User.findOne({ username: input.username });

      if (userCheck) {
        return {
          errors: [
            {
              field: "username",
              message: "username already exists",
            },
          ],
        };
      }

      const hashed = await argon2.hash(input.password);

      const user = await User.create({
        username: input.username,
        email: input.email,
        password: hashed,
      }).save();

      req.session.userId = user.id;

      return { user: user };
    } catch (error) {
      return {
        errors: [
          {
            field: "Uh oh!",
            message: "Something bad happened",
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(@Arg("usernameOrEmail") usernameOrEmail: string, @Arg("password") password: string, @Ctx() { req }: MyContext): Promise<UserResponse> {
    const user = await User.findOne(usernameOrEmail.includes("@") ? { email: usernameOrEmail } : { username: usernameOrEmail });

    if (!user) {
      return {
        errors: [{ field: "usernameOrEmail", message: `that username doesn't exist` }],
      };
    }

    const passwordMatch = await argon2.verify(user.password, password);

    if (!passwordMatch) {
      return {
        errors: [{ field: "password", message: `not a valid password` }],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        res.clearCookie(COOKIE_NAME);
        resolve(true);
      })
    );
  }
}
