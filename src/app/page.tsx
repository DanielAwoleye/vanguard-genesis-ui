import dynamic from "next/dynamic";

const VanguardMintClient = dynamic(
  () => import("@/components/VanguardMintClient"),
  { ssr: false }
);

export default function Page() {
  return <VanguardMintClient />;
}
