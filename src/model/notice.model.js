export class NoticeModel {
    constructor(name, filepath, date, type = "notice") {
        //this.id = id;
        this.name = name;
        this.type = type;
        this.filepath = filepath;
        this.date = date;
    }
}
