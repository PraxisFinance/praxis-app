import { WelcomePage } from "@/components/WelcomePage";
import { AuthBoot } from "@/components/AuthBoot";

export default function Home() {
  return (
    <>
      <AuthBoot />
      <WelcomePage />
    </>
  );
}
