  let file_input = document.querySelector('#files');
  const image_text = document.querySelector('.images-text')
  const link_image = document.querySelector('.link_image')
  const div_link = document.querySelector('.div-link')
  const img_post = document.querySelector('.img-post')
  const link_h3 = document.querySelector('.link_h3')
  const link_p = document.querySelector('.link_p')
  const link_content = document.querySelector('.link_content')
  const link_error = document.querySelector('.link_error')
  const preview_image = document.querySelector('.preview-image')
  let image_preview = document.querySelector('.results');
  const enable = document.querySelector('.enable')
  const link = document.querySelector('#link')
  let images = [];
  let pages = []
  let groups = []

  link.addEventListener('input', function() {
    const valor = link.value;

    // Defina a expressão regular para verificar se o valor é um link válido
    const padrao = /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#!]*[\w\-\@?^=%&\/~\+#])*$/;

    // Teste se o valor corresponde ao padrão
    if (padrao.test(valor)) {
      file_input.disabled = true
      file_input.readOnly = true
      file_input.style.display = "none"
      preview_image.style.display = "none"
      
      fetch(`https://graph.facebook.com/v12.0/?id=${link.value}&fields=og_object{title,description,image}`, { method: 'GET' })
        .then(response => {
          if (response.ok) {
            response.json()
          } else {
            img_post.style.display = "none"
            div_link.style.display = "flex"
            link_error.style.display = "flex"
          }
        })
        .then(data => {
          const title = data.og_object.title;
          const description = data.og_object.description;
          const image = data.og_object.image.url;
          
          img_post.style.display = "none"
          link_error.style.display = "none"
          link_image.src = image
          link_h3.innerText = title
          link_p.innerText = description
          link_content.innerText = link.value
        })
        .catch(error => {
          img_post.style.display = "none"
          div_link.style.display = "flex"
          link_error.style.display = "flex"
        });
        
      image_text.innerText = "Você importou um link, não será possível inserir imagens."
    } else {
      div_link.style.display = "none"
      img_post.style.display = "flex"
      file_input.disabled = false
      file_input.readOnly = false
      file_input.style.display = "block"
      preview_image.style.display = "flex"
      image_text.innerText = "Inserir imagens:"
    }
  })

  const handle_file_preview = (e) => {
    let files = e.target.files;
    let length = files.length;

    for(let i = 0; i < length; i++) {
      image_preview.innerHTML = ""
      let image = document.createElement('img');
      image.setAttribute('width', '80');
      image.setAttribute('height', '80');
      image.setAttribute('style', 'margin-right: 1rem; border-radius: 20px; border: 2px solid #752a7a');
      // use the DOMstring for source
      image.src = window.URL.createObjectURL(files[i]);
      image_preview.appendChild(image);
      
      link.disabled = true
      link.readOnly = true

      // add image to images array
      images.push(files[i]);
    }
  }

  function open_pages() {
    const min = document.querySelector('.min')
    const options = document.querySelector('.options')

    min.style.display = "none"
    options.style.display = "flex"
  }
  
  function close_pages() {
    const min = document.querySelector('.min')
    const options = document.querySelector('.options')

    min.style.display = "flex"
    options.style.display = "none"
  }

  function add_page(id, name, access_token) {
    const add = document.querySelector(`#add-page${id}`)
    add.style.display = "none";
    const remove = document.querySelector(`#del-page${id}`)
    remove.style.display = "flex";
    pages.push({id: id, name: name, access_token: access_token})
    const selects = document.querySelector(".selects-page")
  }

  function del_page(id) {
    const add = document.querySelector(`#add-page${id}`)
    add.style.display = "flex";
    const remove = document.querySelector(`#del-page${id}`)
    remove.style.display = "none";
    pages.pop({id: id})
    const selects = document.querySelector(".selects-page")
  }

  function add_group(id, name, access_token) {
    const type_account = '<%= type_account %>'

    if (type_account == "Basico") {
        if (pages.length >= 3) {
            const divMessage = document.querySelector(".alert");
            divMessage.style.display = "flex";
            divMessage.innerHTML = "";
            const message = document.createElement("p");
            const img = document.createElement("img");
            img.src = "/img/admin/Bulk/error.png"
            img.width = "28"
            img.height = "28"
            message.classList.add("message-notify");
            message.innerText = "Não é possível adicionar mais que 3";
            divMessage.appendChild(img);
            divMessage.appendChild(message);
        } else {
            const add = document.querySelector(`#add-group${id}`)
            add.style.display = "none";
            const remove = document.querySelector(`#del-group${id}`)
            remove.style.display = "flex";
            groups.push({id: id, name: name, access_token: access_token})
        }
    } else if (type_account == "Pro") {
        if (groups.length >= 9) {
            const divMessage = document.querySelector(".alert");
            divMessage.style.display = "flex";
            divMessage.innerHTML = "";
            const message = document.createElement("p");
            const img = document.createElement("img");
            img.src = "/img/admin/Bulk/error.png"
            img.width = "28"
            img.height = "28"
            message.classList.add("message-notify");
            message.innerText = "Não é possível adicionar mais que 9";
            divMessage.appendChild(img);
            divMessage.appendChild(message);
        } else {
            const add = document.querySelector(`#add-group${id}`)
            add.style.display = "none";
            const remove = document.querySelector(`#del-group${id}`)
            remove.style.display = "flex";
            groups.push({id: id, name: name, access_token: access_token})
        }
    } else if (type_account == "Avancado") {
        if (groups.length >= 30) {
            const divMessage = document.querySelector(".alert");
            divMessage.style.display = "flex";
            divMessage.innerHTML = "";
            const message = document.createElement("p");
            const img = document.createElement("img");
            img.src = "/img/admin/Bulk/error.png"
            img.width = "28"
            img.height = "28"
            message.classList.add("message-notify");
            message.innerText = "Não é possível adicionar mais que 30";
            divMessage.appendChild(img);
            divMessage.appendChild(message);
        } else {
            const add = document.querySelector(`#add-group${id}`)
            add.style.display = "none";
            const remove = document.querySelector(`#del-group${id}`)
            remove.style.display = "flex";
            groups.push({id: id, name: name, access_token: access_token})
        }
    }
  }

  function del_group(id) {
    const add = document.querySelector(`#add-group${id}`)
    add.style.display = "flex";
    const remove = document.querySelector(`#del-group${id}`)
    remove.style.display = "none";
    groups.pop({id: id})
  }
  
  async function createAlbum(albumName, accessToken) {
    const formData = new FormData();
    formData.append('name', albumName);
    formData.append('access_token', accessToken);

    const response = await fetch('https://graph.facebook.com/v12.0/me/albums', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data.id;
  }
  
  function find_pages(id_account) {
    const pages_list = document.querySelector('.pages-list')
    pages_list.innerHTML = ""

    fetch('/platform/post_facebook/pages/' + id_account)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        data.forEach(page => {
          const div_page = document.createElement('div')
          div_page.style = "display: flex; justify-content: space-between; margin-bottom: 20px"

          const div_name = document.createElement('div')
          div_name.style = "display: flex; align-itens: center"
          
          const name = document.createElement('p')
          name.innerText = page.name
          name.style = "display: flex !important; align-itens: center !important; font-size: 16px; margin-bottom: 10px; font-weight: bold; padding-bottom: 15px; color: #752A7A; display: flex; align-items: center;"

          const img = document.createElement('img')
          img.classList.add('page-icon')
          img.src = page.image

          div_name.appendChild(img)
          div_name.appendChild(name)

          const div_btn = document.createElement('div')
          const btn_add = document.createElement("button");
          btn_add.setAttribute("id", `add-page${page.id_page}`);
          btn_add.setAttribute("class", "event");
          btn_add.setAttribute("onclick", `add_page(${page.id_page}, '${page.name}', '${page.access_token}')`);
          btn_add.textContent = "Selecionar";
          
          const btn_del = document.createElement('button');
          btn_del.setAttribute('id', `del-page${page.id_page}`);
          btn_del.setAttribute('class', 'event');
          btn_del.setAttribute('style', 'display: none; background-color: #bb0404 !important;');
          btn_del.innerHTML = 'Excluir';
          btn_del.onclick = function() {
            del_page(page.id_page, page.name, page.access_token);
          };

          div_btn.appendChild(btn_add)
          div_btn.appendChild(btn_del)

          div_page.appendChild(div_name)
          div_page.appendChild(div_btn)

          pages_list.appendChild(div_page)
        })
      } else {
        const div_page = document.createElement('div')
        div_page.style = "display: flex; justify-content: center; align-itens: center; border: 2px solid #bb0404"
        
        const img = document.createElement('img')
        img.classList.add('page-icon')
        img.src = '../public/img/admin/Bulk/pages.png'

        const p = document.createElement('p')
        p.innerText = "Essa conta não possui nenhuma página. Por favor troque de conta."

        div_page.appendChild(img)
        div_page.appendChild(p)

        pages_list.appendChild(div_page)
      }
    })
  }
  
  function access(id_account) {
    fetch('/platform/post_facebook/access/' + id_account)
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
  }

  function show() {
    const divProgram = document.querySelector('.program-div').style.display = "flex"
  }
  
  function hide() {
    const divProgram = document.querySelector('.program-div').style.display = "none"
  }
  
  function setHide() {
    const close = document.querySelectorAll('.close')
    close.forEach((item) => {
      item.style.display = "none"
    })
  }

  // listen for file input changes
  file_input.addEventListener('change', handle_file_preview);

  function continue_options() {
    const errors = []
    const content = document.querySelector('#content-post');
    const day = document.querySelector('#day');
    const img = document.querySelector('.img-post');
    const hour = document.querySelector('#hour');
    const link = document.querySelector('#link')
    const files = document.querySelector('#files');
    const program = document.querySelector('#program-yes');
    const no_program = document.querySelector('#program-no');

    const padrao = /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#!]*[\w\-\@?^=%&\/~\+#])*$/;

    if (groups.length == 0 && pages.length == 0) {
      const pages = document.querySelector('.pages')
      pages.style = "background-color: #e00d0d50"
      
      const divMessage = document.querySelector(".alert");
      divMessage.style.display = "flex";
      divMessage.innerHTML = "";
      const message = document.createElement("p");
      const img = document.createElement("img");
      divMessage.style = "background-color: #e00d0d !important"
      img.width = "28"
      img.height = "28"
      img.src = "/img/admin/Bulk/error.png"
      message.classList.add("message-notify");
      message.innerText = `Selecione pelo menos um grupo ou página`;
      divMessage.appendChild(img);
      divMessage.appendChild(message);

      setTimeout(() => {
        divMessage.style = "animation: slideoff 2s;"
        setTimeout(() => {
          divMessage.style = "display: none"
        }, 800)
      }, 2000);
      errors.push('Selecione pelo uma conta')
    }
    if (padrao.test(link.value) == false) {
      if (images.length == 0) {
        files.style = "border: 2px dashed #e00d0d !important;";
        errors.push("Insira uma imagem ou link")
      }
    }
    if (program.checked) {
      if (day.value == "") {
        day.style.border = "2px solid #e00d0d";
        errors.push("Selecione o dia")
      }
      if (hour.value == "") {
        hour.style.border = "2px solid #e00d0d";
        errors.push("Selecione a hora")
      }
    }

    if (errors.length == 0) {
      if (padrao.test(link.value)) {
        div_link.style.display = "flex"
        img.style.display = "none"
        const pre = document.querySelector(".pre")
        const description = document.querySelector(".description")
        description.innerText = content.value
        pre.style.display = "flex"
      } else {
        img.style.display = "flex"
        div_link.style.display = "none"
        img.src = window.URL.createObjectURL(files.files[0]);
        const pre = document.querySelector(".pre")
        const description = document.querySelector(".description")
        description.innerText = content.value
        pre.style.display = "flex"
      }
    }
  }

  async function createAlbum(albumName, accessToken) {
    const formData = new FormData();
    formData.append('name', albumName);
    formData.append('access_token', accessToken);

    const response = await fetch('https://graph.facebook.com/v12.0/me/albums', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data.id;
  }

  async function post() {
    const errors = []
    const content = document.querySelector('#content-post');
    const day = document.querySelector('#day');
    const hour = document.querySelector('#hour');
    const link = document.querySelector('#link');
    const files = document.querySelector('#files');
    const program = document.querySelector('#program-yes');
    const no_program = document.querySelector('#program-no');

    const padrao = /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#!]*[\w\-\@?^=%&\/~\+#])*$/;

    if (groups.length == 0 && pages.length == 0) {
      const pages = document.querySelector('.pages')
      pages.style = "background-color: #e00d0d50"
      
      const divMessage = document.querySelector(".alert");
      divMessage.style.display = "flex";
      divMessage.innerHTML = "";
      const message = document.createElement("p");
      const img = document.createElement("img");
      divMessage.style = "background-color: #e00d0d !important"
      img.width = "28"
      img.height = "28"
      img.src = "/img/admin/Bulk/error.png"
      message.classList.add("message-notify");
      message.innerText = `Selecione pelo menos um grupo ou página`;
      divMessage.appendChild(img);
      divMessage.appendChild(message);

      setTimeout(() => {
        divMessage.style = "animation: slideoff 2s;"
        setTimeout(() => {
          divMessage.style = "display: none"
        }, 800)
      }, 2000);
      errors.push('Selecione pelo uma conta')
    }

    if (content.value.length == 0) {
      content.style.border = "2px solid #e00d0d";
      errors.push("Preencha o campo conteúdo")
    }
    if (padrao.test(link.value) == false) {
      if (images.length == 0) {
        files.style = "border: 2px dashed #e00d0d !important;";
        errors.push("Preencha o campo conteúdo")
      }
    }
    if (program.checked) {
      if (day.value == "") {
        day.style.border = "2px solid #e00d0d";
        errors.push("Selecione o dia")
      }
      if (hour.value == "") {
        hour.style.border = "2px solid #e00d0d";
        errors.push("Selecione a hora")
      }
    }
    // if (groups.length == 0) {
    //   errors.push('Selecione um grupo')
    //   const divMessage = document.querySelector(".alert");
    //   divMessage.style.display = "flex";
    //   divMessage.innerHTML = "";
    //   const message = document.createElement("p");
    //   const img = document.createElement("img");
    //   divMessage.style = "background-color: #e00d0d !important"
    //   img.width = "28"
    //   img.height = "28"
    //   img.src = "/img/admin/Bulk/error.png"
    //   message.classList.add("message-notify");
    //   message.innerText = `Selecione pelo menos um grupo ou página`;
    //   divMessage.appendChild(img);
    //   divMessage.appendChild(message);

    //   setTimeout(() => {
    //     divMessage.style = "animation: slideoff 2s;"
    //     setTimeout(() => {
    //       divMessage.style = "display: none"
    //     }, 800)
    //   }, 2000);
    // }
    // if (pages.length == 0) {
    //   errors.push('Selecione uma página')
    //   const divMessage = document.querySelector(".alert");
    //   divMessage.style.display = "flex";
    //   divMessage.innerHTML = "";
    //   const message = document.createElement("p");
    //   const img = document.createElement("img");
    //   divMessage.style = "background-color: #e00d0d !important"
    //   img.width = "28"
    //   img.height = "28"
    //   img.src = "/img/admin/Bulk/error.png"
    //   message.classList.add("message-notify");
    //   message.innerText = `Selecione pelo menos um grupo ou página`;
    //   divMessage.appendChild(img);
    //   divMessage.appendChild(message);

    //   setTimeout(() => {
    //     divMessage.style = "animation: slideoff 2s;"
    //     setTimeout(() => {
    //       divMessage.style = "display: none"
    //     }, 800)
    //   }, 2000);
    // }

    if (errors.length == 0) {
      const content_post = document.querySelector('#content-post');

      // const access_token = access(account.value)
      // const albumId = await createAlbum(content_post.value, access_token);
      const loader = document.querySelector('.loader-div')
      const pre = document.querySelector('.pre')
      pre.style.display = "none"
      loader.style.display = "flex"

      console.log(pages)
      console.log(groups)

      pages.forEach((page) => {
        const formData = new FormData();
        formData.append('access_token', page.access_token);
        formData.append('message', content.value)
        formData.append('link', link.value)
        const ids = []

        if (program.checked) {
          const date = new Date(day.value + " " + hour.value);
          const scheduledTime = Math.floor(date.getTime() / 1000);
          
          formData.append('scheduled_publish', scheduledTime)
          formData.append('published', false)
        }

        Promise.all(images.map(image => {
          const reader = new FileReader();

          return new Promise((resolve, reject) => {
            reader.onload = () => {
              const imageData = new Uint8Array(reader.result);
              const blob = new Blob([imageData], { type: image.type });
              formData.append('source', blob, image.name);
              resolve();
            };

            reader.readAsArrayBuffer(image);
          });
        }))
        .then(() => {
          let endpoint = ""
          if (images.length == 0) {
            endpoint = "feed"
          } else {
            endpoint = "photos"
          }
          return fetch(`https://graph.facebook.com/v16.0/${page.id}/${endpoint}`, {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            ids.push(`${data.id}_${page.access_token}`)
            loader.style.display = "none"
            const divMessage = document.querySelector(".alert");
            divMessage.style.display = "flex";
            divMessage.innerHTML = "";
            const message = document.createElement("p");
            const img = document.createElement("img");
            img.width = "28"
            img.height = "28"
            img.src = "/img/admin/Bulk/checked.png"
            message.classList.add("message-notify");
            message.innerText = "Sucesso!";
            divMessage.appendChild(img);
            divMessage.appendChild(message);

            setTimeout(() => {
              divMessage.style = "animation: slideoff 2s;"
              setTimeout(() => {
                divMessage.style = "display: none"
              }, 800)
            }, 2000);
            return data;
          })
          .catch(error => {
            loader.style.display = "none"
            const divMessage = document.querySelector(".alert");
            divMessage.style.display = "flex";
            divMessage.innerHTML = "";
            const message = document.createElement("p");
            const img = document.createElement("img");
            divMessage.style = "background-color: #e00d0d !important"
            img.width = "28"
            img.height = "28"
            img.src = "/img/admin/Bulk/error.png"
            message.classList.add("message-notify");
            message.innerText = `Erro ao publicar na página: ${page.name}`;
            divMessage.appendChild(img);
            divMessage.appendChild(message);

            setTimeout(() => {
              divMessage.style = "animation: slideoff 2s;"
              setTimeout(() => {
                divMessage.style = "display: none"
              }, 800)
            }, 2000);
            throw error;
          });
        })
        .then(response => {
          const filter = ids[0].split('_')

          fetch(`https://graph.facebook.com/v16.0/${filter[0]}?fields=picture&access_token=${filter[1]}`)
            .then(response => response.json())
            .then(data => {
              const imageUrl = data.picture;
              fetch('/platform/post_facebook/new', {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({pages: pages, groups: groups, content: content.value, program: program.checked, day: day.value, hour: hour.value, image: imageUrl, ids_posts: ids})
              })
              .then(response => {

              })
              .catch(err => {
                console.log(err)
              })
            })
            .catch(error => console.error(error));
        })
        .catch(error => {
          console.error(error);
          const divMessage = document.querySelector(".alert");
          divMessage.style.display = "flex";
          divMessage.innerHTML = "";
          const message = document.createElement("p");
          const img = document.createElement("img");
          divMessage.style = "background-color: #e00d0d !important"
          img.width = "28"
          img.height = "28"
          img.src = "/img/admin/Bulk/error.png"
          message.classList.add("message-notify");
          message.innerText = "Erro ao criar post.";
          divMessage.appendChild(img);
          divMessage.appendChild(message);

          setTimeout(() => {
            divMessage.style = "animation: slideoff 2s;"
            setTimeout(() => {
              divMessage.style = "display: none"
            }, 800)
          }, 2000);
        });
      })
    }
  }
