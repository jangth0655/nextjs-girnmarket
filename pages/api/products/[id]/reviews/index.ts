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
      body: { review },
      session: { user },
      query: { id, page = 1 },
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
        .status(400)
        .json({ ok: false, error: "Could not found product." });
    }
    if (req.method === "GET") {
      const pageSize = 10;
      const productReviews = await client.product.findFirst({
        where: {
          id: Number(id),
        },
        select: {
          reviews: {
            select: {
              id: true,
              review: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
            take: pageSize,
            skip: (Number(page) - 1) * pageSize,
          },
        },
      });
      return res.status(200).json({ ok: true, productReviews });
    }

    if (req.method === "POST") {
      const newReview = await client.review.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          product: {
            connect: {
              id: existProduct.id,
            },
          },
          review,
        },
      });
      return res.status(201).json({ ok: true });
    }
  } catch (e) {
    console.log(`${e} Error in handler`);
    return res.status(500).json({ ok: false, error: "Error in handler" });
  }
};

export default withSessionAPI(
  withHandler({
    handler,
    method: ["POST", "GET"],
    isPrivate: true,
  })
);
