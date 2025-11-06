import fs from "fs";
import xmlParser from "xml2json";

export class DataController {

    constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  getFileJson(path, resourceName) {
    try {
      const data = fs.readFileSync(path, "utf8");
      return JSON.parse(data);

    } catch (error) {
      console.error(error);
      this.res.status(500).json({ error: `Failed to read ${resourceName}` });
    }
  }

  setFileJson(path, resourceName, data) {
    try {
      const stringifiedData = JSON.stringify(data, null, 2);
      fs.writeFileSync(path, stringifiedData, "utf8");

    } catch (error) {
      console.error(error);
      this.res.status(500).json({ error: `Failed to write ${resourceName}` });
    }
  }

  getFileXml(path, resourceName) {
    try {
      const data = fs.readFileSync(path, "utf8");
      return JSON.parse(xmlParser.toJson(data));

    } catch (error) {
      console.error(error);
      this.res.status(500).json({ error: `Failed to read ${resourceName}` });
    }
  }

  setFileXml(path, resourceName, data) {
    try {
      const stringifiedData = xmlParser.toXml(JSON.stringify(data, null, 2));
      fs.writeFileSync(path, stringifiedData, "utf8");

    } catch (error) {
      console.error(error);
      this.res.status(500).json({ error: `Failed to write ${resourceName}` });
    }
  }
}