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
  correct: [1, 1, 2, 3, 4]
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
