'use client';

import { useEffect, useState } from "react";
import SearchBar from "@/components/searchbar";
import { Spinner } from "@heroui/spinner";

const Doa = () => {
  const [listDoa, setListDoa] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredDoa, setFilteredDoa] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoa = async () => {
      try {
        const response = await fetch('https://api.myquran.com/v2/doa/all');
        const data = await response.json();
        setListDoa(data.data);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoa();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredDoa(listDoa || []);
    } else {
      const filtered = listDoa?.filter((doa) =>
        doa.judul.toLowerCase().includes(search.toLowerCase()) || doa.source.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredDoa(filtered || []);
    }
  }, [search, listDoa]);


  const handleSearch = (e) => {
    setSearch(e.target.value);
    setShowDropdown(false)
    console.log(e.target.value);
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    // Perform search logic here
    if (filteredDoa.length > 0) {
      setSearch(filteredDoa[0].judul);
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center px-4 z-50'>
        <Spinner color="warning" label="Loading..." variant="dots" />
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
      <div className="w-full max-w-3xl mt-10 fixed bottom-0 overflow-y-auto top-1/3 mb-2">
        <div className="p-4">
          {filteredDoa?.map((doa) => (
            <div key={doa.judul} className="mb-4 p-4 rounded-lg shadow-md bg-white/80 border">
              <h2 className="text-2xl font-bold mb-2">{doa.judul}</h2>
              <p className="text-2xl mb-2 text-end">{doa.arab}</p>
              <p className="text-base mb-2 italic">{doa.indo}</p>
              <p className="text-sm text-gray-600">Source: {doa.source}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Doa