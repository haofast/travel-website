import { DataController } from "../utilities/DataController.js";

export class ContactDataController extends DataController {

  static SUBMISSIONS_PATH = "src/api/data/contact/ContactSubmissions.json";

  getAllSubmissions() {
    return this.getFileJson(ContactDataController.SUBMISSIONS_PATH, "submissions");
  }

  setSubmissions(submissions) {
    return this.setFileJson(ContactDataController.SUBMISSIONS_PATH, "submissions", submissions);
  }

  saveSubmission() {
    const allSubmissions = this.getAllSubmissions();
    const newSubmission = this.req.body;
    allSubmissions.push(newSubmission);
    this.setSubmissions(allSubmissions);
    this.res.sendStatus(200);
  }
}