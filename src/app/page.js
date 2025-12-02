"use client";
import { useTimeStore } from "@/store/time";
import { useEffect, useState } from "react";
import SearchBar from "@/components/searchbar";
import { Spinner } from "@heroui/spinner";
import { useSholat, useKotaSholat } from "@/queries/sholatQueries";

function formatTimeFromwaktu(waktu) {
  const date = new Date(waktu);

  let h = date.getHours().toString().padStart(2, "0");
  let m = date.getMinutes().toString().padStart(2, "0");
  let s = date.getSeconds().toString().padStart(2, "0");

  return `${h}:${m}:${s}`; // 20:48:56
}

function getNextPrayerTime(jadwal, currentTime) {
  const sholat = [
    { name: "Subuh", time: jadwal?.subuh },
    { name: "Dzuhur", time: jadwal?.dzuhur },
    { name: "Ashar", time: jadwal?.ashar },
    { name: "Maghrib", time: jadwal?.maghrib },
    { name: "Isya", time: jadwal?.isya },
  ];

  const times = sholat
    .filter((s) => Boolean(s.time))
    .map((s) => {
      const [hh, mm] = s.time.split(":");
      return {
        ...s,
        date: new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          parseInt(hh, 10),
          parseInt(mm, 10)
        ),
      };
    });

  // cari jadwal sholat berikutnya hari ini
  let next = times.find((t) => t.date > currentTime);

  // jika sudah melewati semua waktu sholat hari ini, next sholat adalah subuh besok
  if (!next) {
    const [hh, mm] = (jadwal?.subuh || "00:00").split(":");
    next = {
      name: "Subuh",
      time: jadwal?.subuh,
      date: new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate() + 1,
        parseInt(hh, 10),
        parseInt(mm, 10)
      ),
    };
  }

  const diffSec = Math.max(0, Math.floor((next.date - currentTime) / 1000));
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  return {
    name: next.name,
    time: next.time,
    countdown: `${hours} jam ${minutes} menit ${seconds} detik`,
  };
}

const Home = () => {
  const { time } = useTimeStore();
  const [search, setSearch] = useState("Jakarta");
  const [filteredKotaList, setFilteredKotaList] = useState([]);
  const [selectedKotaId, setSelectedKotaId] = useState(1301);
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    data: jadwal,
    isLoading: jadwalLoading,
    isFetching: jadwalFetching,
  } = useSholat(selectedKotaId);

  const { data: kotaSholat, isLoading: kotaLoading } = useKotaSholat();

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredKotaList([]);
      return;
    }

    const filtered = kotaSholat?.filter((kota) =>
      kota.lokasi.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredKotaList(filtered);
  }, [search, kotaSholat]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setShowDropdown(true);
  };

  if (!time)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <Spinner color="warning" label="Loading..." />
      </div>
    );

  const nextPrayer = getNextPrayerTime(jadwal, time);

  if (jadwalLoading || jadwalFetching || kotaLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 z-50">
        <Spinner color="warning" label="Loading..." variant="dots" />
      </div>
    );
  }
  console.log("Kota Sholat:", kotaSholat);
  console.log("Jadwal:", jadwal);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 top-1/4">
      <SearchBar
        value={search}
        onChange={handleSearch}
        placeholder="Cari kota..."
      />
      {showDropdown && filteredKotaList.length > 0 && (
        <ul className="h-36 w-full max-w-xl bg-white z-50 rounded-lg shadow-lg border-0 opacity-80 overflow-y-auto overflow-hidden">
          {filteredKotaList.map((kota) => (
            <li
              key={kota.id}
              onClick={() => {
                setSearch(kota.lokasi);
                setShowDropdown(false);
                setSelectedKotaId(kota.id);
              }}
              className="p-1 border-b-1 border-gray-400 hover:bg-gray-200"
              style={{}}
            >
              {kota.lokasi}
            </li>
          ))}
        </ul>
      )}
      <main id="content" className="text-center ">
        <div className="py-10">
          <div className="w-full max-w-xl mx-auto p-5 rounded-2xl shadow border bg-white text-center">
            <div className="block text-5xl font-bold text-black sm:text-6xl">
              {formatTimeFromwaktu(time)}
            </div>
            <p className="mt-3 text-lg text-black">
              {nextPrayer?.countdown} menuju waktu sholat {nextPrayer?.name}
            </p>
          </div>
          <div className="mt-5 flex flex-col justify-center items-center gap-3 sm:flex-row sm:gap-5">
            <div className="flex flex-col text-lg items-center gap-1 p-4 rounded-xl shadow border bg-white min-w-32">
              <h4 className="font-semibold">Shubuh</h4>
              <div className="text-2xl font-bold">
                {jadwal?.subuh ? (
                  jadwal.subuh
                ) : (
                  <div className="animate-pulse bg-gray-300 rounded h-5 w-24"></div>
                )}
              </div>
            </div>
            <div className="flex flex-col text-lg items-center gap-1 p-4 rounded-xl shadow border bg-white min-w-32">
              <div className="font-semibold">Dzuhur</div>
              <div className="text-2xl font-bold">
                {jadwal?.dzuhur ? (
                  jadwal.dzuhur
                ) : (
                  <div className="animate-pulse bg-gray-300 rounded h-5 w-24"></div>
                )}
              </div>
            </div>
            <div className="flex flex-col text-lg items-center gap-1 p-4 rounded-xl shadow border bg-white min-w-32">
              <div className="font-semibold">Ashar</div>
              <div className="text-2xl font-bold">
                {jadwal?.ashar ? (
                  jadwal.ashar
                ) : (
                  <div className="animate-pulse bg-gray-300 rounded h-5 w-24"></div>
                )}
              </div>
            </div>
            <div className="flex flex-col text-lg items-center gap-1 p-4 rounded-xl shadow border bg-white min-w-32">
              <div className="font-semibold">Maghrib</div>
              <div className="text-2xl font-bold">
                {jadwal?.maghrib ? (
                  jadwal.maghrib
                ) : (
                  <div className="animate-pulse bg-gray-300 rounded h-5 w-24"></div>
                )}
              </div>
            </div>
            <div className="flex flex-col text-lg items-center gap-1 p-4 rounded-xl shadow border bg-white min-w-32">
              <div className="font-semibold">Isya</div>
              <div className="text-2xl font-bold">
                {jadwal?.isya ? (
                  jadwal.isya
                ) : (
                  <div className="animate-pulse bg-gray-300 rounded h-5 w-24"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
