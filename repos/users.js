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

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }
}

const test = async () => {
  // creates a users repository
  const repo = new UsersRepository("users.json");

  const user = await repo.getOne("c8d1b00");

  console.log(user);
};

test();
