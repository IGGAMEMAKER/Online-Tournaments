export default {
  image: (result) => {
    const images = [
      'http://www.ronaldo7.net/news/2012/cristiano-ronaldo-551-very-sad-face-in-real-madrid-2012-13.jpg',
      'http://english.ahram.org.eg/Media/News/2012/9/16/2012-634834021971526885-152.jpg',
      'http://www.guncelfutbol.com/images/haberler/illaramendi-kiymete-bindi.jpg',
      'http://img.bleacherreport.net/img/images/photos/003/500/157/hi-res-c784c930098a0a9fbd4ba097d0366897_crop_north.jpg?w=630&h=420&q=75',
      'http://www2.pictures.gi.zimbio.com/Raul+Gonzalez+Real+Madrid+v+Betis+t5ZDLSaUHRRl.jpg',
      'http://www.abc.es/Media/201407/08/di-stefano-bernabeu--644x362.jpg'
    ];

    if (result >= 0 && result < images.length) return images[result];

    return '';
  },

  getResultPhrase: (result) => {
    const list = [
      'Ты знаешь всё про Реал (нет)',
      'Это те, кто в белых футболках играют?',
      'Ты кое-что знаешь о Реале',
      'Ты - верный Мадридист',
      'Ты - Мадридист до мозга костей',
      'Ты - легенда!'
    ];

    return list[result];
  },
  getResultPhraseForShareDescription: (result) => {
    const list = [
      'Я знаю всё о Реале! (нет). А ты? Пройди тест и узнай!',
      'Я кое-что знаю о Реале! А ты? Пройди тест и узнай!',
      'Я кое-что знаю о Реале! А ты? Пройди тест и узнай!',
      'Я - верный Мадридист. А ты? Пройди тест и узнай!',
      'Я - Мадридист до мозга костей. А ты? Пройди тест и узнай!',
      'Я - легенда! А ты? Пройди тест и узнай!'
    ];

    return list[result];
  },

  questions: [
    'Год основания ФК Реал Мадрид',
    'Этот игрок является обладателем шести кубков ЛЧ',
    'Его имя скандируют на 7й минуте каждой игры на Бернабеу',
    'Количество кубков ЛЧ у Реала',
    'Реал Мадрид выиграл свой первый кубок ЛЧ в сезоне ...'
  ],
  correct: [4, 1, 2, 3, 1],
  answers: [
    [1899, 1898, 1905, 1902],
    ['Хенто', 'Ди Стефано', 'Бутрагеньо', 'Пушкаш'],
    ['Ди Стефано', 'Хуанито', 'Рауль', 'Зидан'],
    [5, 10, 11, 9],
    ['1955/1956', '1956/1957', '1952/1953', '1958/1959']
  ]
}