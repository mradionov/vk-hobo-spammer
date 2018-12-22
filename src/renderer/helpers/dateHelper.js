const dateHelper = {

  format(value) {
    const date = new Date(value);
    const formattedDate = date.toLocaleString('ru-RU');
    return formattedDate;
  },

};

export default dateHelper;
