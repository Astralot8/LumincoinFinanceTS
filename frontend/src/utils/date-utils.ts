

export class DateUtils{
    static dateFrom = new Date(new Date().toDateString());
    static dateWeek = new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth(), this.dateFrom.getDate() + 7);
    static dateMonth = new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth(), this.dateFrom.getDate() + 30);
    static dateYear = new Date(this.dateFrom.getFullYear() + 1, this.dateFrom.getMonth(), this.dateFrom.getDate());
    static dateOld = new Date(1970, this.dateFrom.getMonth(), this.dateFrom.getDate());
    static dateNew = new Date(2970, this.dateFrom.getMonth(), this.dateFrom.getDate());
    
    

    
}