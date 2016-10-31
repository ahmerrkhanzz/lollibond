module.exports = function() {
  var faker = require('faker');
  var _ = require('lodash');

  //About JSON files
  var aboutsection = require('./aboutsection');
  var eduData = require('./education');
  var generateLimited = require('./generateLimited');

  // CONSTANTS
  var POSTS_COUNT = 50;
  var COMMENTS_COUNT = 50;
  var REPLY_COUNT = 100;

  var peopleData = _.times('20', function(n) {
    return {
      id: n,
      name: faker.name.findName(),
      avatar: faker.internet.avatar(),
      image: faker.random.number({
        'min': 1,
        'max': 14
      })
    }
  });
  peopleData = _.uniq(peopleData, function(e) {
    return e.name;
  });

  // User post data
  var postTypeList = ['Update', 'Question', 'Discussion', 'Idea', 'Announcement', 'News', 'Article'];
  var postPrivacyList = ['Public', 'Friends', 'Friends of Friends', 'Only me'];

  var userPosts = _.times(POSTS_COUNT, function(n) {
    var postType = postTypeList[Math.floor(Math.random() * postTypeList.length)];
    var postPrivacy = postPrivacyList[Math.floor(Math.random() * postPrivacyList.length)];

    return {
      id: n,
      user: 'John Doe',
      userImg: 'assets/images/dummy/users/face1.jpg',
      timestamp: faker.date.past(),
      postType: postType,
      postPrivacy: postPrivacy,
      postContent: faker.lorem.paragraph(),
      postAces: Math.floor(Math.random() * 10) + 1,
      postComments: Math.floor(Math.random() * 10) + 1,
      postAced: Math.random() < 0.5
    };
  });

  // Comments data
  var comments = _.times(COMMENTS_COUNT, function(n) {
    return {
      id: n,
      postId: Math.floor(Math.random() * POSTS_COUNT),
      user: faker.name.findName(),
      userImg: faker.internet.avatar(),
      timestamp: faker.date.past(),
      postContent: faker.lorem.paragraph(),
      postAces: Math.floor(Math.random() * 10) + 1,
      postReplies: Math.floor(Math.random() * 10) + 1,
      postAced: Math.random() < 0.5
    };
  });

  // Comment Reply data
  var replies = _.times(REPLY_COUNT, function(n) {
    return {
      id: n,
      commentId: Math.floor(Math.random() * COMMENTS_COUNT),
      user: faker.name.findName(),
      userImg: faker.internet.avatar(),
      timestamp: faker.date.past(),
      postContent: faker.lorem.paragraph(),
      postAces: Math.floor(Math.random() * 10) + 1,
      postAced: Math.random() < 0.5
    };
  });

  // Comment Reply data
  var search = _.times('50', function(n) {
    return {
      id: n,
      user: faker.name.findName(),
      userImg: faker.internet.avatar(),
      designation: faker.name.jobTitle(),
      company: faker.company.companyName(),
      education: faker.address.city(),
      country: faker.address.country(),
    };
  });

  // Limited posts data
  var limitedPosts = generateLimited(userPosts, 10);
  var limitedComments = generateLimited(comments, 10);
  var limitedReplies = generateLimited(replies, 10);

  // Skills Data
  var skills = _.times('50', function(n) {
    return {
      id: n,
      title: faker.company.catchPhraseNoun()
    };
  });
  skills = _.uniq(skills, function(e) {
    return e.title;
  });

  //Gallery Photos Data
  var photosData = _.times('20', function(n) {
    return {
      id: n,
      title: faker.lorem.words(),
      image: faker.random.number({
        'min': 1,
        'max': 10
      })
    }
  });

  // Pending Requests
  var pendingRequest = _.times('5', function(n) {
    return {
      id: n,
      user: faker.name.findName(),
      userImg: faker.internet.avatar(),
      designation: faker.name.jobTitle(),
      company: faker.company.companyName(),
      education: faker.address.city(),
      country: faker.address.country(),
    };
  });
  // Request Sent
  var requestSent = _.times('10', function(n) {
    return {
      id: n,
      firstName: faker.name.findName(),
      lastName: faker.name.findName(),
      userImg: faker.internet.avatar(),
      designation: faker.name.jobTitle(),
      company: faker.company.companyName(),
      education: faker.address.city(),
      country: faker.address.country(),
    };
  });
  // People I Follow
  var peopleIFollow = _.times('30', function(n) {
    return {
      id: n,
      firstName: faker.name.findName(),
      lastName: faker.name.findName(),
      userImg: faker.internet.avatar(),
      designation: faker.name.jobTitle(),
      company: faker.company.companyName(),
      education: faker.address.city(),
      country: faker.address.country(),
    };
  });
  // People Follow Me
  var peopleFollowMe = _.times('20', function(n) {
    return {
      id: n,
      firstName: faker.name.findName(),
      lastName: faker.name.findName(),
      userImg: faker.internet.avatar(),
      designation: faker.name.jobTitle(),
      company: faker.company.companyName(),
      education: faker.address.city(),
      country: faker.address.country()
    };
  });

  // Chat Data 
  var chatData = _.times('10', function(n){
    return {
      id: n,
      userName: "Bobby Lashley",
      userImg: faker.internet.avatar(),
      message: faker.lorem.sentence()
    };
  });

  return {
    people: peopleData,
    posts: userPosts,
    limitedPosts: limitedPosts,
    limitedComments: limitedComments,
    limitedReplies: limitedReplies,
    comments: comments,
    eduData: eduData,
    skills: skills,
    aboutsection: aboutsection,
    images: [],
    photosData: photosData,
    replies: replies,
    search: search,
    pendingRequest: pendingRequest,
    requestSent: requestSent,
    peopleIFollow: peopleIFollow,
    peopleFollowMe: peopleFollowMe,
    chatData: chatData
  }
};
