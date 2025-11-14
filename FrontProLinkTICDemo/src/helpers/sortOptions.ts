export const sortOptions = (vals: any[]) => {
  return vals.sort(
    (leftItem: { label: string }, rightItem: { label: string }) => {
      const nombreA = leftItem.label.toLowerCase().trim();
      const nombreB = rightItem.label.toLowerCase().trim();

      if (nombreA < nombreB) {
        return -1;
      }

      if (nombreA > nombreB) {
        return 1;
      }

      return 0;
    }
  );
};
