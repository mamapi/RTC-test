export const parseMappings = (rawMappings: string): Record<string, string> => {
  return Object.fromEntries(
    rawMappings.split(";").map((entry) => entry.split(":"))
  );
};
