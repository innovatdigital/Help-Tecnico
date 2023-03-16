const mongoose = require('mongoose');
const Comments = require('./models/Comments');
const Posts = require('./models/Posts')
const axios = require('axios'); // importa a biblioteca Axios // importa seu token de acesso do Facebook

// Conecta-se ao MongoDB
mongoose.connect('mongodb+srv://plubee-db:gXJAPhn3xINvt5nC@plubee-db.x4s23ve.mongodb.net/plubee', { useNewUrlParser: true });

// Cria uma conexão
const db = mongoose.connection;

// Verifica se houve um erro na conexão
db.on('error', console.error.bind(console, 'connection error:'));

// Abre a conexão
db.once('open', function() {
  // Configura um intervalo de 1 segundo para verificar o banco de dados
  setInterval(() => {
    Comments.find({}, (err, doc) => {
      if (err) {
        console.log('Erro ao buscar dados do MongoDB:', err);
      } else if (doc) {
        doc.forEach(async comment => {
          const find_post = await Posts.findOne({id_post: comment.id_post})
          find_post.ids_posts_pages_and_groups.forEach(post => {
            const split = post.split('_')
            axios.get(`https://graph.facebook.com/v13.0/${split[0]}/comments?fields=from{id,name},message&access_token=${split[1]}`)
            .then((res) => {
              const exists = []
              
              comment.comments.forEach(comment => {
                exists.push(comment.id_comment)
              })

              res.data.data.forEach((response) => {
                if (exists.includes(response.id)) {
                  console.log('')
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

                      console.log(count)

                      if (update.count == update.limit_comments) {
                        const disableBot = await Comments.findByIdAndDelete(update._id)

                        const updatePost = await Posts.findOne({id_post: comment.id_post}, {
                          status_bot: false
                        })
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              })              
            })
            .catch((err) => {
              console.log(err)
              console.log('Erro ao obter detalhes do post do Facebook');
            });
          })
        })
      }
      }
    );
  }, 1000);
});