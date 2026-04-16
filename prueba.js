$(document).ready(function () {
  async function getJSON(url) {
    let datos = {};
    await $.getJSON(url, function (data) {
      datos = data;
    });
    return datos;
  }

  //objeto que contendrá el JSON de la baraja. Formato:
  // {
  //  "success": true,
  //  "deck_id": "infdwvf2bo8h",
  //  "remaining": 52,
  //  "shuffled": false
  //  }
  let barajaJSON = {};

  //array que contendrá las cartas barajadas. Formato de carta:
  // {
  //   "code": "9D",
  //   "image": "https://deckofcardsapi.com/static/img/9D.png",
  //   "images": {
  //     "svg": "https://deckofcardsapi.com/static/img/9D.svg",
  //     "png": "https://deckofcardsapi.com/static/img/9D.png"
  //   },
  //   "value": "9",
  //   "suit": "DIAMONDS",
  //
  //   //los siguientes atributos se añaden al crear una baraja
  //   "view": false,
  //   "zindex": 200
  // }
  let baraja = [];

  //posición en el array de la primera carta sin sacar de la baraja
  let posicionBaraja = 51;

  /**
   * recibe el id del elemento html y devuelve el objeto de carta correspondiente
   * @param {string} id
   * @returns {Object}
   */
  function getCarta(id) {
    for (let carta of baraja) {
      if (id == carta.code) {
        return carta;
      }
    }
  }

  $("#btn-abrir").click(function () {
    $("#zona-juego").slideDown(1200);
  });

  $("#btn-crear").click(async function () {
    let barajaJSON = await getJSON(
      "https://deckofcardsapi.com/api/deck/new/shuffle/",
    );

    let urlCartas = "https://deckofcardsapi.com/api/deck/new/draw/?count=52";
    urlCartas.replace("new", barajaJSON.deck_id);
    let cartas = await getJSON(urlCartas);
    baraja = cartas.cards;
    let zindex = 1051;

    for (let carta of baraja) {
      carta.view = false;
      carta.zindex = zindex--;
      let marcoCarta = $("<div>")
        .addClass("carta-baraja")
        .attr("id", carta.code);

      if (baraja.indexOf(carta) == 51) {
        marcoCarta.addClass("carta-arriba");
      }

      marcoCarta.append(
        $("<img>")
          .addClass("imagen-carta")
          .attr("src", "https://deckofcardsapi.com/static/img/back.png"),
      );
      $("#baraja").append(marcoCarta);
    }

    $("#btn-sacar").show();

    if (baraja[0] != undefined) {
      $(this).css("background-color", "green");
    }

    await setTimeout(
      1000,
      $("#zona-juego").slideDown(1200).css("display", "flex"),
    );
  });

  //función para mover una carta de la zona de baraja al tapete
  function sacarCarta() {
    let carta = baraja[posicionBaraja--];
    let idCarta = "#" + carta.code;
    $(idCarta)
      .removeClass("carta-baraja")
      .removeClass("carta-arriba")
      .addClass("carta")
      .css("z-index", carta.zindex)
      .appendTo("#tapete");

    let cartaArriba = baraja[posicionBaraja];
    let idCartaArriba = "#" + cartaArriba.code;
    $(idCartaArriba).addClass("carta-arriba");

    $("#draggable").remove();

    $("head").append(
      $("<script>")
        .attr("id", "draggable")
        .html(
          $(function () {
            $(".carta").draggable({
              containment: "#tapete",
              start: function () {
                for (let carta of baraja) {
                  let idCarta = "#" + carta.code;
                  if ($(idCarta).hasClass("carta-baraja") == false) {
                    carta.zindex--;
                    if (carta.zindex < 0) {
                      carta.zindex = 0;
                    }
                    $(idCarta).css("z-index", carta.zindex);
                  }
                }
                let carta = getCarta($(this).attr("id"));
                carta.zindex = 1051;
                $(this).css("z-index", carta.zindex);
              },
            });
          }),
        ),
    );
  }

  //eventos para sacar carta, con botón o clickando en la baraja
  $("#btn-sacar").click(function () {
    sacarCarta();
  });

  $("#baraja").mouseup(function () {
    sacarCarta();
  });

  //evento para dar vuelta a una carta
  $("#tapete").on("dblclick", ".carta", function () {
    let carta = getCarta($(this).attr("id"));

    $(this)
      .find(".imagen-carta")
      .animate(
        {
          height: "110%",
          width: 0,
          left: "50%",
          bottom: "5%",
        },
        80,
        function () {
          if (carta.view) {
            carta.view = false;
            $(this).attr(
              "src",
              "https://deckofcardsapi.com/static/img/back.png",
            );
          } else {
            carta.view = true;
            $(this).attr("src", carta.image);
          }

          $(this).on("load", function () {
            $(this).animate(
              {
                height: "100%",
                width: "100%",
                left: 0,
                bottom: 0,
              },
              80,
            );
          });
        },
      );
  });
});
