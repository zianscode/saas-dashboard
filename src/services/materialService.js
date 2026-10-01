import dummyMaterials from "../data/dummyMaterials.json";

const LATENCY = 450;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let store = structuredClone(dummyMaterials);

function normalize(payload) {
  return {
    materialName: String(payload.materialName).trim(),
    category: String(payload.category).trim(),
    qty: Number(payload.qty),
    price: Number(payload.price),
    unit: String(payload.unit ?? "-").trim() || "-",
    date: payload.date ?? new Date().toISOString().slice(0, 10),
    status: payload.status,
  };
}

export async function getMaterials() {
  await wait(LATENCY);
  return [...store].sort((a, b) => b.id - a.id);
}

export async function createMaterial(payload) {
  await wait(LATENCY);

  const nextId = store.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const created = { id: nextId, ...normalize(payload) };

  store = [created, ...store];

  return created;
}