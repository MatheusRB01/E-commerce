export default (sequelize, DataTypes) => {

  return sequelize.define("Message", {

    from: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    to: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }

  })

}