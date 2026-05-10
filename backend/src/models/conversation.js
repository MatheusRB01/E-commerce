export default (sequelize, DataTypes) => {
  return sequelize.define("Conversation", {
    userId: DataTypes.INTEGER,
    adminId: DataTypes.INTEGER
  })
}