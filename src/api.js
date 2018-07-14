const getJSON = async uri => {
  const res = await fetch(uri);
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Failed to fetch ${uri}`);
  }
};

function format(text) {
  return text
    .split("\n")
    .map(line => {
      let p = "<p>";

      if (line === "") {
        return `<p class="empty"></p>`;
      }

      // These detect if the line itself is a quote
      if (/^>[^>].+$/.test(line)) {
        p = `<p class="quote">`;
      } else if (/(?!^<.+>)^<.+$/.test(line)) {
        p = `<p class="rquote">`;
      }

      line = line
        .replace(/\>\>\d+/g, match => `<a>${match}</a>`)
        .replace(/(\[+[^[]+])/g, match => `<strong>${match}</strong>`)
        // 8ch specific, fixes broken urls
        .replace(/\:(\/\/\s|\<em\>\/\/\<\/em\>)/g, "://")
        // Linkify urls
        .replace(
          /(https?:\/\/[.\w\/?\-_.~!*'();:@&=+$,/?%#–—]+)/g,
          match =>
            `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`
        );

      return p + line + "</p>";
    })
    .join("");
}

class ParsedPost {
  constructor() {
    this.author = {
      name: "",
      trip: "",
      id: ""
    };
    this.meta = {
      threadID: undefined,
      no: undefined,
      link: "",
      time: undefined
    };
    this.files = [];
    this.title = "";
    this.body = "";
    this.mentions = [];
  }
}

class LiveParsedPost extends ParsedPost {
  constructor(board, threadID, post) {
    super();

    this.author = {
      name: post.name,
      trip: post.trip,
      id: post.id
    };
    this.meta = {
      threadID: threadID,
      no: post.no,
      link: `https://8ch.net/${board}/res/${threadID}.html#${post.no}`,
      time: new Date(post.time * 1000)
    };
    this.title = post.sub;
    this.body = post.com;

    // Add in all of the attached files
    let fileUrlBase = "https://media.8ch.net/file_store/";
    if (post.tim) {
      this.files.push({
        preview: `${fileUrlBase}thumb/${post.tim}${post.ext}`,
        link: `${fileUrlBase}${post.tim}${post.ext}`,
        name: `${post.filename}${post.ext}`
      });

      if (post.extra_files) {
        post.extra_files.forEach(file => {
          this.files.push({
            preview: `${fileUrlBase}thumb/${post.tim}${post.ext}`,
            link: `${fileUrlBase}${file.tim}${file.ext}`,
            name: `${file.filename}${file.ext}`
          });
        });
      }
    }
  }
}

class ArchivedParsedPost extends ParsedPost {
  constructor(post, isAMention) {
    super();

    this.author = {
      name: post.name,
      trip: post.trip,
      id: post.userId
    };
    this.meta = {
      threadID: post.threadId,
      no: post.id,
      link: post.link,
      time: new Date(post.timestamp * 1000)
    };
    if (post.images) {
      this.files = post.images.map(file => {
        const link = `https://qanon.pub/data/images/${
          file.url.split("/").slice(-1)[0]
        }`;
        return {
          preview: link,
          link: link,
          name: file.filename
        };
      });
    }
    this.title = post.subject || post.title;
    if (post.text) {
      this.body = format(post.text);
    }
    if (post.references && !isAMention) {
      this.mentions = post.references.map(
        mention => new ArchivedParsedPost(mention, true)
      );
    }
  }
}

const getThreadIds = async (board, limit = Infinity) => {
  const pages = await getJSON(`https://8ch.net/${board}/threads.json`);
  return pages
    .reduce((accumulator, page) => accumulator.concat(page.threads), [])
    .slice(0, limit)
    .map(thread => thread.no);
};

const findQPostsInThread = async (board, threadID, qTripcode) => {
  let postsArray;
  try {
    const response = await getJSON(
      `https://8ch.net/${board}/res/${threadID}.json`
    );
    postsArray = response.posts;
  } catch (err) {
    console.warn(
      `We couldn't get thread #${threadID} on ${board}, so we won't be scanning it.`,
      err
    );
    return [];
  }

  // Make an object that holds all of the thread's posts, post numbers being the keys
  // This makes it easy to find replies later on
  let postsObject = {};
  postsArray.forEach(post => (postsObject[post.no] = post));

  // Get all the Q posts in this thread, and parse them
  let qPosts = postsArray
    .filter(post => post.trip === qTripcode)
    .map(post => new LiveParsedPost(board, threadID, post));

  // Check if Q is mentioning/replying to any other posts in this thread
  qPosts.forEach((post, i) => {
    // All unique mentions
    const mentionIds = [...new Set(post.body.match(/&gt;&gt;\d+/gi))].map(id =>
      parseInt(id.match(/\d+/)[0])
    );
    mentionIds.forEach(id => {
      if (id in postsObject) {
        const mention = new LiveParsedPost(board, threadID, postsObject[id]);
        post.mentions.push(mention);
      }
    });
  });

  return qPosts;
};

export const findNewQPosts = async (boards, qTripcode) => {
  let posts = [];
  // Get all of the threads from the catalog of each board,
  // then search each thread for Q posts.
  await Promise.all(
    boards.map(async board => {
      const threads = await getThreadIds(board, 15);
      await Promise.all(
        threads.map(async threadID => {
          const postsInThisThread = await findQPostsInThread(
            board,
            threadID,
            qTripcode
          );
          // Add any posts found in this thread
          posts.push(...postsInThisThread);
        })
      );
    })
  );

  // Unsorted
  return posts;
};

export const getArchivedQPosts = async () => {
  const posts = await getJSON("https://qanon.pub/data/json/posts.json");
  return posts.map(post => new ArchivedParsedPost(post));
};
