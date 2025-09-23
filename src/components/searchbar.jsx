"use client";

import { SearchIcon } from "lucide-react";

const SearchBar = ({
  onSubmit,
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 rounded-xl border-2 border-[#EBEEF7] bg-white px-2 py-1 md:flex-row"
    >
      <div className="ml-2 flex w-full items-center gap-3">
        <SearchIcon size={24} color="black" />
        <input
          type="search"
          name="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full py-4 text-black outline-none"
        />
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-3 rounded-md bg-gray-600 px-5 py-1.5 text-lg text-white transition duration-300 ease-in-out hover:bg-black focus:z-10 focus:ring-4 focus:ring-gray-100 focus:outline-none md:w-auto"
      >
        <SearchIcon size={24} />
        Search
      </button>
    </form>
  );
};

export default SearchBar;
