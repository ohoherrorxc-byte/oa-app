export const getNewDate = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    return {
      year,
      month,
      day,
    };
  };
  
  export const getDate = (year, month, day) => {
    return new Date(year, month, day);
  };
  
  export const formatDate = (date) => {
    date = Number(date);
    return date < 10 ? `0${date}` : date;
  };
  
  export const colorList = [
    {
      name: "工作日",
      value: "#74B925",
    },
    {
      name: "休息日",
      value: "#F5E31C",
    }
  ];
  
  export const handleAQIColor = (value) => {
    // value = +value;
    let grade = "工作日";
    switch (true) {
      case value == "1":
        grade = "工作日";
        break;
      case value == "0":
        grade = "休息日";
        break;
      default:
        grade = "无";
        break;
    }
    return grade;
  };
  
