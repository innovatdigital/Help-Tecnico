const mongoose = require('mongoose');
const Posts = require('./models/Posts');
const axios = require('axios');
const User = require('./models/User')

mongoose.connect('mongodb+srv://plubee-db:gXJAPhn3xINvt5nC@plubee-db.x4s23ve.mongodb.net/plubee', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  setInterval(async () => {
    const now = new Date();
    const date = now.toISOString().substr(0, 10);
    const time = now.toLocaleTimeString().substr(0, 5);
    console.log(date, time)
    const posts = await Posts.find({ program: true, day: date, hour: time });
    for (const post of posts) {
      post.ids_posts_pages_and_groups.forEach(async(item) => {
        const filter = item.split('_')
        const url = `https://graph.facebook.com/${filter[0]}_${filter[1]}?is_published=true&access_token=${filter[2]}`;
      
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
          console.error('Erro ao atualizar publicação:', error.message);
        }
      })
    }
  }, 5000);
});