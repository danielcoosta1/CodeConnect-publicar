const uploadBtn = document.getElementById("upload-btn");
const inputUpload = document.getElementById("imagem-upload");
const imagemCarregada = document.querySelector(".imagem-carregada");

// Função para ler e verificar o arquivo
function verificarImagem(arquivo) {
    return new Promise((resolve, reject) => {
      // Verifica se um arquivo foi selecionado
      if (!arquivo) {
        reject("Nenhum arquivo selecionado.");
        return;
      }
  
      // Verifica o tipo do arquivo (aceita apenas imagens)
      const tiposPermitidos = ["image/jpeg", "image/png", "image/gif"];
      if (!tiposPermitidos.includes(arquivo.type)) {
        reject("Tipo de arquivo não permitido. Use JPEG, PNG ou GIF.");
        return;
      }
  
      // Verifica o tamanho do arquivo (limite de 5MB)
      const tamanhoMaximo = 5 * 1024 * 1024; // 5MB
      if (arquivo.size > tamanhoMaximo) {
        reject("O arquivo é muito grande. Tamanho máximo permitido: 5MB.");
        return;
      }
  
      // Usa FileReader para ler o conteúdo do arquivo
      const leitor = new FileReader();
  
      // Quando o arquivo for carregado
      leitor.onload = (evento) => {
        const imagem = new Image(); // Cria um objeto de imagem
        imagem.src = evento.target.result; // Define o src da imagem como o conteúdo do arquivo(URL - O LEITO É UM ARQUIVO URL)
        imagemCarregada.src = imagem.src; //Muda a imagem que mostra na tela para o usuário(imagem que ele selecionou no momento)
        // Quando a imagem for carregada
        imagem.onload = () => {
          // Verifica a resolução da imagem (largura e altura)
          const larguraMaxima = 1920;
          const alturaMaxima = 1080;
  
          if (imagem.width > larguraMaxima || imagem.height > alturaMaxima) {
            reject(`Resolução muito grande. Máximo permitido: ${larguraMaxima}x${alturaMaxima}.`);
          } else {
            resolve({
        
              nome: arquivo.name,
              tamanho: arquivo.size,
              tipo: arquivo.type,
            });
          }
        };
  
        // Se houver erro ao carregar a imagem
        imagem.onerror = () => {
          reject("Erro ao carregar a imagem.");
        };
      };
  
      // Se houver erro ao ler o arquivo
      leitor.onerror = () => {
        reject("Erro ao ler o arquivo.");
      };
  
      // Lê o arquivo como uma URL de dados (Data URL)
      leitor.readAsDataURL(arquivo);
    });
}

uploadBtn.addEventListener("click",()=>{
    inputUpload.click();
});

inputUpload.addEventListener("change", async ()=>{
    const arquivo = inputUpload.files[0]; // Pega o primeiro arquivo selecionado
    
    // Chama a função de verificação
   await verificarImagem(arquivo).then((resultado) => {
        document.getElementById("mensagem").textContent = `
          
          Nome: ${resultado.nome}
          Tipo: ${resultado.tipo}
          
        `;
        document.getElementById("mensagem").style.color = "green";

      })
      .catch((erro) => {
        document.getElementById("mensagem").textContent = erro;
        document.getElementById("mensagem").style.color = "red";
      });
});


const inputTags = document.getElementById("categoria");
const listaTags = document.querySelector(".lista-tags");



listaTags.addEventListener("click", (evento)=>{
    if(evento.target.classList.contains("remove-tag")){
        const tagRemover = evento.target.parentElement;
        listaTags.removeChild(tagRemover);
    }
});


const tagsDisponiveis = ["Front-End","Programação","Data Science","Full Stack","HTML"
, "CSS","JavaScript","React", "Angular","Java","PHP","Front-End","NodeJS"];

async function verificarTagsDisponiveis(tagTexto) {
    return new Promise ((resolve,reject)=>{
      setTimeout(() => {
        if (!tagsDisponiveis.includes(tagTexto)) {
          reject("Tipo de TAG indisponível");
          return;
        } else {
          resolve("Tag disponível");
        }
      
      }, 1000);
    })
}


inputTags.addEventListener("keypress", async (evento)=>{
  if(evento.key === "Enter"){
      evento.preventDefault();
      const tagTexto =  inputTags.value.trim(); // remove os espaços antes e depois da string
      if(tagTexto !== ""){
          await verificarTagsDisponiveis(tagTexto).then(()=>{
            const tagNova = document.createElement("li");
            tagNova.innerHTML = ` <p>${tagTexto}</p>
                        <img src="./assets/img/close-black.svg" class="remove-tag">`;
            
            listaTags.appendChild(tagNova);
            inputTags.value = "";
          }).catch(()=>{
            console.error("Erro ao verificar à TAG");
            alert("Tag indisponível, escolha uma tag válida");
          });
          
      }
  }
});
