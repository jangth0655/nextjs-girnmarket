import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  try {
    const { email, username } = req.body;
    const payload = Math.floor(100000 + Math.random() * 900000);

    const user = await client.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: {
        id: true,
      },
    });

    const token = await client.token.create({
      data: {
        payload,
        user: {
          connectOrCreate: {
            where: {
              email,
            },
            create: {
              username,
              email,
            },
          },
        },
      },
    });

    return res.status(201).json({ ok: true, token: token.payload });
  } catch (e) {
    console.log(`${e} Error in handler`);
    return res.status(500).json({ ok: false, error: "Error in handler" });
  }
};

export default withHandler({
  handler,
  method: ["POST"],
  isPrivate: false,
});
