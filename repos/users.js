const fs = require("fs");

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
}

const test = async () => {
  // creates a users repository
  const repo = new UsersRepository("users.json");
  // creates a user record in the repo
  await repo.create({ email: "test@test.com", password: "password" });
  // gets all the contents of repo
  const users = await repo.getAll();
  // logs them
  console.log(users);
};

test();
