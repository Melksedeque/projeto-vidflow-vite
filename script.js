import axios from "axios";

const containerVideos = document.querySelector(".videos__container");
const barraDePesquisa = document.querySelector(".pesquisar__input");
const btnCategoria = document.querySelectorAll(".superior__item");

const url = import.meta.env.PROD
  ? "https://gist.githubusercontent.com/Melksedeque/7921b4aa22c6cacde0dcfd08f06862f0/raw/f0dff06cf476210f9159a547a5ccd0a99437c192/videos.txt"
  : "http://localhost:3000/";

console.log(url);
console.log(import.meta.env.PROD);

async function buscarEMostrarVideos() {
  try {
    const busca = await axios.get(url);
    const videos = busca.data.videos;

    videos.forEach((video) => {
      console.log(video);
      if (video.categoria == "") {
        throw new Error("Vídeo sem categoria!");
      }
      containerVideos.innerHTML += `
                <li class="videos__item">
                    <iframe src="${video.url}" title="${video.titulo}" frameborder="0" allowfullscreen></iframe>
                    <div class="descricao-video">
                        <img class="img-canal" src="${video.imagem}">
                        <h3 class="titulo-video">${video.titulo}</h3>
                        <p class="titulo-canal">${video.descricao}</p>
                        <p class="categoria" hidden>${video.categoria}</p>
                    </div>
                </li>
            `;
    });
  } catch (error) {
    containerVideos.innerHTML = `<p>Houve um erro ao carregar os vídeos: <strong>${error}</strong></p>`;
  }
}

buscarEMostrarVideos();

/**
 * Filtrar Vídeos pela Barra de Pesquisa
 */
barraDePesquisa.addEventListener("input", filtrarPesquisa);
function filtrarPesquisa() {
  const videos = document.querySelectorAll(".videos__item");
  let valorFiltro = barraDePesquisa.value.toLowerCase();

  videos.forEach((video) => {
    const titulo = video
      .querySelector(".titulo-video")
      .textContent.toLowerCase();
    video.style.display = titulo.includes(valorFiltro) ? "block" : "none";
  });
}

/**
 * Filtrar Vídeos pelo Botão da respectiva Categoria
 */
btnCategoria.forEach((botao) => {
  const nomeCategoria = botao.getAttribute("name");
  botao.addEventListener("click", () => {
    filtrarPorCategoria(nomeCategoria);
    definirBotaoAtivo(botao);
  });
});
function filtrarPorCategoria(filtro) {
  const videos = document.querySelectorAll(".videos__item");
  const categoriaTodos = filtro.toLowerCase() === "tudo";

  videos.forEach((video) => {
    const categoria = video
      .querySelector(".categoria")
      .textContent.toLowerCase();
    video.style.display =
      categoriaTodos || categoria.includes(filtro.toLowerCase())
        ? "block"
        : "none";
  });
}
function definirBotaoAtivo(categoria) {
  let categoriaAtiva = document.querySelector(".superior__item.ativo");

  if (categoriaAtiva) {
    categoriaAtiva.classList.remove("ativo");
  }
  categoria.classList.add("ativo");
}
