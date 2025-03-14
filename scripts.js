//// UPLOAD DA IMAGEM ////
const uploadBtn = document.getElementById("upload-btn");
const imagemUpload = document.getElementById("imagem-upload");

const imagemCarregada = document.querySelector(".imagem-carregada");
let mensagemResultadoImagem = document.getElementById("mensagem");

uploadBtn.addEventListener("click", () => {
  imagemUpload.click();
})


function lerEVerificarImagem(arquivo) {
  return new Promise((resolve, reject) => {
    // Verifica se o arquivo é uma imagem
    const tiposPermitidos = ["image/jpeg", "image/png", "image/gif"];
    if (!tiposPermitidos.includes(arquivo.type)) {
      reject({
        nome: arquivo.name,
        mensagem: "Tipo de arquivo não permitido. Use JPEG, PNG ou GIF."
      });
      return;
    }

    // Verifica o tamanho do arquivo (limite de 5MB)
    const tamanhoMaximo = 5 * 1024 * 1024; // 5MB
    if (arquivo.size > tamanhoMaximo) {
      reject({
        nome: arquivo.name,
        mensagem: "O arquivo é muito grande. Tamanho máximo permitido: 5MB."
      });
      return;
    }

    // Usa FileReader para ler o arquivo
    const leitor = new FileReader();

    // Quando o arquivo for carregado
    leitor.onload = (evento) => {
      const imagem = new Image(); // Cria um objeto de imagem

      // Quando a imagem for carregada
      imagem.onload = () => {
        resolve({
          nome: arquivo.name,
          mensagem: "Arquivo carregado com sucesso!"
        });
      };

      // Se houver erro ao carregar a imagem
      imagem.onerror = () => {
        reject({
          nome: arquivo.name,
          mensagem: "Erro ao carregar a imagem."
        });
      };

      // Define o src da imagem como o conteúdo do arquivo
      imagem.src = evento.target.result;
      imagemCarregada.src = imagem.src;

    };

    // Se houver erro ao ler o arquivo
    leitor.onerror = () => {
      reject({
        nome: arquivo.name,
        mensagem: "Erro ao ler o arquivo."
      });
    };

    // Lê o arquivo como uma URL de dados (Data URL)
    leitor.readAsDataURL(arquivo);
  });
}

// imagemUpload.addEventListener("change", (evento)=>{

//     const arquivo = imagemUpload.files[0]; // Pega o primeiro arquivo selecionado


//     lerEVerificarImagem(arquivo).then((result)=>{
//         mensagemResultadoImagem.textContent = 
//         `
//         ${result.nome} | ${result.mensagem}
//         `;

//         mensagemResultadoImagem.style.color = "green";
//     }).catch((error)=>{
//         mensagemResultadoImagem.textContent = 
//         `
//         ${error.mensagem}
//         `;

//         mensagemResultadoImagem.style.color = "red";
//     });
//   })

imagemUpload.addEventListener("change", async () => {

  const arquivo = imagemUpload.files[0];

  if (!arquivo) {
    mensagemResultadoImagem.textContent = "Nenhum arquivo selecionado.";
    return
  }

  try {
    const resultado = await lerEVerificarImagem(arquivo);

    mensagemResultadoImagem.textContent = `${resultado.nome} | ${resultado.mensagem}`;
    mensagemResultadoImagem.style.color = "green";

  } catch (erro) {
    mensagemResultadoImagem.textContent = `${erro.mensagem}`;
    mensagemResultadoImagem.style.color = "red";
  }

})


///// TAGS /////


const listaDeTags = document.querySelector(".lista-tags");
const inputTag = document.getElementById("categoria");


let tagsDisponiveis = [];
getData();

async function getData() {
  const res = await fetch("tags.json");
  tagsDisponiveis = await res.json();
}


async function verificarTagsDisponiveis(tag, tagsUsadas) {
  const tagsDisponiveisNome = tagsDisponiveis.map((tag => {
    return tag.nome
  }));
  return new Promise((resolve, reject) => {
    if (!tagsDisponiveisNome.includes(tag)) {
      reject("Tag não disponível");
      return
    } else if (tagsUsadas.includes(tag)) {
      reject("Tag já usada");
      return
    } else {
      resolve("Tag disponível!")
    }

  });
}

//EVENTO DE MOSTRAR A TAG NA TELA
inputTag.addEventListener("keypress", async (evento) => {
  const tagsUsadas = Array.from(listaDeTags.querySelectorAll("p")).map((tag) => tag.textContent);

  if (evento.key === "Enter") {

    evento.preventDefault();
    let contador = 0;
    const tag = inputTag.value.trim();

    if (tag != "") {

      try {

        const resultado = await verificarTagsDisponiveis(tag, tagsUsadas);

        listaDeTags.innerHTML +=
          ` 
                              <li id="${contador}">
                              <p>${tag}</p>
                              <img src="./assets/img/close-black.svg" class="remove-tag">
                              </li>
                              `
        inputTag.value = "";
        contador++;

      } catch (error) {
        alert(error);
        inputTag.value = "";
      }

    }

  }

})


//EVENTO DE EXCLUIR A TAG, CLICANDO NO X

listaDeTags.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("remove-tag")) {
    const tagRemover = evento.target.parentElement;
    listaDeTags.removeChild(tagRemover);
  }
})

//// DESCARTAR - LIMPAR PAGINA E REINICIAR FORMULARIO/////

const botaoDescartar = document.querySelector(".botao-descartar");

botaoDescartar.addEventListener("click", (evento) => {
  evento.preventDefault();
  const form = document.querySelector("form");
  form.reset();
  imagemCarregada.src = "./assets/img/imagem1.png";
  mensagemResultadoImagem.textContent = "imagem_projeto.png";
  mensagemResultadoImagem.style.color = "var(--secundary-color)";
  listaDeTags.innerHTML = "";
})


