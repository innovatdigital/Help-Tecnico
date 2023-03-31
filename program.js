const mongoose = require('mongoose');
const Posts = require('./models/Posts');
const axios = require('axios');
const User = require('./models/User')
const mime = require('mime-types');
const fs = require('fs')

mongoose.connect('mongodb+srv://plubee-db:gXJAPhn3xINvt5nC@plubee-db.x4s23ve.mongodb.net/plubee', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  setInterval(async () => {
    const now = new Date();
    const date = now.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'});
    const time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    console.log(date, time)
    const posts = await Posts.find({ program: true, day: date, hour: time });
    for (const post of posts) {
      if (post.image.length == 0) {
        post.ids_posts_pages_and_groups.forEach(async(item) => {
          const filter = item.split('_')
          const url = `https://graph.facebook.com/${filter[0]}_${filter[1]}?is_published=true&access_token=${filter[2]}`;
        
          try {
            await axios.post(url);
            console.log('Publicação atualizada:', post.id);
            post.program = false;
            await post.save();
          } catch (error) {
            console.error('Erro ao atualizar publicação:', error);
          }
        })

        if (post.groups.length > 0) {
          const ids_update = []
          const promises = []
        
          if (post.published == false) {
            post.groups.forEach((item) => {
              const promise = new Promise(async(resolve, reject) => {
                const formData = new FormData();
                formData.append("link", post.link);
                formData.append('access_token', item.access_token);
                formData.append('message', post.content);
                
                axios({
                  method: 'POST',
                  url: `https://graph.facebook.com/v16.0/${item.id}/feed`,
                  data: formData,
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                })
                .then(response => {
                  ids_update.push(`${response.data.id}_${item.access_token}`)
                  resolve()
                })
                .catch(error => reject(error));
              })
              promises.push(promise)
            });
        
            await Promise.all(promises)
        
            const ids = post.ids_posts_pages_and_groups
            ids_update.forEach(id => {
              ids.push(id)
            })
        
            post.published = true
            await post.save();
          }
        }

        const data = {
          _id: post.id_user,
          "posts.id_post": post.id_post
        };
        
        const replace = {
          $set: {
            "posts.$.program_post": false
          }
        };

        const user = await User.findOneAndUpdate(data, replace, { new: true })
      } else {
        post.ids_posts_pages_and_groups.forEach(async(item) => {
          const filter = item.split('_')
          const url = `https://graph.facebook.com/${filter[0]}?is_published=true&access_token=${filter[1]}`;
        
          try {
            await axios.post(url);
            console.log('Publicação atualizada:', post.id);
            post.program = false;
            await post.save();
            
            const data = {
              _id: post.id_user,
              "posts.id_post": post.id_post
            };
            
            const replace = {
              $set: {
                "posts.$.program_post": false
              }
            };

            const user = User.findOneAndUpdate(data, replace, { new: true })
          } catch (error) {
            console.error('Erro ao atualizar publicação');
          }
        })

        if (post.groups.length > 0) {
          const ids_update = []
          const promises = []
        
          if (post.published == false) {
            post.groups.forEach((item) => {
              const promise = new Promise((resolve, reject) => {
                fs.readFile(`./uploads/${post.path_image}`, async (err, data) => {
                  if (err) reject(err);
                  
                  const photoData = new Blob([data], { type: "image/png" });
                  const formData = new FormData();
                  formData.append("source", photoData);
        
                  formData.append('access_token', item.access_token);
                  formData.append('message', post.content);
                  
                  axios({
                    method: 'POST',
                    url: `https://graph.facebook.com/v16.0/${item.id}/photos`,
                    data: formData,
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  })
                  .then(response => {
                    ids_update.push(`${response.data.post_id}_${item.access_token}`)
                    resolve()
                  })
                  .catch(error => reject(error));
                })
              })
              promises.push(promise)
            });
        
            await Promise.all(promises)
        
            const ids = post.ids_posts_pages_and_groups
            ids_update.forEach(id => {
              ids.push(id)
            })
        
            post.published = true
            await post.save();
          }
        }

        const data = {
          _id: post.id_user,
          "posts.id_post": post.id_post
        };
        
        const replace = {
          $set: {
            "posts.$.program_post": false
          }
        };

        const user = await User.findOneAndUpdate(data, replace, { new: true })
      }
    }
  }, 5000);
});