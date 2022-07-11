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
      session: { user },
      query: { kind, page },
    } = req;

    const pageSize = 5;
    const pageNumber = Number(page);

    if (kind === "sale") {
      const sales = await client.record.findMany({
        where: {
          userId: user?.id,
          kind: "Sale",
        },
        select: {
          product: {
            include: {
              _count: {
                select: {
                  favs: true,
                },
              },
            },
          },
        },
        take: pageSize,
        skip: (pageNumber - 1) * pageSize,
      });
      return res.status(200).json({ ok: true, sales });
    }

    if (kind === "purchase") {
      const purchases = await client.record.findMany({
        where: {
          userId: user?.id,
          kind: "Purchase",
        },
        select: {
          product: {
            include: {
              _count: {
                select: {
                  favs: true,
                },
              },
            },
          },
        },
        take: pageSize,
        skip: (pageNumber - 1) * pageSize,
      });
      return res.status(200).json({ ok: true, purchases });
    }

    if (kind === "favList") {
      const favList = await client.record.findMany({
        where: {
          userId: user?.id,
          kind: "FavList",
        },
        select: {
          product: {
            include: {
              _count: {
                select: {
                  favs: true,
                },
              },
            },
          },
        },
        take: pageSize,
        skip: (pageNumber - 1) * pageSize,
      });
      return res.status(200).json({ ok: true, favList });
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
