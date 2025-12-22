import { SignUp } from "@clerk/nextjs";

const PageSignUp = () => {
  return (
    <div className="min-h-screen w-full grid place-content-center">
      <SignUp />
    </div>
  );
};

export default PageSignUp;
