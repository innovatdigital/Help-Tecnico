const { IgApiClient } = require("instagram-private-api");
const ig = new IgApiClient();

ig.state.generateDevice("pyth.onandjavascript");

(async () => {
  // Faz login na sua conta do Instagram
  await ig.account.login("pyth.onandjavascript", "vava1612");

  // Obtém informações sobre o seu perfil
  const myProfile = await ig.account.currentUser();

  // Obtém informações sobre o post que você deseja responder
  const mediaId = "3037455790307349112"
  const mediaInfo = await ig.media.info(mediaId);

  // Obtém informações sobre os comentários do post
  const comments = mediaInfo.preview_comments;

  if (Array.isArray(comments)) {
    // Percorre os comentários
    for (const comment of comments) {
      // Responde ao comentário
      await ig.media.comment({
        mediaId: mediaId,
        text: "Sua resposta",
      });

      console.log("Resposta enviada com sucesso!");
    }
  } else {
    console.error("comments não é um array.");
  }
})();
