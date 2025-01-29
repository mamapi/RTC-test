export type MappingDictionary = Record<string, string>;

export const parseMappings = (rawMappings: string): MappingDictionary => {
  return Object.fromEntries(
    rawMappings.split(";").map((entry) => entry.split(":"))
  );
};
