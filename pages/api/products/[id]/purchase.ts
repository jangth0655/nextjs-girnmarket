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
        userId: true,
      },
    });

    if (!existProduct) {
      return res
        .status(404)
        .json({ ok: false, error: "Could not found product." });
    }

    const alreadyPurchase = await client.record.findFirst({
      where: {
        userId: user?.id,
        productId: Number(id),
        kind: "Purchase",
      },
      select: {
        id: true,
      },
    });

    if (alreadyPurchase) {
      await client.record.delete({
        where: {
          id: alreadyPurchase.id,
        },
      });
      return res.json({ ok: true, comment: "취소되었습니다." });
    } else {
      const purchaseProduct = await client.record.create({
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
          kind: "Purchase",
        },
      });
      const salesProduct = await client.record.create({
        data: {
          product: {
            connect: {
              id: Number(id),
            },
          },
          user: {
            connect: {
              id: existProduct.userId,
            },
          },
          kind: "Sale",
        },
      });

      return res.json({ ok: true, comment: "구매되었습니다." });
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
