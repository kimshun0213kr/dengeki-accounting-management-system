import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { UseLoginState } from "@/hooks/UseLoginState";
import { useRouter } from "next/router";

export default function Home() {
  const [isAdmin,isUser, status, Login, Logout] = UseLoginState(false);
  const router = useRouter();
  return (
    <>
      <VStack>
        {status ?
        <>
        {isAdmin || isUser ?
          <>
            <Text>Log in as : {isAdmin?"管理者":"一般ユーザー"}</Text>
          </> 
        : null}
        <Text fontSize={"2xl"}>ホーム</Text>
        {isAdmin || isUser ? (
          <>
            <Link href={"/income"}>
              <Box borderBottom="1px solid #fc8819">本予算収入報告</Box>
            </Link>
            <Link href={"/outcome"}>
              <Box borderBottom="1px solid #fc8819">本予算支出報告</Box>
            </Link>
            <Link href={"/other"}>
              <Box borderBottom="1px solid #fc8819">本予算以外の収支報告ページ</Box>
            </Link>
            {isAdmin ? 
            <Link href="/admin">
              <Box borderBottom="1px solid #fc8819">管理者用ページ</Box>
            </Link>
            : null }
            <Button onClick={Logout}>ログアウト</Button>
          </>
        ) : (
          <Button onClick={() => router.push("/login")}>ログイン</Button>
        )}
        </> : 
        <Heading>ログイン状態認証中</Heading> }
      </VStack>
    </>
  );
}
