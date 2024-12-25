export class DateUtils {
  public static dateFrom: Date = new Date(new Date().toDateString());
  public static dateWeek: Date = new Date(
    this.dateFrom.getFullYear(),
    this.dateFrom.getMonth(),
    this.dateFrom.getDate() + 7
  );
  public static dateMonth: Date = new Date(
    this.dateFrom.getFullYear(),
    this.dateFrom.getMonth(),
    this.dateFrom.getDate() + 30
  );
  public static dateYear: Date = new Date(
    this.dateFrom.getFullYear() + 1,
    this.dateFrom.getMonth(),
    this.dateFrom.getDate()
  );
  public static dateOld: Date = new Date(
    1970,
    this.dateFrom.getMonth(),
    this.dateFrom.getDate()
  );
  public static dateNew: Date = new Date(
    2970,
    this.dateFrom.getMonth(),
    this.dateFrom.getDate()
  );
}
