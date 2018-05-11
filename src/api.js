const getJSON = async uri => {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${uri}`);
  return res.json();
};

const postParser = (post, site, board) => {
  const base = {
    author: {
      name: post.name,
      trip: post.trip
    },
    title: post.sub,
    body: post.com || "",
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

  let fileUrlBase;
  if (site === "4") {
    fileUrlBase = `https://i.4cdn.org/${board}/`;
  } else if (site === "8") {
    fileUrlBase = "https://media.8ch.net/file_store/";
  }

  if (post.tim) {
    base.files.push({
      link: `${fileUrlBase}${post.tim}${post.ext}`,
      name: `${post.filename}${post.ext}`,
      ext: post.ext
    });

    if (post.extra_files) {
      post.extra_files.forEach(file => {
        base.files.push({
          link: `${fileUrlBase}${file.tim}${file.ext}`,
          name: `${file.filename}${file.ext}`,
          ext: file.ext
        });
      });
    }
  }

  return base;
};

export const getCatalog = async (site, board) => {
  let pages;
  if (site === "4") {
    pages = await getJSON(`a.4cdn.org/${board}/catalog.json`);
  } else if (site === "8") {
    pages = await getJSON(`8ch.net/${board}/catalog.json`);
  }
  const paginatedThreads = pages.map(page => page.threads);
  // Flatten 2D array
  const threads = [].concat(...paginatedThreads);
  return threads.map(post => postParser(post, site, board));
};

export const getThread = async (site, board, threadID) => {
  let posts;
  if (site === "4") {
    posts = (await getJSON(`a.4cdn.org/${board}/thread/${threadID}.json`))
      .posts;
  } else if (site === "8") {
    posts = (await getJSON(`8ch.net/${board}/res/${threadID}.json`)).posts;
  }
  // Map the json to an array of parsed posts
  const thread = posts.map(post => postParser(post, site, board));
  // Make an object that holds the parsed posts, post numbers being the keys
  const hash = {};
  thread.forEach(post => (hash[post.no] = post));

  // Iterate through all posts in the thread.
  // If a post is a reply to any other posts in this thread,
  // move it to the posts it replies to.
  thread.forEach((post, i) => {
    post.mentions.forEach(mention => {
      if (mention in hash) {
        hash[mention].replies.push(post);
      }
    });
  });

  return thread;
};
