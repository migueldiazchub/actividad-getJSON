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
  //   "suit": "DIAMONDS"
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

  //evento para crear una baraja aleatorizada y colocar todas sus cartas en la zona de baraja
  $("#btn-crear-baraja").click(async function () {
    let barajaJSON = await getJSON(
      "https://deckofcardsapi.com/api/deck/new/shuffle/",
    );

    let urlCartas =
      "https://deckofcardsapi.com/api/deck/placeholder/draw/?count=52";
    urlCartas.replace("placeholder", barajaJSON.deck_id);
    let cartas = await getJSON(urlCartas);
    baraja = cartas.cards;
    let zindex = 200;

    for (let carta of baraja) {
      carta.view = false;
      carta.zindex = zindex++;

      let marcoCarta = $("<div>")
        .addClass("carta-baraja")
        .attr("id", carta.code);

      marcoCarta.append(
        $("<img>")
          .addClass("imagen-carta")
          .attr("src", "https://deckofcardsapi.com/static/img/back.png"),
      );

      $("#baraja").append(marcoCarta);
    }

    //$("#btn-sacar-carta").show();

    if (baraja[0] != undefined) {
      $(this).css("background-color", "green");
    }
  });
});
