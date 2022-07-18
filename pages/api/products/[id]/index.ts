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
      query: { id, page = 1 },
      session: { user },
    } = req;
    const pageSize = 5;
    const pageNumber = Number(page);
    const product = await client.product.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        photos: {
          select: {
            id: true,
            url: true,
          },
        },
        _count: {
          select: {
            favs: true,
            purchases: true,
            reviews: true,
          },
        },
        reviews: {
          select: {
            review: true,
            id: true,
            score: true,
          },
          take: pageSize,
          skip: (pageNumber - 1) * pageSize,
        },
      },
    });
    if (!product) {
      return res.status(404).json({ ok: false, error: "상품이 없습니다." });
    }

    const term = product.name.split(" ").map((word) => ({
      name: {
        contains: word,
      },
    }));

    const isLiked = Boolean(
      await client.fav.findFirst({
        where: {
          userId: user?.id,
          productId: Number(id),
        },
        select: {
          id: true,
        },
      })
    );

    const isLikedProduct = Boolean(
      await client.record.findFirst({
        where: {
          userId: user?.id,
          productId: Number(id),
          kind: "FavList",
        },
        select: {
          id: true,
        },
      })
    );

    return res.status(200).json({ ok: true, product, isLiked, isLikedProduct });
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
