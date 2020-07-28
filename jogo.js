console.log('Joguinho Flappy Bird')

const sprites = new Image();
sprites.src = './sprites.png'

const canvas =  document.querySelector('canvas')
const context = canvas.getContext('2d');

const som_hit = new Audio();
som_hit.src ='./audio/hit.wav'

let frames = 0;

const telaInicio = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: ((canvas.width/2)-(174/2)),
    y: 50,
    desenha(){
        context.drawImage(
            sprites,
            telaInicio.spriteX,
            telaInicio.spriteY,
            telaInicio.largura,
            telaInicio.altura,
            telaInicio.x,
            telaInicio.y,
            telaInicio.largura,
            telaInicio.altura,
        )
    }
}

function criarFlappyBird(){
    const flappyBird = {
        spriteX:0,
        spriteY:0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        gravidade: 0.25,
        velocidade: 0,
        pulo: 4.6,
        movimento: [
            {spriteX: 0, spriteY: 0},
            {spriteX: 0, spriteY: 26},
            {spriteX: 0, spriteY: 52},
            {spriteX: 0, spriteY: 26},
        ],
        frameAtual: 0,
        atualizacaoFrameAtual(){
            const intervaloFrames = 10;
            const passouIntervalo = frames % intervaloFrames === 0;

            if(passouIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepetição = flappyBird.movimento.length
                flappyBird.frameAtual = incremento % baseRepetição;
            }
    
        },
        desenha(){
            const { spriteX, spriteY } = flappyBird.movimento[flappyBird.frameAtual];
            flappyBird.atualizacaoFrameAtual();
            context.drawImage(
                sprites,
                spriteX,
                spriteY,
                flappyBird.largura,
                flappyBird.altura,
                flappyBird.x,
                flappyBird.y,
                flappyBird.largura,
                flappyBird.altura,
            )
        },
        atualiza(){
            if(fazColisao(flappyBird, globais.base)){
                som_hit.play();
                mudaParaTela(telas.inicio)
                return;
            }
                flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
                flappyBird.y = flappyBird.y + flappyBird.velocidade;
                flappyBird.x = flappyBird.x + 0.5;
        },
        pula(){
            flappyBird.velocidade -= flappyBird.pulo;
        }
    }
    return flappyBird;
}

function fazColisao(flappyBird, base){
    const flappyBirdY =flappyBird.y + flappyBird.altura;
    const baseY = base.y;
    if(flappyBirdY >= baseY) {
        return true
    };
    return false
}

function criarBase() {
    const base = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        desenha(){
            context.drawImage(
                sprites,
                base.spriteX,
                base.spriteY,
                base.largura,
                base.altura,
                base.x,
                base.y,
                base.largura,
                base.altura,
            )
            context.drawImage(
                sprites,
                base.spriteX,
                base.spriteY,
                base.largura,
                base.altura,
                (base.x + base.largura),
                base.y,
                base.largura,
                base.altura,
            )
        },
        atualiza(){
            const velocidadeMovBase = 1;
            const repeteEm = base.largura/2;
            const movimentoBase  = base.x - velocidadeMovBase;
            base.x = movimentoBase % repeteEm;
        }
    }
    return base;
}

function criarCano() {
    const cano = {
        largura: 52,
        altura: 400,
        base: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha(){
            cano.pares.forEach(function(par) {
                const espacamento = 70;
                const yRandom = par.y;
    
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                context.drawImage(
                    sprites,
                    cano.ceu.spriteX,
                    cano.ceu.spriteY,
                    cano.largura,
                    cano.altura,
                    canoCeuX,
                    canoCeuY,
                    cano.largura,
                    cano.altura,
                )
                
                const canoBaseX = par.x;
                const canoBaseY = cano.altura + espacamento + yRandom;
                context.drawImage(
                    sprites,
                    cano.base.spriteX,
                    cano.base.spriteY,
                    cano.largura,
                    cano.altura,
                    canoBaseX,
                    canoBaseY,
                    cano.largura,
                    cano.altura,
                )
                par.canoCeu = {
                    x: canoCeuX,
                    y: cano.altura + canoCeuY
                }
                par.canoBase = {
                    x: canoBaseX,
                    y: canoBaseY
                }
            })
        },
        pares: [],
        atualiza(){
            const passou100Frame = frames % 100 === 0;
            if(passou100Frame){
                cano.pares.push({
                    x: canvas.width,
                    y:-150 * (Math.random() + 1),
                })
            }
            cano.pares.forEach(function(par) {
                par.x = par.x - 2;

                if(cano.temColisaoComOFlappy(par)){
                    mudaParaTela(telas.inicio)
                    return;
                }

                if(par.x + cano.largura <= 0) cano.pares.shift()
            })
        },
        temColisaoComOFlappy(par){
            const cabecaFlappy = globais.flappyBird.y;
            const peFlappy = globais.flappyBird.y + globais.flappyBird.altura
            if(globais.flappyBird.x >= par.x){
                
                if(cabecaFlappy <= par.canoCeu.y){
                    return true
                }
                if(peFlappy >= par.canoBase.y)
                return true
            }
            return false
        }
    }
    return cano;
}

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha(){
        context.fillStyle = '#70c5ce'
        context.fillRect(0,0,canvas.width, canvas.height)

        context.drawImage(
            sprites,
            planoDeFundo.spriteX,
            planoDeFundo.spriteY,
            planoDeFundo.largura,
            planoDeFundo.altura,
            planoDeFundo.x,
            planoDeFundo.y,
            planoDeFundo.largura,
            planoDeFundo.altura,
        )
        context.drawImage(
            sprites,
            planoDeFundo.spriteX,
            planoDeFundo.spriteY,
            planoDeFundo.largura,
            planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura),
            planoDeFundo.y,
            planoDeFundo.largura,
            planoDeFundo.altura,
        )
    }
}


//Telas
const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela){
    telaAtiva = novaTela;
    if(telaAtiva.inicializa){
        telaAtiva.inicializa();
    }
}

const telas = {
    inicio: {
       inicializa() {
            globais.flappyBird = criarFlappyBird();
            globais.base = criarBase();
            globais.cano = criarCano();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.cano.desenha();
            globais.base.desenha();
            globais.flappyBird.desenha()
            telaInicio.desenha();
        },
        click(){
            mudaParaTela(telas.Jogo)
        },
        atualiza(){
            globais.base.atualiza();
            globais.cano.atualiza();
        }
    }
}

telas.Jogo = {
    desenha(){
        planoDeFundo.desenha();
        globais.base.desenha();
        globais.flappyBird.desenha();
        globais.cano.desenha();
    },
    atualiza(){
        globais.flappyBird.atualiza();
        globais.base.atualiza();
        globais.cano.atualiza();
    },
    click(){
        globais.flappyBird.pula();
    }
}

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames = frames + 1;

    requestAnimationFrame(loop)
}

window.addEventListener('click', () => {
    if(telaAtiva.click) telaAtiva.click()
})

mudaParaTela(telas.inicio);

loop();
