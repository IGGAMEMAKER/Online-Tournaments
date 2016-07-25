export default {
  image: (result) => {
    switch (result) {
      case 0:
        return 'http://idman365.az/images/news/d9pgjaa.jpg';
        break;
      case 1:
        return 'http://www.guncelfutbol.com/images/haberler/illaramendi-kiymete-bindi.jpg';
        break;
      case 2:
        return 'http://www.guncelfutbol.com/images/haberler/illaramendi-kiymete-bindi.jpg';
        break;
      case 3:
        return 'http://img.bleacherreport.net/img/images/photos/003/500/157/hi-res-c784c930098a0a9fbd4ba097d0366897_crop_north.jpg?w=630&h=420&q=75';
        break;
      case 4:
        return 'http://www2.pictures.gi.zimbio.com/Raul+Gonzalez+Real+Madrid+v+Betis+t5ZDLSaUHRRl.jpg';
        break;
      case 5:
        return 'http://www.abc.es/Media/201407/08/di-stefano-bernabeu--644x362.jpg';
        break;
      default:
        return '';
        break;
    }
  },

  result: (result, share) => {
    switch (result) {
      case 0:
        return share ? 'Я знаю всё о Реале! (нет). А ты? Пройди тест и узнай!' : 'Реал Мадрид? А что это?';
        break;
      case 1:
        return share ? 'Я кое-что знаю о Реале! А ты? Пройди тест и узнай!' : 'Это те, кто в белых футболках играют?';
        break;
      case 2:
        return share ? 'Я кое-что знаю о Реале! А ты? Пройди тест и узнай!' : 'Ты кое-что знаешь о Реале';
        break;
      case 3:
        return share ? 'Я - верный Мадридист. А ты? Пройди тест и узнай!' : 'Ты - верный Мадридист';
        break;
      case 4:
        return share ? 'Я - Мадридист до мозга костей. А ты? Пройди тест и узнай!' : 'Ты - Мадридист до мозга костей';
        break;
      case 5:
        return share ? 'Я - легенда! А ты? Пройди тест и узнай!' : 'Ты - легенда!';
        break;
      default:
        return '';
        break;
    }
  },

  questions: []
}