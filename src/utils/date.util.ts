/**
 *
 * @param day N일
 * @returns N일 이전의 Date 값
 */
export function beforeNDay(day: number): Date {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - day);
  return currentDate;
}
