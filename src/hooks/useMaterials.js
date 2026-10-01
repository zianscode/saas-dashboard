import { useCallback, useEffect, useState } from "react";
import { createMaterial, getMaterials } from "../services/materialService";

export default function useMaterials() {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    getMaterials()
      .then((data) => {
        if (!isCancelled) setMaterials(data);
      })
      .catch((requestError) => {
        if (!isCancelled) {
          setError(requestError.message || "Gagal memuat data material");
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getMaterials();
      setMaterials(data);
    } catch (requestError) {
      setError(requestError.message || "Gagal memuat data material");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addMaterial = useCallback(async (payload) => {
    const created = await createMaterial(payload);
    setMaterials((current) => [created, ...current]);

    return created;
  }, []);

  return { materials, isLoading, error, addMaterial, reload };
}