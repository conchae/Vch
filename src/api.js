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
    time: {
      created: new Date(post.time * 1000),
      modified: new Date(post.last_modified * 1000)
    },
    replies: post.replies,
    no: post.no,
    id: post.id
  };

  if (post.tim) {
    base.file = {
      link: `https://i.scaley.io/https/media.8ch.net/file_store/${post.tim}${post.ext}`,
      name: `${post.filename}${post.ext}`
    };
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
  return posts.map(postParser);
};
