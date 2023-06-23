const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
const mongoose = require('mongoose');
const Posts = require('../models/Posts');
const axios = require('axios');
const User = require('../models/User')
const moment = require('moment-timezone');
const mime = require('mime-types');
const fs = require('fs').promises

mongoose.connect('mongodb://127.0.0.1:27017/pluBee', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  let processFinished = true;

  async function findPost() {
    const now = moment().tz('America/Sao_Paulo');

    const posts = await Posts.find({
      program: true,
      published: false,
      $or: [
        { day: { $lt: now.format('DD/MM/YYYY') } },
        {
          day: now.format('DD/MM/YYYY'),
          hour: { $lt: now.format('HH:mm') }
        }
      ]
    })

    if (posts) {
      for (const post of posts) {
        const postDateTime = moment.tz(`${post.day} ${post.hour}`, 'DD/MM/YYYY HH:mm', 'America/Sao_Paulo');

        if (postDateTime.isBefore(now)) {
          if (post.published == false) {
            post.published = true
            await post.save();
  
            return post;
          }
        }
      }
    }
  }

  setInterval(async () => {
    if (!processFinished) {
      return
    }

    processFinished = false;

    const post = await findPost()

    if (post) {
      if (post.path_image.length == 0) {
        const formData = new FormData();
        formData.append("link", post.link);
        formData.append('message', post.content);

        if (post.pages_ids.length > 0) {
          const ids = []

          for (const item of post.pages_ids) {
            if (!ids.includes(item.id)) {
              ids.push(item.id)

              formData.append('access_token', item.access_token);
      
              try {
                const response = await axios({
                  method: 'POST',
                  url: `https://graph.facebook.com/v16.0/${item.id}/feed`,
                  data: formData,
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                });

                const insertIdPost = await Posts.findByIdAndUpdate(post._id, {
                  $push: {
                    results: {id: `${response.data.id}`, name: item.name, icon: item.icon, status: "published", type: "page"},
                    ids_posts_pages_and_groups: `${response.data.id}_${item.access_token}_page`
                  }
                })
              } catch (error) {
                const saveError = await Posts.findByIdAndUpdate(post._id, {
                  $push: {
                    results: {id: "", name: item.name, icon: item.icon, status: "error", type: "page"},
                  }
                })

                continue
              }
            } else {
              continue
            }
          }
        }

        if (post.groups.length > 0) {
          const ids = []

          for (const item of post.groups) {
            if (!ids.includes(item.id)) {
              ids.push(item.id)

              formData.append('access_token', item.access_token);
      
              try {
                const response = await axios({
                  method: 'POST',
                  url: `https://graph.facebook.com/v16.0/${item.id}/feed`,
                  data: formData,
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                });

                const insertIdPost = await Posts.findByIdAndUpdate(post._id, {
                  $push: {
                    results: {id: `${response.data.id}`, name: item.name, icon: item.icon, status: "published", type: "group"},
                    ids_posts_pages_and_groups: `${response.data.id}_${item.access_token}_group`
                  }
                })
              } catch (error) {
                const saveError = await Posts.findByIdAndUpdate(post._id, {
                  $push: {
                    results: {id: "", name: item.name, icon: item.icon, status: "error", type: "group"},
                  }
                })

                continue
              }
            } else {
              continue
            }
          }
        }

        const date = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(date);
        
        const findResults = await Posts.findById(post._id).select("results")

        const data = {
          _id: post.id_user,
          "posts.id_post": post.id_post
        };
        
        const replace = {
          $set: {
            "posts.$.program_post": false,
            "posts.$.results": findResults.results
          },

          $push: {
            notifications: {
              "title": "Publicação realizada com sucesso.",
              "message": `Sua publicação: "${post.content.slice(0, 10)}..." que estava programada foi realizada com sucesso.`,
              "type": "post",
              "date": dataFormat
            }
          }
        };

        await post.save();

        const user = await User.findOneAndUpdate(data, replace, { new: true })
      } else {
        if (post.pages_ids.length > 0) {
          const ids = []

          for (const item of post.pages_ids) {
            if (!ids.includes(item.id)) {
              ids.push(item.id)

              const formData = new FormData();
              let endpoint = ''

              fs.readFile(`./uploads/${post.path_image}`, async (err, data) => {
                if (err) return;

                const fileType = mime.lookup(`./uploads/${post.path_image}`);
                
                if (!videoTypes.includes(fileType)) {
                  endpoint = "photos"

                  const photoData = new Blob([data], { type: "image/png" });
                  formData.append("source", photoData);
        
                  formData.append('access_token', item.access_token);
                  formData.append('message', post.content);
                } else {
                  endpoint = "videos"

                  const videoData = new Blob([data], { type: "video/mp4" });
                
                  formData.append("access_token", item.access_token);
                  formData.append("source", videoData, "video.mp4");
                  formData.append("title", post.content);
                  formData.append("description", post.content);
                }

                try {
                  const response = await axios({
                    method: 'POST',
                    url: `https://graph.facebook.com/v16.0/${item.id}/${endpoint}`,
                    data: formData,
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  });

                  if (response.data.post_id) {
                    const insertIdPost = await Posts.findByIdAndUpdate(post._id, {
                      $push: {
                        results: {id: `${response.data.post_id}`, name: item.name, icon: item.icon, status: "published", type: "page"},
                        ids_posts_pages_and_groups: `${response.data.post_id}_${item.access_token}_page`
                      }
                    })
                  } else {
                    const insertIdPost = await Posts.findByIdAndUpdate(post._id, {
                      $push: {
                        results: {id: `${response.data.id}`, name: item.name, icon: item.icon, status: "published", type: "page"},
                        ids_posts_pages_and_groups: `${response.data.id}_${item.access_token}_page`
                      }
                    })
                  }
                } catch (error) {
                  const saveError = await Posts.findByIdAndUpdate(post._id, {
                    $push: {
                      results: {id: "", name: item.name, icon: item.icon, status: "error", type: "page"},
                    }
                  })

                  return
                }
              })
            } else {
              continue
            }
          }
        }

        if (post.groups.length > 0) {
          const ids = [];
      
          for (const item of post.groups) {
            if (!ids.includes(item.id)) {
              ids.push(item.id);
      
              let endpoint = '';
      
              try {
                const data = await fs.readFile(`./uploads/${post.path_image}`);
                const fileType = mime.lookup(`./uploads/${post.path_image}`);
      
                const formData = new FormData();
      
                if (!videoTypes.includes(fileType)) {
                  endpoint = "photos";
                  const photoData = new Blob([data], { type: "image/png" });
                  formData.append("source", photoData);
                  formData.append('access_token', item.access_token);
                  formData.append('message', post.content);
                } else {
                  endpoint = "videos";
                  const videoData = new Blob([data], { type: "video/mp4" });
                  formData.append("access_token", item.access_token);
                  formData.append("source", videoData, "video.mp4");
                  formData.append("title", post.content);
                  formData.append("description", post.content);
                }
           
                const response = await axios({
                  method: 'POST',
                  url: `https://graph.facebook.com/v16.0/${item.id}/${endpoint}`,
                  data: formData,
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                });
    
                if (response.data.post_id) {
                  const insertIdPost = await Posts.findByIdAndUpdate(post._id, {
                    $push: {
                      results: {id: `${response.data.post_id}`, name: item.name, icon: item.icon, status: "published", type: "group"},
                      ids_posts_pages_and_groups: `${response.data.post_id}_${item.access_token}_group`
                    }
                  });
                } else {
                  const insertIdPost = await Posts.findByIdAndUpdate(post._id, {
                    $push: {
                      results: {id: `${response.data.id}`, name: item.name, icon: item.icon, status: "published", type: "group"},
                      ids_posts_pages_and_groups: `${response.data.id}_${item.access_token}_group`
                    }
                  });
                }
              } catch (error) {
                const saveError = await Posts.findByIdAndUpdate(post._id, {
                  $push: {
                    results: {id: "", name: item.name, icon: item.icon, status: "error", type: "group"},
                  }
                })

                continue;
              }
            } else {
              continue;
            }
          }
        }

        const findPost = await Posts.findById(post._id)
        const filter = findPost.ids_posts_pages_and_groups[findPost.ids_posts_pages_and_groups.length - 1].split("_");

        if (!filter.includes('xxxxxx')) {        
          let url = ''

          if (filter.length == 4) {
            url = `https://graph.facebook.com/v16.0/${filter[0]}_${filter[1]}?fields=picture&access_token=${filter[2]}`
          } else {
            url = `https://graph.facebook.com/v16.0/${filter[0]}?fields=picture&access_token=${filter[1]}`
          }

          axios({
            method: 'GET',
            url: url,
          })
          .then(async response => {
            const image = response.data.picture;
            
            fs.unlink(`./uploads/${post.path_image}`, (err) => {
              if (err) {
                console.log(err)
              }
            });

            const date = Date.now();
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const formater = new Intl.DateTimeFormat('pt-BR', options);
            const dataFormat = formater.format(date);  

            const data = {
              _id: post.id_user,
              "posts.id_post": post.id_post
            };
            
            const replace = {
              $set: {
                "posts.$.program_post": false,
                "posts.$.image": image,
                "posts.$.results": findPost.results
              },

              $push: {
                notifications: {
                  "title": "Publicação realizada com sucesso.",
                  "message": `Sua publicação: "${post.content.slice(0, 10)}..." que estava programada foi realizada com sucesso.`,
                  "type": "post",
                  "date": dataFormat
                }
              }
            };

            post.image = image
            await post.save();

            const user = await User.findOneAndUpdate(data, replace, { new: true })
          })
          .catch((err) => {
            console.log('erro')
          })
        } else {
          fs.unlink(`./uploads/${post.path_image}`, (err) => {
            if (err) {
              console.log(err)
            }
          });

          const date = Date.now();
          const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
          const formater = new Intl.DateTimeFormat('pt-BR', options);
          const dataFormat = formater.format(date);  

          const data = {
            _id: post.id_user,
            "posts.id_post": post.id_post
          };
          
          const replace = {
            $set: {
              "posts.$.program_post": false,
              "posts.$.image": 'post',
              "posts.$.results": findPost.results
            },

            $push: {
              notifications: {
                "title": "Publicação realizada com sucesso.",
                "message": `Sua publicação: "${post.content.slice(0, 10)}..." que estava programada foi realizada com sucesso.`,
                "type": "post",
                "date": dataFormat
              }
            }
          };

          await post.save();

          const user = await User.findOneAndUpdate(data, replace, { new: true })
        }
      }
    }

    processFinished = true;
  }, 1000);
});