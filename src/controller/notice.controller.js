import { NoticeRepository } from "../repository/notice.repository.js";

export default class NoticeController {
    constructor() {
        // this.userRepsitory = new UserRepository();
        this.noticeRepository = new NoticeRepository();
        // Bind methods to the class instance
        this.getRecentNoticeList = this.getRecentNoticeList.bind(this);
        this.getNoticeList = this.getNoticeList.bind(this);
        this.getNoticeForm = this.getNoticeForm.bind(this);
        this.postNotice = this.postNotice.bind(this);
        this.deleteNotice = this.deleteNotice.bind(this);
    }
    async getRecentNoticeList(req, res) {
        try {
            let arr = await this.noticeRepository.getRecentNoticeList();
            res.status(200).json(arr);
        } catch (err) {
            console.log(err);
            res.status(500).send("Error retrieving notices");
        }
    }
    async getNoticeList(req, res) {
        const start = parseInt(req.query.start) || 1;
        const end = parseInt(req.query.end) || 10;

        const limit = 10; // Number of notices per page
        const previousStart = start - limit > 0 ? start - limit : null;
        const previousEnd = start - 1 > 0 ? start - 1 : null;

        try {
            const notices = await this.noticeRepository.getNoticeList(
                start,
                end
            );

            res.render("Notice List", {
                notices: notices,
                start,
                end,
                nextStart: end + 1,
                nextEnd: end + limit,
                prevStart: previousStart,
                prevEnd: previousEnd,
                userEmail: req.session.userEmail,
            });
        } catch (err) {
            console.log(err);
            res.status(500).send("Error retrieving notices");
        }
    }

    async getNoticeForm(req, res) {
        res.render("Add Notice", {
            userEmail: req.session.userEmail,
        });
    }

    async postNotice(req, res) {
        // res.render("Notice List", {
        //     message: "Notice Added successfully",
        // });
        const { name, type } = req.body;
        const filePath = req.file ? `/notice/${req.file.filename}` : null;

        if (!filePath) {
            return res.status(400).send("File upload failed");
        }

        const notice = {
            name: name,
            type: type,
            path: filePath,
            date: new Date(),
        };

        try {
            await this.noticeRepository.addNewNotice(notice);
            res.redirect("/admin/getNoticeList");
            // res.render("Notice List", {
            //     message: "Notice Added successfully",
            // });
        } catch (err) {
            console.log(err);
            res.status(500).send("Error adding notice");
        }
    }

    async deleteNotice(req, res) {
        // res.render("Notice List", {
        //     message: "Notice deleted successfully",
        // });
        try {
            const decodedPath = decodeURIComponent(req.params.path);
            await this.noticeRepository.deleteNoticeById(
                req.params.id,
                decodedPath
            );
            // res.redirect("/");
            // res.redirect("/admin/getNoticeList");
            res.redirect(
                `/admin/getNoticeList/?start=${req.params.start || 1}&end=${
                    req.params.end || 10
                }`
            );
        } catch (err) {
            console.log(err);
            res.status(500).send("Error deleting notice");
        }
    }
}
