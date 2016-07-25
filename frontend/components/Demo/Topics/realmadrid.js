export default {
  image: (result) => {
    switch (result) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
    }
  },

  result: (result, share) => {
    switch (result) {
      case 0:
        return share ? 'Я - знаю всё о Реале! (нет). А ты? Пройди тест и узнай!' : 'Реал Мадрид? А что это?';
      case 1:
        return share ? 'Я кое-что знаю о Реале! А ты? Пройди тест и узнай!' : 'Это те, кто в белых футболках играют?';
      case 2:
        return share ? 'Реал - лучший! игроки А ты? Пройди тест и узнай!' : 'В Реале собраны лучшие игроки';
      case 3:
        return share ? 'Я - верный Мадридист. А ты? Пройди тест и узнай!' : 'Ты - верный Мадридист';
      case 4:
        return share ? 'Я - Мадридист до мозга костей. А ты? Пройди тест и узнай!' : 'Ты - Мадридист до мозга костей';
      case 5:
        return share ? 'Я - легенда! А ты? Пройди тест и узнай!' : 'Ты - легенда!';
    }
  },

  questions: []
}