import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSessionAPI } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  try {
    const {
      query: { id },
      session: { user },
    } = req;
    const existProduct = await client.product.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
      },
    });
    if (!existProduct) {
      return res
        .status(404)
        .json({ ok: false, error: "Could not found product" });
    }

    const existFav = await client.fav.findFirst({
      where: {
        productId: Number(id),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    });
    if (existFav) {
      await client.fav.delete({
        where: {
          id: existFav.id,
        },
      });
    } else {
      await client.fav.create({
        data: {
          product: {
            connect: {
              id: Number(id),
            },
          },
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.log(`${e} Error in handler`);
    return res.status(500).json({ ok: false, error: "Error in handler" });
  }
};

export default withSessionAPI(
  withHandler({
    handler,
    method: ["POST"],
    isPrivate: true,
  })
);
