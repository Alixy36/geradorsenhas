const numeroSenha = document.querySelector('.parametro-senha__texto');
const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvxywz';
const numeros = '0123456789';
const simbolos = '!@%*?#¨&+-.';
const botoes = document.querySelectorAll('.parametro-senha__botao');
const campoSenha = document.querySelector('#campo-senha');
const checkbox = document.querySelectorAll('.checkbox');
const forcaSenha = document.querySelector('.forca');
const botaoGerar = document.querySelector('#botao-gerar');
const entropiaElemento = document.querySelector('.entropia');

let tamanhoSenha = 12;
numeroSenha.textContent = tamanhoSenha;

botoes[0].onclick = diminuiTamanho;
botoes[1].onclick = aumentaTamanho;
botaoGerar.onclick = geraSenha;

geraSenha();

function diminuiTamanho() {
    if (tamanhoSenha > 1) {
        tamanhoSenha--;
    }
    numeroSenha.textContent = tamanhoSenha;
}

function aumentaTamanho() {
    if (tamanhoSenha < 20) {
        tamanhoSenha++;
    }
    numeroSenha.textContent = tamanhoSenha;
}

function possuiSequencia(senha) {
    for (let i = 0; i <= senha.length - 3; i++) {
        const grupo = senha.slice(i, i + 3);
        const ehNumerico = [...grupo].every((caractere) => /[0-9]/.test(caractere));
        const ehAlfabetico = [...grupo].every((caractere) => /[a-zA-Z]/.test(caractere));

        if (!ehNumerico && !ehAlfabetico) {
            continue;
        }

        const valores = [...grupo].map((caractere) => {
            if (ehNumerico) {
                return Number(caractere);
            }
            return caractere.toLowerCase().charCodeAt(0);
        });

        const diferencas = valores.slice(1).map((valor, indice) => valor - valores[indice]);
        const crescente = diferencas.every((diferenca) => diferenca === 1);
        const decrescente = diferencas.every((diferenca) => diferenca === -1);

        if (crescente || decrescente) {
            return true;
        }
    }
    return false;
}

function classificaSenha() {
    let entropia = 0;
    const totalSelecionado = Array.from(checkbox).filter((item) => item.checked).length;

    if (totalSelecionado > 0) {
        const base = Math.max(26, totalSelecionado * 26);
        entropia = tamanhoSenha * Math.log2(base);
    }

    forcaSenha.classList.remove('fraca', 'media', 'forte');
    if (entropia > 57) {
        forcaSenha.classList.add('forte');
    } else if (entropia > 35 && entropia < 57) {
        forcaSenha.classList.add('media');
    } else {
        forcaSenha.classList.add('fraca');
    }
}

function geraSenha() {
    let alfabeto = '';

    if (checkbox[0].checked) {
        alfabeto += letrasMaiusculas;
    }
    if (checkbox[1].checked) {
        alfabeto += letrasMinusculas;
    }
    if (checkbox[2].checked) {
        alfabeto += numeros;
    }
    if (checkbox[3].checked) {
        alfabeto += simbolos;
    }

    if (alfabeto.length === 0) {
        campoSenha.value = '';
        entropiaElemento.textContent = '';
        alert('Selecione ao menos um tipo de caractere para gerar a senha.');
        return;
    }

    const tamanhoAlfabeto = alfabeto.length;
    const entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
    const tentativasPorSegundo = 100e6;
    const segundosPorDia = 60 * 60 * 24;
    const dias = Math.floor(Math.pow(2, entropia) / (tentativasPorSegundo * segundosPorDia));

    if (!Number.isFinite(dias) || dias > 1e12) {
        entropiaElemento.textContent = 'Um computador pode levar mais de 1.000.000.000.000 dias';
    } else {
        entropiaElemento.textContent = 'Um computador pode levar até ' + dias + ' dias para descobrir essa senha.';
    }

    let senha = '';
    let tentativa = 0;

    do {
        senha = '';
        for (let i = 0; i < tamanhoSenha; i++) {
            const indiceAleatorio = Math.floor(Math.random() * alfabeto.length);
            senha += alfabeto[indiceAleatorio];
        }
        tentativa++;

        if (tentativa > 1000) {
            alert('Não foi possível gerar uma senha sem sequências. Tente outra combinação de caracteres.');
            return;
        }
    } while (possuiSequencia(senha));

    campoSenha.value = senha;
    classificaSenha();
}