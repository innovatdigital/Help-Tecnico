const mongoose = require('mongoose');
const User = require('../models/User')
const Comments = require('../models/Comments');
const Posts = require('../models/Posts')
const axios = require('axios');

mongoose.connect('mongodb://127.0.0.1:27017/pluBee', { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  let processFinished = true;

  async function findComments() {
    const comments = await Comments.find({});

    return comments
  }

  setInterval(async () => {
    if (!processFinished) {
      return
    }

    processFinished = false;

    const comments = await findComments()

    for (const comment of comments) {
      try {
        if (comment.contents) {
          const find_post = await Posts.findOne({ id_post: comment.id_post });

          if (find_post) {
            for (const post of find_post.ids_posts_pages_and_groups) {
              if (post === 'xxxxxx_xxxxxxxx') {
                continue;
              }

              const split = post.split('_');

              if (split.length !== 3 && split.length !== 4) {
                continue;
              }

              const isPage = split[2] === 'page' || split[3] === 'page';

              if (!isPage) continue

              const url = `https://graph.facebook.com/v13.0/${split[0]}_${split[1]}/comments?fields=from{id,name},message&access_token=${split[2]}`

              const res = await axios.get(url);
              const exists = [];

              for (const response of res.data.data) {
                exists.push(response.id);

                if (!comment.comments.some((c) => c.id_comment === response.id)) {
                  if (comment.count === comment.limit_comments) {
                    await Comments.findByIdAndDelete(comment._id);

                    await Posts.findOneAndUpdate(
                      { id_post: comment.id_post },
                      {
                        $set: {
                          status_bot: false,
                          'posts.$.status_bot': false,
                          'posts.$.contents': [],
                        },
                      }
                    );

                    const user = await User.findOneAndUpdate(
                      {
                        _id: updatePost.id_user,
                        'posts.id_post': updatePost.id_post,
                      },
                      {
                        $set: {
                          'posts.$.status_bot': false,
                          'posts.$.contents': [],
                        },
                      },
                      { new: true }
                    );
                  } else {
                    const randomIndex = Math.floor(Math.random() * comment.contents.length);
                    const randomContent = comment.contents[randomIndex];

                    const responseUrl = `https://graph.facebook.com/${response.id}/comments?access_token=${split[2]}`;

                    await axios.post(responseUrl, { message: randomContent });

                    console.log('Comentário respondido:', response.id);

                    await Comments.findByIdAndUpdate(comment._id, {
                      $push: {
                        comments: {
                          id_comment: response.id,
                        },
                      },
                      $inc: {
                        count: 1,
                      },
                    });
                  }
                }
              }
            }
          }
        } else {
          continue
        }
      } catch (err) {
        // console.log(err)
        continue
      }
    }

    processFinished = true;
  }, 1000);
});