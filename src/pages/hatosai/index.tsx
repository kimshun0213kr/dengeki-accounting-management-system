import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { UseLoginState } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";

export default function Home() {
  const [isAdmin, isUser, status, Login, Logout] = UseLoginState(false);
  const router = useRouter();
  const path = router.pathname;
  let http = "http";
  if (process.env.NODE_ENV == "production") {
    http = "https";
  }
  return (
    <>
      <VStack>
        {status && (isAdmin || isUser) ? (
          <>
            <Text>Log in as : {isAdmin ? "管理者" : "一般ユーザー"}</Text>
            <Text fontSize={"2xl"}>鳩山祭援助金収支申請ホーム</Text>
            <Link href={"/hatosai/income"}>
              <Box borderBottom="1px solid #fc8819">収入報告</Box>
            </Link>
            <Link href={"/hatosai/outcome"}>
              <Box borderBottom="1px solid #fc8819">支出報告</Box>
            </Link>
            <Button onClick={Logout}>ログアウト</Button>
          </>
        ) : (
          <>
            {status ? (
              <>
                <VStack>
                  <Heading>ログインしてください。</Heading>
                  <Button
                    onClick={() => {
                      router.push(
                        {
                          pathname:
                            http +
                            "://" +
                            process.env.NEXT_PUBLIC_SSO_DOMAIN +
                            "/login",
                          query: { locate: "accounting", path: path },
                        },
                        "http:/localhost:3000/login"
                      );
                    }}
                  >
                    ログイン
                  </Button>
                </VStack>
              </>
            ) : (
              <Heading>ログイン状態確認中</Heading>
            )}
          </>
        )}
      </VStack>
    </>
  );
}
