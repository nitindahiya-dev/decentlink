// POST /api/users
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { address } = req.body;
    // TODO: replace with real DB call
    await prisma.user.upsert({
      where: { address },
      create: { address },
      update: {},
    });
    return res.status(200).json({ success: true });
  }
  res.setHeader("Allow", ["POST"]);
  res.status(405).end();
}
