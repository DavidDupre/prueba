import moment from "moment";

export const filterObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== "")
  );
};

export function checkIfMoreThanADay(date: string, estado: string) {
  const today = new Date();
  const dateToCheck = moment(date).toDate();
  const difference = today.getTime() - dateToCheck.getTime();
  const days = difference / (1000 * 3600 * 24);
  return days > 1 && estado === "Por asignar";
}