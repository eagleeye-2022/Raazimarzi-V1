const API_URL = "http://localhost:5000/api";

export const getAllCases = async () => {
  const res = await fetch(`${API_URL}/cases`);
  return res.json();
};

export const createCase = async (data) => {
  const res = await fetch(`${API_URL}/cases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
