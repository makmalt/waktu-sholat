"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/searchbar";
import { Spinner } from "@heroui/spinner";
import { useDoa } from "@/queries/doaQueries";

const Doa = () => {
  const [search, setSearch] = useState("");
  const [filteredDoa, setFilteredDoa] = useState([]);

  const { data: doaData, isLoading, isError } = useDoa();

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredDoa(doaData || []);
    } else {
      const filtered = doaData?.filter(
        (doa) =>
          doa.judul.toLowerCase().includes(search.toLowerCase()) ||
          doa.source.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredDoa(filtered || []);
    }
  }, [search, doaData]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setShowDropdown(false);
    console.log(e.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Perform search logic here
    if (filteredDoa.length > 0) {
      setSearch(filteredDoa[0].judul);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 z-50">
        <Spinner color="warning" label="Loading..." variant="dots" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <p>Error loading data. Please reload.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center relative">
      <div className="w-full max-w-xl my-2 top-1/4 fixed z-50">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Cari Doa..."
          onSubmit={handleSearchSubmit}
        />
      </div>
      <div className="w-full max-w-3xl mt-10 fixed bottom-0 overflow-y-auto top-1/3 mb-10">
        <div className="p-4">
          {filteredDoa?.map((doa) => (
            <div
              key={doa.judul}
              className="mb-4 p-4 rounded-lg shadow-md bg-white border"
            >
              <h2 className="text-2xl font-bold mb-2">{doa.judul}</h2>
              <p className="text-2xl mb-2 text-end">{doa.arab}</p>
              <p className="text-base mb-2 italic">{doa.indo}</p>
              <p className="text-sm text-gray-600">Source: {doa.source}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Doa;
