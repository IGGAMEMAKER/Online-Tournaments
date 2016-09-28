var Promise = require('bluebird');

var tests = [
  {
    id: 'qweqweqwe',
    description: 'Best Test In the world',
    link: 'best-test-in-the-world',
    cover: '/img/CR2.jpg'
  }, {
    id: 'qweqweqwe2',
    description: 'Second Best Test In the world',
    link: 'second-best-test-in-the-world',
    cover: '/img/covers/dRrHUwfggxs.jpg'
  }, {
    id: 'qweqweqwe3',
    description: 'Насколько ты ботан?',
    link: 'are-you-botan',
    cover: 'http://risovach.ru/thumb/upload/240c240/2012/04/templ_1335682813_orig_Botan.jpg?bl0ge'
  }
];

var testData = {
  questions: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'],
  answers: [
    ['a1', 'a2', 'a3', 'a4'],
    ['a1', 'a2', 'a3', 'a4'],
    ['a1', 'a2', 'a3', 'a4'],
    ['a1', 'a2', 'a3', 'a4'],
    ['a1', 'a2', 'a3', 'a4'],
    ['a1', 'a2', 'a3', 'a4']
  ],
  correct: [1, 1, 2, 3, 4, 1]
};

module.exports = {
  get: () => {
    return new Promise((resolve) => {
      resolve(tests);
    })
  },
  getTestDataById: (id) => {
    return new Promise((resolve) => {
      resolve(testData);
    })
  }
};
