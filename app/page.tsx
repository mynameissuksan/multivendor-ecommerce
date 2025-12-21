import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="p-5">
      <div className="w-full flex justify-end">
        <ThemeToggle />
      </div>
      <h1 className="font-bold text-blue-500 font-barlow">
        Welcome to ecommerce
      </h1>
      <Button>Click me</Button>
    </div>
  );
};

export default Home;
