const util = require("util");
const crypto = require("crypto");

const scrypt = util.promisify(crypto.scrypt);

const Repository = require("./respository");

class UsersRepository extends Repository {
  async create(attr) {
    attr.id = this.randomId();
    const salt = crypto.randomBytes(8).toString("hex");

    const buf = await scrypt(attr.password, salt, 64);
    const record = {
      ...attr,
      password: `${buf.toString("hex")}.${salt}`,
    };
    const users = await this.getAll();
    users.push(record);
    await this.writeAll(users);
    // return the user
    return record;
  }
  async comparePasswords(saved, password) {
    const [hash, salt] = saved.split(".");
    const hashedPasswordBuf = await scrypt(password, salt, 64);
    return hashedPasswordBuf.toString("hex") === hash;
  }
}

module.exports = new UsersRepository("users.json");
