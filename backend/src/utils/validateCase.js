export const validateCaseInput = (data) => {
  if (!data.caseTitle) return "Case title is required";
  if (!data.petitioner?.fullName) return "Petitioner name is required";
  if (!data.caseType) return "Case type is required";
  return null;
};
