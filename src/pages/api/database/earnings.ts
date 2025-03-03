import prisma from "@/lib/prisma";
import { createHash } from "crypto";
import type { NextApiResponse } from "next";
import axios from "axios";

const encryptSha256 = (str: string) => {
  const hash = createHash("sha256");
  hash.update(str);
  return hash.digest().toString("base64");
};

export default async function handle(
  req: {
    body: {
      year: string;
      inputPass: string;
      sessionToken: string;
    };
  },
  res: NextApiResponse
) {
  const pass = process.env.EARNINGPASS;
  const { year, inputPass, sessionToken } = req.body;
  let isAdmin: boolean = false;
  let http = "http";
  if (process.env.NODE_ENV == "production") {
    http = "https";
  }
  if (sessionToken) {
    axios
      .post(http + "://" + process.env.NEXT_PUBLIC_SSO_DOMAIN + "/api/auth", {
        token: sessionToken,
        mode: "get",
      })
      .then(async (data) => {
        isAdmin = data.data.isAdmin;
        if (inputPass || sessionToken) {
          const hashPass = encryptSha256(inputPass);
          if (pass == hashPass || isAdmin) {
            const result = await prisma.mainAccount.findMany({
              where: {
                year: year,
              },
            });
            let income: number = 0;
            let outcome: number = 0;
            for (var i = 0; i < result.length; i++) {
              income += result[i].income;
              outcome += result[i].outcome;
            }
            var balance = income - outcome;
            const hatoyamaResult = await prisma.hatosaiAccount.findMany({
              where: {
                year: year,
              },
            });
            let hatoyamaIncome: number = 0;
            let hatoyamaOutcome: number = 0;
            for (var i = 0; i < hatoyamaResult.length; i++) {
              hatoyamaIncome += hatoyamaResult[i].income;
              hatoyamaOutcome += hatoyamaResult[i].outcome;
            }
            var hatoyamaBalance = hatoyamaIncome - hatoyamaOutcome;
            const csResult = await prisma.clubsupportAccount.findMany({
              where: {
                year: year,
              },
            });
            let csIncome: number = 0;
            let csOutcome: number = 0;
            for (var i = 0; i < csResult.length; i++) {
              csIncome += csResult[i].income;
              csOutcome += csResult[i].outcome;
            }
            var csBalance = csIncome - csOutcome;
            const alumniResult = await prisma.alumniAccount.findMany({
              where: {
                year: year,
              },
            });
            let alumniIncome: number = 0;
            let alumniOutcome: number = 0;
            for (var i = 0; i < alumniResult.length; i++) {
              alumniIncome += alumniResult[i].income;
              alumniOutcome += alumniResult[i].outcome;
            }
            var alumniBalance = alumniIncome - alumniOutcome;
            const aidResult = await prisma.aid.findMany({
              where: {
                year: year,
              },
            });
            let aidIncome: number = 0;
            let aidOutcome: number = 0;
            for (var i = 0; i < aidResult.length; i++) {
              aidIncome += aidResult[i].income;
              aidOutcome += aidResult[i].outcome;
            }
            var aidBalance = aidIncome - aidOutcome;
            res
              .status(200)
              .json({
                income: income,
                outcome: outcome,
                balance: balance,
                hatosaiIncome: hatoyamaIncome,
                hatosaiOutcome: hatoyamaOutcome,
                hatosaiBalance: hatoyamaBalance,
                csIncome: csIncome,
                csOutcome: csOutcome,
                csBalance: csBalance,
                alumniIncome: alumniIncome,
                alumniOutcome: alumniOutcome,
                alumniBalance: alumniBalance,
                aidIncome: aidIncome,
                aidOutcome: aidOutcome,
                aidBalance: aidBalance,
              });
          } else {
            res.status(403).end();
          }
        } else {
          res.status(403).end();
        }
      })
      .catch((error) => {
        res.status(403).json(error);
      });
  } else {
    res.status(403).end();
  }
}
