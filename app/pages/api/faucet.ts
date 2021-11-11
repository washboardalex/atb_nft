// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
const key = process.env.PRIVATE_KEY;
const droplet = ethers.utils.parseEther(process.env.DRIP_RATE || "0");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!key || !droplet) {
    res.status(500).send("borked");
    return;
  }
  if (req.method === "POST") {
    const wallet = new ethers.Wallet(
      key,
      new ethers.providers.JsonRpcProvider(
        "https://polygon-mumbai.g.alchemy.com/v2/V4aCPpGIFvVzY9LvRIB-JRcofBKio3te"
      )
    );

    const requesterBalance = await wallet.provider.getBalance(req.body.address);
    console.log(requesterBalance.toString());
    if (requesterBalance.eq(0)) {
      await wallet.sendTransaction({
        to: req.body.address,
        value: droplet,
      });
      res.status(200).send("Funded, you filthy capitalist");
    } else {
      res.status(400).send("Faucet's dry, comrade");
    }
  }
}
