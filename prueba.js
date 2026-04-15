$(document).ready(function () {
  async function getJSON(url) {
    let datos = {};
    await $.getJSON(url, function (data) {
      datos = data;
    });
    return datos;
  }

  /*
  "success": true,
  "deck_id": "lyujoht3n7b6",
  "remaining": 52,
  "shuffled": true
  */

  $("#btn-crear").click(async function () {
    let cartas = await getJSON(
      "https://deckofcardsapi.com/api/deck/new/draw/?count=52",
    );
    baraja = cartas.cards;
    if (baraja[0] != undefined) {
      $(this).css("background-color", "green");
    }
  });

  $("#btn-sacar").click(function () {
    let carta = $("<div>").addClass("carta");
    carta.append(
      $("<img>").addClass("imagen-carta").attr("src", baraja[0].image),
    );
    $("#tapete").append(carta);
    baraja.shift();
  });

  $("#tapete").on("dblclick", ".carta", function () {
    $(this).animate({ width: 0 }, "fast", function () {
      $(this)
        .find(".imagen-carta")
        .attr("src", "https://deckofcardsapi.com/static/img/back.png");
    });

    $(this).animate({ width: "8.66rem" }, "fast");
  });

  let datosBaraja = {};
  let baraja = [];
});
