const numeroSenha = document.querySelector('.parametro-senha__texto');
let tamanhoSenha = 12;
numeroSenha.textContent = tamanhoSenha;
const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvxywz';
const numeros = '0123456789';
const simbolos = '!@%*?#¨&+-.';
const botoes = document.querySelectorAll('.parametro-senha__botao');
const campoSenha = document.querySelector('#campo-senha');
const checkbox = document.querySelectorAll('.checkbox');
const forcaSenha = document.querySelector('.forca');


botoes[0].onclick = diminuiTamanho;
botoes[1].onclick = aumentaTamanho;

function diminuiTamanho(){
    if (tamanhoSenha > 1){
       // tamanhoSenha = tamanhoSenha-1;
       
        tamanhoSenha--;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

function aumentaTamanho(){
    if (tamanhoSenha < 20){
       // tamanhoSenha = tamanhoSenha+1;
       tamanhoSenha++;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

function geraSenha() {
    let alfabeto = '';
    if (checkbox[0].checked) {
        alfabeto = alfabeto + letrasMaiusculas;
    }
    if (checkbox[1].checked) {
        alfabeto = alfabeto + letrasMinusculas;
    }
    if (checkbox[2].checked) {
        alfabeto = alfabeto + numeros;
    }
    if (checkbox[3].checked) {
        alfabeto = alfabeto + simbolos;
    }
    if (alfabeto.length === 0) {
        campoSenha.value = '';
        alert('Selecione ao menos um tipo de caractere para gerar a senha.');
        return;
    }
    const entropiaElemento = document.querySelector('.entropia');
    if (alfabeto.length > 0) {
        const tamanhoAlfabeto = alfabeto.length;
        const entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
        const tentativasPorSegundo = 100e6; // 100 milhões de tentativas por segundo
        const segundosPorDia = 60 * 60 * 24;
        const dias = Math.floor(Math.pow(2, entropia) / (tentativasPorSegundo * segundosPorDia));
        if (!Number.isFinite(dias) || dias > 1e12) {
            entropiaElemento.textContent = 'Um computador pode levar mais de 1.000.000.000.000 dias';
        } else {
            entropiaElemento.textContent = 'Um computador pode levar até ' + dias + ' dias para descobrir essa senha.';
        }
    } else {
        entropiaElemento.textContent = '';
    }
    let senha = '';
    for (let i = 0; i < tamanhoSenha; i++) {
        let numeroAleatorio = Math.random() * alfabeto.length;
        numeroAleatorio = Math.floor(numeroAleatorio);
        senha = senha + alfabeto[numeroAleatorio];
    }
    campoSenha.value = senha;
    classificaSenha();
}
const valorEntropia = document.querySelector('.entropia');
valorEntropia.textContent = 2**Math.floor(entropia)/(100e6*60*60*24);

function classificaSenha(tamanhoAlfabeto){
    let entropia = tamanhoSenha * Math.log2(tamanhoSenha);
    console.log(entropia);
    forcaSenha.classList.remove('fraca','media','forte');
    if (entropia > 57){
        forcaSenha.classList.add('forte');
    } else if (entropia > 35 && entropia < 57) {
        forcaSenha.classList.add('media');
    } else if (entropia <= 35){
        forcaSenha.classList.add('fraca');
    }
}