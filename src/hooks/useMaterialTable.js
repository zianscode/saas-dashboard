import { useMemo, useState } from "react";

const PAGE_SIZE = 4;

export default function useMaterialTable(materials) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return materials.filter((material) => {
      const matchesStatus =
        statusFilter === "Semua" || material.status === statusFilter;

      const matchesSearch =
        keyword.length === 0 ||
        material.materialName.toLowerCase().includes(keyword) ||
        material.category.toLowerCase().includes(keyword) ||
        String(material.unit ?? "")
          .toLowerCase()
          .includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [materials, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function updateSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function updateStatusFilter(value) {
    setStatusFilter(value);
    setPage(1);
  }

  function goToPage(nextPage) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  }

  return {
    search,
    statusFilter,
    page: safePage,
    totalPages,
    rows,
    totalFiltered: filtered.length,
    setSearch: updateSearch,
    setStatusFilter: updateStatusFilter,
    goToPage,
  };
}
