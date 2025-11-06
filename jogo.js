$().ready(function () {
    var canvas = $("#quadro")[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    var contplayer = 0;
    var inimigos = [];
    var contColuna = 0;
    var contLinha = 0;
    var corbarra;
    var tiro = false;

    var projetil = {
        "vx": 0,
        "vy": -10,
        "x": 10000,
        "y": 0,
        "l": 10,
        "a": 20,
        "cor": "white",
        atualiza: function () {
            this.y += this.vy;
        },
        desenharObjeto: function () {
            ctx.fillStyle = this.cor;
            ctx.fillRect(this.x, this.y, this.l, this.a);
        }

    }



    var player1 = {
        "vx": 0,
        "vy": 0,
        "x": canvas.width / 2 - 80,
        "y": canvas.height - 30,
        "l": 80,
        "a": 30,
        "cl": 10,
        "ca": 10,
        "cor": "blue",
        atualiza: function () {
            this.x += this.vx;

        },
        desenharObjeto: function () {
            ctx.fillStyle = this.cor;
            ctx.fillRect(this.x, this.y, this.l, this.a);
            ctx.fillStyle = "#00FFFF";
            ctx.fillRect(this.x + this.l / 2 - 2, this.y - this.ca, this.cl, this.ca);
        }
    }


    function criainimigo(tempx, tempy, cor) {
        return {
            "x": tempx,
            "y": tempy,
            "l": 90,
            "a": 40,
            "vx": 3,
            "cor": cor,
            desenharObjeto: function () {
                ctx.fillStyle = this.cor;
                ctx.fillRect(this.x, this.y, this.l, this.a);
            }
        }
    };
    function insereinimigo() {
        for (contLinha = 0; contLinha < 5; contLinha++) {
            for (contColuna = 3; contColuna < 15; contColuna++) {
                if (contLinha == 0) {
                    corbarra = "red";
                } else if (contLinha == 1) {
                    corbarra = "blue";
                } else if (contLinha == 2) {
                    corbarra = "green";
                } else if (contLinha == 3) {
                    corbarra = "orange";
                }
                inimigos.push(criainimigo(100 * contColuna, contLinha * 50, corbarra));

            }
        }
    }
    insereinimigo();

    function reinicia() {
        inimigos = [];
        insereinimigo();
        player1.x = canvas.width / 2 - 80;
        player1.y = canvas.height - 30;
        projetil.x = 10000;
        contplayer = 0;
    }

    function detectaColisao(o1, o2) {
        var top1 = o1.y;
        var top2 = o2.y;
        var esq1 = o1.x;
        var esq2 = o2.x;
        var dir1 = o1.x + o1.l;
        var dir2 = o2.x + o2.l;
        var base1 = o1.y + o1.a;
        var base2 = o2.y + o2.a;
        return (base1 > top2 && dir1 > esq2 && base2 > top1 && dir2 > esq1);
    }


    function desenharTela() {
        apagarTela();
        player1.atualiza();
        detectaLimitePlayer(player1);
        detectaLimiteObj(projetil);

        for (let contLinha = inimigos.length - 1; contLinha >= 0; contLinha--) {
            if (detectaColisao(inimigos[contLinha], projetil)) {
                inimigos.splice(contLinha, 1);
                projetil.x = 10000;
                contplayer++;
                console.log(contplayer);
                tiro = false;
                continue;
            }

            if (inimigos[contLinha].x + inimigos[contLinha].l > canvas.width) {
                for (let contColuna = 0; contColuna < inimigos.length; contColuna++) {
                    inimigos[contColuna].y += 50;
                    inimigos[contColuna].vx = -inimigos[contColuna].vx;
                    inimigos[contColuna].x -= 5; // Ajusta todos os inimigos
                }
            } else if (inimigos[contLinha].x < 0) {
                for (let contColuna = 0; contColuna < inimigos.length; contColuna++) {
                    inimigos[contColuna].y += 50;
                    inimigos[contColuna].vx = -inimigos[contColuna].vx;
                    inimigos[contColuna].x += 5;
                }
            } else if (inimigos[contLinha].y + inimigos[contLinha].a >= player1.y) {
                alert("Você perdeu!");
                reinicia();
            }

        }

        for (let contLinha = inimigos.length - 1; contLinha >= 0; contLinha--) {

            inimigos[contLinha].x += inimigos[contLinha].vx;

            inimigos[contLinha].desenharObjeto();
        }


        if (contplayer == 60) {
            alert("Você ganhou um bis e uma coxinha! Consulte o ADM");
            reinicia();
        }

        if (tiro === true) {
            projetil.desenharObjeto();
            projetil.atualiza();
        }

        player1.desenharObjeto();
        requestAnimationFrame(desenharTela);
    }

    function apagarTela() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    function detectaLimitePlayer(obj) {
        if (obj.x < 0) {
            obj.x = 0;
            obj.vx = 0;
        }
        if (obj.x + obj.l > canvas.width) {
            obj.x = canvas.width - obj.l;
            obj.vx = 0;
        }
    }
    function detectaLimiteObj(obj) {
        if (obj.y - obj.a < 0) {
            tiro = false;
            projetil.x = 100000;
        }

    }

    desenharTela();
    $(window).keydown(function (event) {
        if (event.which == 37) { //cima
            player1.vx = -8;
        }
        if (event.which == 39) { //baixo
            player1.vx = 8;

        }
        if (event.which == 32) {
            if (tiro === false) {
                tiro = true;
                projetil.x = player1.x + player1.l / 2 - 2
                projetil.y = player1.y - player1.ca - 2;
                console.log("tiro");
            }
        }





    });

});






//A =  65, W = 87, S = 83, D = 68, espaço = 32;