const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
const mongoose = require('mongoose');
const Posts = require('./models/Posts');
const axios = require('axios');
const User = require('./models/User')
const mime = require('mime-types');
const fs = require('fs')

mongoose.connect('mongodb+srv://devvagner:WZ6IqoCOOWsmAbwS@plubee.7rdk80i.mongodb.net/plubee', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  setInterval(async () => {
    const now = new Date();
    const posts = await Posts.find({
      program: true,
      $or: [
        { day: { $lt: now.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'}) } },
        {
          day: now.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'}),
          hour: { $lt: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false}) }
        }
      ]
    });
    for (const post of posts) {
      if (post.path_image.length == 0) {
        if (post.published == false) {
          post.published = true
          await post.save();

          const ids_update = []
          const promises = []

          const formData = new FormData();
          formData.append("link", post.link);
          formData.append('message', post.content);

          if (post.pages_ids.length > 0) {
            post.pages_ids.forEach((item) => {
              const promise = new Promise(async(resolve, reject) => {
                formData.append('access_token', item.access_token);
      
                axios({
                  method: 'POST',
                  url: `https://graph.facebook.com/v16.0/${item.id}/feed`,
                  data: formData,
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                })
                .then(response => {
                  ids_update.push(`${response.data.id}_${item.access_token}_page`)
                  resolve()
                })
                .catch(error => {
                  resolve();
                });
              })
              promises.push(promise)
            })
          }

          if (post.groups.length > 0) {
            post.groups.forEach((item) => {
              const promise = new Promise(async(resolve, reject) => {
                formData.append('access_token', item.access_token);
                
                axios({
                  method: 'POST',
                  url: `https://graph.facebook.com/v16.0/${item.id}/feed`,
                  data: formData,
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                })
                .then(response => {
                  ids_update.push(`${response.data.id}_${item.access_token}_group`)
                  resolve()
                })
                .catch(error => resolve());
              })
              promises.push(promise)
            });
          }

          await Promise.allSettled(promises)
        
          const ids = post.ids_posts_pages_and_groups
          ids_update.forEach(id => {
            ids.push(id)
          })

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
              "posts.$.program_post": false
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
      } else {
        if (post.published == false) {
          post.published = true
          await post.save();

          const ids_update = []
          const promises = []

          if (post.pages_ids.length > 0) {
            post.pages_ids.forEach((item) => {
              const promise = new Promise((resolve, reject) => {
                const formData = new FormData();
                let endpoint = ''
                let count = 0

                fs.readFile(`./uploads/${post.path_image}`, async (err, data) => {
                  if (err) reject(err);

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
                  
                  axios({
                    method: 'POST',
                    url: `https://graph.facebook.com/v16.0/${item.id}/${endpoint}`,
                    data: formData,
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  })
                  .then(async response => {
                    if (response.data.post_id) {
                      ids_update.push(`${response.data.post_id}_${item.access_token}_page`)
                    } else {
                      ids_update.push(`${response.data.id}_${item.access_token}_page`)
                    }
                    resolve()
                  })
                  .catch(error => resolve());
                })
              })
              promises.push(promise)
            })
          }

          if (post.groups.length > 0) {
            post.groups.forEach((item) => {
              const promise = new Promise((resolve, reject) => {
                const formData = new FormData();
                let endpoint = ''
                let count = 0

                fs.readFile(`./uploads/${post.path_image}`, async (err, data) => {
                  if (err) reject(err);

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
                  
                  axios({
                    method: 'POST',
                    url: `https://graph.facebook.com/v16.0/${item.id}/${endpoint}`,
                    data: formData,
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  })
                  .then(async response => {
                    if (response.data.post_id) {
                      ids_update.push(`${response.data.post_id}_${item.access_token}_group`)
                    } else {
                      ids_update.push(`${response.data.id}_${item.access_token}_group`)
                    }
                    resolve()
                  })
                  .catch(error => resolve());
                })
              })
              promises.push(promise)
            });
          }

          await Promise.allSettled(promises)

          // Pegar a imagem do post
          const filter = ids_update[0].split("_")
          
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
  
            const ids = post.ids_posts_pages_and_groups
            ids_update.forEach(id => {
              ids.push(id)
            })

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
                "posts.$.image": image
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
        }
      }
    }
  }, 1000);
});