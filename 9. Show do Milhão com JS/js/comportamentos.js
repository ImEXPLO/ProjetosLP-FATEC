function tocar_audio(qual_tocar) { // Essas funções de return foram exatamente para tentar impedir o bug do timer na pergunta final, sem sucesso
    return new Promise((resolve, reject) => { // Peguei até ajuda com uma dev que conheço, mas nem ela conseguiu evitar o bug, vai entender..
        const audio = document.getElementById("silvio-santos");

        audio.loop = false;
        audio.currentTime = 0;

        switch (qual_tocar) {
            case 'abertura':
                audio.src = "audio/abertura-show-do-milhao.mp3";
                break;
            case 'comecar':
                audio.src = "audio/1000.wav";
                break;
            case 'acertou':
                audio.src = "audio/parabens.wav";
                break;
            case 'ganhou':
                audio.src = "audio/ganhou.wav";
                break;
            case 'errou':
                audio.src = "audio/errou.wav";
                break;
            case 'pergunta-2000':
                audio.src = "audio/2000.wav";
                break;
            case 'pergunta-3000':
                audio.src = "audio/3000.wav";
                break;
            case 'pergunta-4000':
                audio.src = "audio/4000.wav";
                break;
            case 'pergunta-5000':
                audio.src = "audio/5000.wav";
                break;
            case 'pergunta-10000':
                audio.src = "audio/10000.wav";
                break;
            case 'pergunta-20000':
                audio.src = "audio/20000.wav";
                break;
            case 'pergunta-30000':
                audio.src = "audio/30000.wav";
                break;
            case 'pergunta-40000':
                audio.src = "audio/40000.wav";
                break;
            case 'pergunta-50000':
                audio.src = "audio/50000.wav";
                break;
            case 'pergunta-100000':
                audio.src = "audio/100000a.wav";
                break;
            case 'pergunta-200000':
                audio.src = "audio/200000.wav";
                break;
            case 'pergunta-300000':
                audio.src = "audio/300000.wav";
                break;
            case 'pergunta-400000':
                audio.src = "audio/400000.wav";
                break;
            case 'pergunta-500000':
                audio.src = "audio/500000.wav";
                break;
            case 'pergunta-1000000':
                audio.src = "audio/1000000.wav";
                break;
            case 'tensao':
                audio.src = "audio/tensao_milhao.mp3";
                audio.loop = true;
                break;
        }

        audio.onended = () => resolve(audio);

        audio.play().then(() => resolve(audio)).catch(error => {
                console.error("CONSOLE | Erro ao reproduzir o áudio | Algo de errado não está certo", error);
                reject(error);
            });
    });
}

let perguntaFinalTimeout; // variavel do timeout da pergunta final
let intervaloTimer; // variavel do timer
let audioTensao = null; // ah, até esqueci, na ultima pergunta tinha uma musica de tensão para se responder a pergunta, aqui está sua variável.

function iniciarPerguntaFinal() { // função de iniciar a pergunta final, com o timer e o audio de tensão com intervalo de 50segs
    let tempoRestante = 50;
    const timerDisplay = document.getElementById("timer");
    timerDisplay.style.display = "block";
    timerDisplay.textContent = tempoRestante;

    if (!audioTensao) {
        audioTensao = new Audio("audio/tensao_milhao.mp3");
        audioTensao.loop = true;
    }


    intervaloTimer = setInterval(() => {
        tempoRestante--;
        timerDisplay.textContent = tempoRestante;

        if (tempoRestante <= 0) {
            clearInterval(intervaloTimer);
            finalizarPerguntaFinal();
        }
    }, 1000);

    perguntaFinalTimeout = setTimeout(() => finalizarPerguntaFinal(), 50000);
}

function finalizarPerguntaFinal() { // ao finalizar a pergunta, ele direciona a dois caminhos, se errou, chama a função reinicia_jogo, que o proprio nome explica o que é
    clearInterval(intervaloTimer); // se acertar, ele desaparece com o timer e a pergunta do milhão
    document.getElementById("timer").style.display = "none";
    document.getElementById("pergunta1000000") .style.display = "none";

    if (audioTensao && !audioTensao.paused) {
        audioTensao.pause();
        audioTensao.currentTime = 0;
    }

    tocar_audio("errou").then(() => reinicia_jogo()).catch(() => reinicia_jogo());
}

