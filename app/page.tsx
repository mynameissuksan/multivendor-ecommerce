import ThemeToggle from "@/components/shared/theme-toggle";
import { UserButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <div className="p-5">
      <div className="w-full flex justify-end space-x-5">
        <UserButton />
        <ThemeToggle />
      </div>
      <h1 className="font-bold text-blue-500 font-barlow">
        Welcome to ecommerce
      </h1>
    </div>
  );
};

export default Home;
