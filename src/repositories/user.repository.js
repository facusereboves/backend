export default class UserRepository {
constructor(dao) {
    this.dao = dao;
}

async createUser(userData) {
    return await this.dao.create(userData);
}

async findByEmail(email) {
    return await this.dao.findOne({ email });
}

async findById(id) {
    return await this.dao.findById(id);
}

async updatePassword(userId, newPassword) {
    return await this.dao.findByIdAndUpdate(userId, { password: newPassword });
}
}