function reinicia_jogo() { // função de reiniciar o jogo, após erro ou finalização.
    document.getElementById("comecar").style.display = "block";
    document.getElementById("btn-comecar").innerHTML = "Jogar Novamente";
    document.getElementById("pergunta1000000").style.display = "none";
}

function exibirFimDeJogo() { // exibir fim de jogo para jogar novamente, principalmente quando chegou-se ao fim do jogo, aqui que ficou o bug do timer junto com áudio.
    document.getElementById("fim-jogo-popup").style.display = "flex";
    document.getElementById("btn-jogar-novamente").onclick = function () {
        document.getElementById("timer").style.display = "none";
        document.getElementById("fim-jogo-popup").style.display = "none";
        reinicia_jogo();
    };
}

window.onload = function () { // função de carregar o tratar eventos (as perguntas) e o audio de abertura
    tratar_eventos();
    tocar_audio('abertura');
}



function tratar_eventos() { // botão de coemçar e as perguntas do mil ao milhão.
    document.getElementById("btn-comecar").onclick = function () {
        tocar_audio('comecar');
        document.getElementById("comecar").style.display = "none";
        document.getElementById("pergunta1000").style.display = "block";
    }

    // Analisar se a resposta de R$1.000 está correta
    document.getElementById("form-pergunta1000").onsubmit = function (event) {
        event.preventDefault(); 
        var opcao_correta = "3"; 
        var opcao_selecionada = this.pergunta1000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta1000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-2000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta1000").style.display = "none";
                document.getElementById("pergunta2000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta1000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$2.000 está correta
    document.getElementById("form-pergunta2000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "4";
        var opcao_selecionada = this.pergunta2000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta2000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-3000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta2000").style.display = "none";
                document.getElementById("pergunta3000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta2000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$3.000 está correta
    document.getElementById("form-pergunta3000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "2";
        var opcao_selecionada = this.pergunta3000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta3000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-4000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta3000").style.display = "none";
                document.getElementById("pergunta4000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta3000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$4.000 está correta
    document.getElementById("form-pergunta4000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "4";
        var opcao_selecionada = this.pergunta4000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta4000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-5000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta4000").style.display = "none";
                document.getElementById("pergunta5000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta4000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$5.000 está correta
    document.getElementById("form-pergunta5000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "4";
        var opcao_selecionada = this.pergunta5000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta5000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-10000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta5000").style.display = "none";
                document.getElementById("pergunta10000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta5000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$10.000 está correta
    document.getElementById("form-pergunta10000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "3";
        var opcao_selecionada = this.pergunta10000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta10000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-20000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta10000").style.display = "none";
                document.getElementById("pergunta20000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta10000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$20.000 está correta
    document.getElementById("form-pergunta20000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "3";
        var opcao_selecionada = this.pergunta20000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta20000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-30000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta20000").style.display = "none";
                document.getElementById("pergunta30000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta20000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$30.000 está correta
    document.getElementById("form-pergunta30000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "3";
        var opcao_selecionada = this.pergunta30000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta30000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-40000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta30000").style.display = "none";
                document.getElementById("pergunta40000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta30000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$40.000 está correta
    document.getElementById("form-pergunta40000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "2";
        var opcao_selecionada = this.pergunta40000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta40000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-50000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta40000").style.display = "none";
                document.getElementById("pergunta50000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta40000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$50.000 está correta
    document.getElementById("form-pergunta50000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "2";
        var opcao_selecionada = this.pergunta50000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta50000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-100000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta50000").style.display = "none";
                document.getElementById("pergunta100000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta50000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$100.000 está correta
    document.getElementById("form-pergunta100000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "4";
        var opcao_selecionada = this.pergunta100000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta100000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-200000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta100000").style.display = "none";
                document.getElementById("pergunta200000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta100000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$200.000 está correta
    document.getElementById("form-pergunta200000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "3";
        var opcao_selecionada = this.pergunta200000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta200000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-300000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta200000").style.display = "none";
                document.getElementById("pergunta300000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta200000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$300.000 está correta
    document.getElementById("form-pergunta300000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "1";
        var opcao_selecionada = this.pergunta300000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta300000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-400000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta300000").style.display = "none";
                document.getElementById("pergunta400000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta300000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$400.000 está correta
    document.getElementById("form-pergunta400000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "1";
        var opcao_selecionada = this.pergunta400000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta400000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-500000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta400000").style.display = "none";
                document.getElementById("pergunta500000").style.display = "block";
            }, 2000);

        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta400000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$500.000 está correta
    document.getElementById("form-pergunta500000").onsubmit = function (event) {
        event.preventDefault();
        var opcao_correta = "3";
        var opcao_selecionada = this.pergunta500000.value;

        // Encontrar o input correspondente à opção correta
        var botaoCorreto = this.querySelector(`input[name="pergunta500000"][value="${opcao_correta}"]`);

        if (opcao_selecionada === opcao_correta) {
            tocar_audio('pergunta-1000000');
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto); // Passa o input correto para a função de piscar
            } else {
                console.error("Botão correto não encontrado.");
            }

            setTimeout(() => {
                document.getElementById("pergunta500000").style.display = "none";
                document.getElementById("pergunta1000000").style.display = "block";
            }, 2000);
            const audio = document.getElementById("silvio-santos");
            audio.addEventListener("ended", () => {
                iniciarPerguntaFinal();
            });
        } else {
            tocar_audio("errou");
            if (botaoCorreto) {
                piscarRespostaCorreta(botaoCorreto);
            }


            piscarRespostaIncorreta(botaoCorreto);

            setTimeout(() => {
                document.getElementById("pergunta500000").style.display = "none";
                reinicia_jogo();
            }, 2000);
        }
    }

    // Analisar se a resposta de R$1.000.000 está correta
    // Finalmente... Não aguentava mais dar CTRL C + CTRL V

    document.getElementById("form-pergunta1000000").onsubmit = function (event) {
        event.preventDefault();
    
        iniciarPerguntaFinal();

        var opcao_correta = "1";
        var opcao_selecionada = this.pergunta1000000.value;
        var botaoCorreto = this.querySelector(`input[name="pergunta1000000"][value="${opcao_correta}"]`);
    
        if (opcao_selecionada === opcao_correta) {
            clearTimeout(perguntaFinalTimeout); 
            clearInterval(intervaloTimer); 
            document.getElementById("timer").style.display = "none";
            
            if (audioTensao && !audioTensao.paused) {
                audioTensao.pause();
                audioTensao.currentTime = 0;
            }
    
            tocar_audio('acertou').then(() => tocar_audio('ganhou')).then(() => {
                if (botaoCorreto) piscarRespostaCorreta(botaoCorreto);
                exibirFimDeJogo();
            });
        } else {
            tocar_audio("errou").then(() => reinicia_jogo());
        }
    };

    // Função para fazer o radio input correto piscar
    function piscarRespostaCorreta(botao) {
        const label = botao.parentNode;
        if (label) {
            label.classList.add("correct");
            setTimeout(() => {
                label.classList.remove("correct");
            }, 2000);
        } else {
            console.error("CONSOLE | Label não encontrado. REINICIE O JOGO");
        }
    }

    // Agora ao contrário, ao usuário errar a pergunta:
    // Função para fazer o input incorreto piscar
    function piscarRespostaIncorreta(botao) {
        const label = botao.parentNode;
        if (label) {
            label.classList.add("incorrect"); // incorrect no css
            setTimeout(() => {
                label.classList.remove("incorrect");
            }, 2000);
        } else {
            console.error("Label não encontrado.");
        }
    }
}