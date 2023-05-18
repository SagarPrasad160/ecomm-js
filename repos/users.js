const fs = require("fs");
const crypto = require("crypto");

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires filename");
    }
    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (error) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async create(attr) {
    attr.id = this.randomId();
    const users = await this.getAll();
    users.push(attr);
    await this.writeAll(users);
    // return the user
    return attr;
  }

  async writeAll(users) {
    await fs.promises.writeFile(this.filename, JSON.stringify(users, null, 2));
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf-8",
      })
    );
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async getOneBy(filters) {
    const records = await this.getAll();
    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }

  async delete(id) {
    const records = await this.getAll();
    const updatedRecords = records.filter((record) => record.id !== id);
    await this.writeAll(updatedRecords);
  }

  async update(id, attr) {
    // get all the records
    const records = await this.getAll();
    // get the record to update
    const record = records.find((record) => record.id === id);
    // update the record
    Object.assign(record, attr);
    // write the updated records  to file
    await this.writeAll(records);
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }
}

module.exports = new UsersRepository("users.json");
