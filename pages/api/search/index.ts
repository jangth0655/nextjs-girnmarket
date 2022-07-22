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
      query: { page = 1, keyword },
    } = req;
    const pageSize = 10;
    const pageNumber = Number(page);

    const term = keyword
      ? String(keyword)
          ?.split(" ")
          .map((word?: string) => ({
            name: {
              startsWith: word,
            },
          }))
      : [];

    const products = await client.product.findMany({
      where: {
        OR: term,
      },
      select: {
        id: true,
        name: true,
        photos: true,
        user: {
          select: {
            username: true,
            avatar: true,
            id: true,
          },
        },
        _count: {
          select: {
            favs: true,
          },
        },
      },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });

    if (!products) {
      return res.json({ ok: false });
    }
    return res.status(201).json({ ok: true, products });
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
