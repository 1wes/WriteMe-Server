import db from "../src/utils/prisma";
import generateId from "../src/utils/generateId";
import bcrypt from "bcrypt";
import { hashPassword } from '../src/utils/password';

const main = async () => {
  let uuid: string = generateId(100000);
  const role='Admin';
  let salt: string = await bcrypt.genSalt(10);
  let firstName: string = "Super";
  let lastName: string = "User";
  let email: string = "okemwawes@gmail.com";
  let password: string = await hashPassword('admin_123', salt);

  // create initial super user
  await db.user.create({
    data: {
      uuid,
      firstName,
      lastName,
      email,
      password,
      salt,
      role,
    },
  });

  console.log(`[⛁]: Database seeded successfully !`);
};

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
