import { SearchIcon } from "lucide-react";
import React from "react";

const Search = () => {
  return (
    <div className="relative lg:w-full flex-1">
      <form className="h-10 rounded-3xl bg-white relative border-none flex">
        <input
          type="text"
          placeholder="Serach..."
          className="bg-white text-black flex-1 border-none pl-2.5 m-2.5 outline-none"
        />
        <button
          type="submit"
          className="border rounded-4xl w-14 h-8 mt-1 mb-0 mr-1 ml-0 bg-linear-to-r from-slate-500 to bg-slate-600 grid place-items-center cursor-pointer"
        >
          <SearchIcon />
        </button>
      </form>
    </div>
  );
};

export default Search;
