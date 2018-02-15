const getJSON = async uri => {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${uri}`);
  return res.json();
};

const postParser = post => {
  const base = {
    author: {
      name: post.name,
      trip: post.trip
    },
    title: post.sub,
    body: post.com,
    files: [],
    time: {
      created: new Date(post.time * 1000),
      modified: new Date(post.last_modified * 1000)
    },
    mentions: [],
    replies: [],
    no: post.no,
    id: post.id
  };

  // All unique mentions
  const mentions = [...new Set(base.body.match(/&gt;&gt;\d+/gi))];
  if (mentions) {
    base.mentions = mentions.map(mention => parseInt(mention.match(/\d+/)[0]));
  }

  if (post.tim) {
    base.files.push({
      link: `https://media.8ch.net/file_store/${post.tim}${post.ext}`,
      name: `${post.filename}${post.ext}`,
      ext: post.ext
    });

    if (post.extra_files) {
      post.extra_files.forEach(file => {
        base.files.push({
          link: `https://media.8ch.net/file_store/${file.tim}${file.ext}`,
          name: `${file.filename}${file.ext}`,
          ext: file.ext
        });
      });
    }
  }

  return base;
};

export const getCatalog = async board => {
  const pages = await getJSON(`8ch.net/${board}/catalog.json`);
  const paginatedThreads = pages.map(page => page.threads);
  const threads = [].concat(...paginatedThreads);
  return threads.map(postParser);
};

export const getThread = async (board, threadID) => {
  const { posts } = await getJSON(`8ch.net/${board}/res/${threadID}.json`);
  const thread = posts.map(postParser);
  const hash = {};
  thread.forEach(post => (hash[post.no] = post));

  // Iterate through all posts in the thread.
  // If a post is a reply to any other posts in this thread,
  // move it to the posts it replies to, then remove from the top thread level.
  thread.forEach((post, i) => {
    let isReply = false;

    post.mentions.forEach(mention => {
      if (mention in hash) {
        hash[mention].replies.push(post);
        isReply = true;
      }
    });

    if (isReply) {
      delete thread[i];
    }
  });

  return thread.filter(post => post !== undefined);
};
