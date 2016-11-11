'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    number: {
      type: DataTypes.INTEGER,
      notNull: false,
    },
    categoryname: {
      type: DataTypes.STRING,
      notNull: false,
    },
    author: {
      type: DataTypes.STRING,
      notNull: true,
    },
    image: {
      type: DataTypes.STRING,
      notNull: false,
    },
    link: {
      type: DataTypes.STRING,
      notNull: true,
    },
    summary: {
      type: DataTypes.STRING,
      notNull: false,
    },
    monthrecommend: {
      type: DataTypes.INTEGER,
      notNull: false,
    },
    monthclick: {
      type: DataTypes.INTEGER,
      notNull: false,
    },
    allrecommend: {
      type: DataTypes.INTEGER,
      notNull: false,
    },
    allclick: {
      type: DataTypes.INTEGER,
      notNull: false,
    },
    allcollection: {
      type: DataTypes.INTEGER,
      notNull: false,
    },
    commentsnumber: {
      type: DataTypes.INTEGER,
      notNull: false,
    },
    lastchapter: {
      type: DataTypes.STRING,
      notNull: false,
    }
  });
};