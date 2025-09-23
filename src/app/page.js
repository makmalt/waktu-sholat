
'use client'
import { useTimeStore } from '@/store/time';
import { useEffect, useState } from 'react';
import SearchBar from '@/components/searchbar';

function formatTimeFromwaktu(waktu) {
  const date = new Date(waktu);

  let h = date.getHours().toString().padStart(2, "0");
  let m = date.getMinutes().toString().padStart(2, "0");
  let s = date.getSeconds().toString().padStart(2, "0");

  return `${h}:${m}:${s}`; // 20:48:56
}

function getNextPrayerTime(jadwal, currentTime) {
  const sholat = [
    { name: 'Subuh', time: jadwal?.subuh },
    { name: 'Dzuhur', time: jadwal?.dzuhur },
    { name: 'Ashar', time: jadwal?.ashar },
    { name: 'Maghrib', time: jadwal?.maghrib },
    { name: 'Isya', time: jadwal?.isya },
  ];

  const times = sholat.map(s => {
    const [hh, mm] = s?.time.split(':');
    return {
      ...s,
      date: new Date(currentTime?.getFullYear(), currentTime?.getMonth(), currentTime?.getDate(), parseInt(hh), parseInt(mm))
    };
  });

  // jika sudah melewati semua waktu sholat hari ini, next sholat adalah subuh besok
  let nextPrayer = times.find(t => t.date > currentTime);
  if (!nextPrayer) {
    const [hh, mm] = jadwal.subuh.split(':');
    nextPrayer = {
      name: 'Subuh',
      time: jadwal.subuh,
      date: new Date(currentTime?.getFullYear(), currentTime?.getMonth(), currentTime?.getDate() + 1, parseInt(hh), parseInt(mm))
    };

    const diffSec = Math.floor((nextPrayer.date - currentTime) / 1000);
    const hours = Math.floor(diffSec / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;

    return {
      name: nextPrayer.name,
      time: nextPrayer.time,
      countdown: `${hours} jam ${minutes} menit ${seconds} detik`,
    }
  }
}

const Home = () => {
  const { time } = useTimeStore();
  const [jadwal, setJadwal] = useState(null);
  const [search, setSearch] = useState("Jakarta");
  const [listKota, setListKota] = useState([]);
  const [filteredKota, setFilteredKota] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    // Perform search logic here
    if (filteredKota.length > 0) {
      getJadwal(filteredKota[0].id, filteredKota[0].lokasi);
    }
    setShowDropdown(false);
  }

  useEffect(() => { //data kota default
    const fetchJadwal = async () => {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(`https://api.myquran.com/v2/sholat/jadwal/1301/${today}`);
      const data = await res.json();
      setJadwal(data.data.jadwal);
    };
    fetchJadwal();
  }, []);

  useEffect(() => { // ambil data kota
    const fetchKota = async () => {
      const res = await fetch('https://api.myquran.com/v2/sholat/kota/semua');
      const data = await res.json();
      setListKota(data.data);
    };
    fetchKota();
  }, []);

  useEffect(() => { //filter kota
    if (search.trim() === "") {
      setFilteredKota([]);
      return;
    }
    const filtered = listKota.filter((kota) =>
      kota.lokasi.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredKota(filtered);
  }, [search, listKota]);

  const getJadwal = async (id) => { //ambil jadwal setelah di filter

    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(
      `https://api.myquran.com/v2/sholat/jadwal/${id}/${today}`
    );
    const data = await res.json();
    setJadwal(data.data.jadwal);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setShowDropdown(true);
  }

  if (!time) return <div>Loading...</div>;
  if (!jadwal) return <div>Loading...</div>;
  const nextPrayer = getNextPrayerTime(jadwal, time)


  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <SearchBar
        value={search}
        onChange={handleSearch}
        placeholder="Cari kota..."
        onSubmit={handleSearchSubmit}
      />
      {showDropdown && filteredKota.length > 0 && (
        <ul
          className='h-36 w-full max-w-xl bg-white z-50 rounded-lg shadow-lg border-0 opacity-80 overflow-y-auto overflow-hidden'
        >
          {filteredKota.map((kota) => (
            <li
              key={kota.id}
              onClick={() => setSearch(kota.lokasi) || setShowDropdown(false)}
              className='p-1 border-b-1 border-gray-400 hover:bg-gray-200'
              style={{
              }}
            >
              {kota.lokasi}
            </li>
          ))}
        </ul>
      )}
      <main id="content" className="text-center ">
        <div className="py-10">
          <div className="block text-5xl font-bold text-black sm:text-6xl">
            {formatTimeFromwaktu(time)} WIB
          </div>
          <p className="mt-3 text-lg text-black">
            {nextPrayer.countdown} menuju waktu {nextPrayer.name}
          </p>
          <div className="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-5">
            <div className='flex flex-col text-lg'>
              <h4 className=''>Shubuh</h4>
              <div>
                {jadwal?.subuh ? (
                  jadwal.subuh
                ) : (
                  <div className="animate-pulse bg-gray-300 rounded h-4 w-20"></div>
                )}
              </div>
            </div>
            <div className='flex flex-col text-lg'>
              <div>Dzuhur</div>
              <div>
                {jadwal?.dzuhur ? (
                  jadwal.dzuhur
                ) : (
                  <div className="animate-pulse bg-gray-300 rounded h-4 w-20"></div>
                )}
              </div>
            </div>
            <div className='flex flex-col text-lg'>
              <div>Ashar</div>
              <div>
                {jadwal?.ashar ? (
                  jadwal.ashar
                ) : (
                  <div className="animate-pulse bg-gray-300 rounded h-4 w-20"></div>
                )}
              </div>
            </div>
            <div className='flex flex-col text-lg'>
              <div>Maghrib</div>
              <div>
                {jadwal?.maghrib ? (
                  jadwal.maghrib
                ) : (
                  <div className="animate-pulse bg-gray-300 rounded h-4 w-20"></div>
                )}
              </div>
            </div>
            <div className='flex flex-col text-lg'>
              <div>Isya</div>
              <div>
                {jadwal?.isya ? (
                  jadwal.isya
                ) : (
                  <div className="animate-pulse bg-gray-300 rounded h-4 w-20"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

