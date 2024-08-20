import Link from "next/link";
import {Card, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export default function Home() {
  return (
      <main className="min-h-screen p-24 max-w-screen-lg flex justify-center items-center">
        <Card className="mx-auto justify-center content-center">

          <CardHeader>
            에디터 구현해보기
          </CardHeader>

          <Card className="flex m-4 p-4 justify-center content-center">
            <Link href="/editor"><Button>editor impl</Button></Link>
          </Card>

          <Card className="flex m-4 p-4 justify-center content-center">
            <Link href="/codemirror1"><Button>codemirror1</Button></Link>
          </Card>

          <Card className="flex m-4 p-4 justify-center content-center">
            <Link href="/codemirror2"><Button>codemirror2</Button></Link>
          </Card>

          <Card className="flex m-4 p-4 justify-center content-center">
            <Link href="/lexical1"><Button>lexical1</Button> lexical by meta</Link>
          </Card>
        </Card>
      </main>
  );
}
