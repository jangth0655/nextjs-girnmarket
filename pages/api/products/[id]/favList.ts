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
        .json({ ok: false, error: "Could not found product." });
    }

    const existFavProduct = await client.record.findFirst({
      where: {
        userId: user?.id,
        productId: Number(id),
        kind: "FavList",
      },
      select: {
        id: true,
      },
    });

    if (existFavProduct) {
      await client.record.delete({
        where: {
          id: existFavProduct.id,
        },
      });
      return res.json({ ok: true });
    } else {
      await client.record.create({
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
          kind: "FavList",
        },
      });
      return res.json({ ok: true, comment: "찜 목록에 추가되었습니다." });
    }
  } catch (e) {
    console.log(`${e} Error in handler`);
    return res.status(500).json({ ok: false, error: "Error in handler" });
  }
};

export default withSessionAPI(
  withHandler({
    handler,
    method: ["GET"],
    isPrivate: true,
  })
);
