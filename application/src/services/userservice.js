import API from "../api/axios";

// Get all cases
export const getMyCases = async () => {
  const res = await API.get("/party1/cases");
  return res.data;
};

// Create case
export const createCase = async (caseData) => {
  const res = await API.post("/party1/cases", caseData);
  return res.data;
};

// Get case by ID
export const getCaseById = async (id) => {
  const res = await API.get(`/party1/cases/${id}`);
  return res.data;
};
