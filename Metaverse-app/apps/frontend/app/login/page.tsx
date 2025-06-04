import AuthForm from "@/components/custom/auth-form";
import Logo from "@/components/custom/logo";
import AuthImg from "@/public/auth-bg.jpeg";
import Image from "next/image";

const AuthenticationPage = () => {
  return (
    <div className="h-screen lg:grid lg:grid-cols-2 relative w-full">
      <LeftSide />
      <AuthForm />
    </div>
  );
};

export default AuthenticationPage;

const LeftSide = () => {
  return (
    <div className="relative w-full hidden lg:flex flex-col bg-muted ">
      <div className="absolute w-full h-[30%] bg-gradient-to-t from-transparent to-gray-900/100 top-0 left-0 z-10" />
      <div className="absolute w-full h-[40%] bg-gradient-to-b from-transparent to-gray-900/100 bottom-0 left-0 z-10" />
      <div />
      <Image
        src={AuthImg}
        alt="Login image"
        className="h-full w-full object-cover"
      />
      <div className="absolute z-20 items-center h-full flex flex-col justify-between p-10 text-primary-foreground">
        <Logo />
        <div>
          <i>Your first step into the metaverse era..</i>
        </div>
      </div>
    </div>
  );
};
