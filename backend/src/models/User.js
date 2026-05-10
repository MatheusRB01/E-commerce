export default (sequelize, DataTypes) => {

  const User = sequelize.define('User', {

    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    senha: {
      type: DataTypes.STRING
    },

    telefone: {
      type: DataTypes.STRING
    },

    role: {
      type: DataTypes.ENUM('cliente', 'admin'),
      defaultValue: 'cliente'
    }

  })

  return User
}