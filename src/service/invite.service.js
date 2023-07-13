const Invite = require("../model/invite.model");

class InviteService {
  async getInviteInfo(invite_code) {
    const res = await Invite.findOne({
      where: {
        code: invite_code,
        available: true,
      },
      raw: true,
    });
    return code ? res : null;
  }

  async consumeInvite(code, u_id) {
    const invite = await Invite.findOne({
      where: { code: code },
    });
    if (!invite) {
      return null;
    } else {
      await invite.update({
        available: false,
        u_id,
        used_time,
      });
      return invite.dataValues;
    }
  }
}

module.exports = new InviteService();
