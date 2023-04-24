const mongoose = require('mongoose');
const User = require('./models/User')
const Comments = require('./models/Comments');
const Posts = require('./models/Posts')
const axios = require('axios');

mongoose.connect('mongodb+srv://devvagner:WZ6IqoCOOWsmAbwS@plubee.7rdk80i.mongodb.net/plubee', { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  setInterval(() => {
    Comments.find({}, (err, doc) => {
      if (err) {
        console.log('Erro ao buscar dados do MongoDB:', err);
      } else if (doc) {
        doc.forEach(async comment => {
          const find_post = await Posts.findOne({id_post: comment.id_post})
          if (find_post) {
            find_post.ids_posts_pages_and_groups.forEach(post => {
              if (post == "xxxxxx_xxxxxxxx") {
                return
              } else {
                const split = post.split('_')
                if (split.length == 3) {
                  if (split[2] == "page") {
                    axios.get(`https://graph.facebook.com/v13.0/${split[0]}/comments?fields=from{id,name},message&access_token=${split[1]}`)
                    .then((res) => {
                      const exists = []
                      
                      comment.comments.forEach(comment => {
                        exists.push(comment.id_comment)
                      })
        
                      let count = 1
        
                      res.data.data.forEach(async(response) => {
                        if (exists.includes(response.id)) {
                          count += 1
                        } else {
                          if (comment.count == comment.limit_comments) {
                            const disableBot = await Comments.findByIdAndDelete(comment._id)

                            const updatePost = await Posts.findOne({id_post: comment.id_post}, {
                              status_bot: false
                            })

                            const data = {
                              _id: updatePost.id_user,
                              "posts.id_post": updatePost.id_post
                            };
                            
                            const replace = {
                              $set: {
                                "posts.$.status_bot": false,
                                "posts.$.comment_content": ""
                              }
                            };
                  
                            const user = await User.findOneAndUpdate(data, replace, { new: true })
                          } else {
                            axios.post(`https://graph.facebook.com/${response.id}/comments?access_token=${split[1]}`, { message: comment.content_comment })
                            .then(async(res) => {
                              console.log('Comentário respondido:', response.id);

                              const update = await Comments.findByIdAndUpdate(comment._id, {
                                "count": comment.count + 1,
        
                                $push: {
                                  comments: {
                                    "id_comment": response.id
                                  }
                                }
                              })
                            })
                            .catch((err) => {
                            });
                          }
                        }
                      })              
                    })
                    .catch((err) => {
                      console.log('Erro ao obter detalhes do post do Facebook');
                      return
                    });
                  } else {
                    return
                  } 
                } else {
                  if (split[3] == "page") {
                    axios.get(`https://graph.facebook.com/v13.0/${split[0]}_${split[1]}/comments?fields=from{id,name},message&access_token=${split[2]}`)
                    .then((res) => {
                      const exists = []
                      
                      comment.comments.forEach(comment => {
                        exists.push(comment.id_comment)
                      })
        
                      let count = 1
        
                      res.data.data.forEach(async(response) => {
                        if (exists.includes(response.id)) {
                          count += 1
                        } else {
                          if (comment.count == comment.limit_comments) {
                            const disableBot = await Comments.findByIdAndDelete(comment._id)

                            const updatePost = await Posts.findOne({id_post: comment.id_post}, {
                              status_bot: false
                            })
                            
                            const data = {
                              _id: updatePost.id_user,
                              "posts.id_post": updatePost.id_post
                            };
                            
                            const replace = {
                              $set: {
                                "posts.$.status_bot": false,
                                "posts.$.comment_content": ""
                              }
                            };
                  
                            const user = await User.findOneAndUpdate(data, replace, { new: true })
                          } else {
                            axios.post(`https://graph.facebook.com/${response.id}/comments?access_token=${split[2]}`, { message: comment.content_comment })
                            .then(async(res) => {
                              console.log('Comentário respondido:', response.id);

                              const update = await Comments.findByIdAndUpdate(comment._id, {
                                "count": comment.count + 1,
        
                                $push: {
                                  comments: {
                                    "id_comment": response.id
                                  }
                                }
                              })
                            })
                            .catch((err) => {
                            });
                          }
                        }
                      })              
                    })
                    .catch((err) => {
                      console.log('Erro ao obter detalhes do post do Facebook');
                      return
                    });
                  } else {
                    return
                  }
                }
              }
            })
          } else {
            return
          }
        })
      }
      }
    );
  }, 15000);
});