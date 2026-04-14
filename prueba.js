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
  });

  $("#btn-sacar").click(function () {
    $("#tapete").append(
      $("<img>").addClass("carta").attr("src", baraja[0].image),
    );
    baraja.shift();
  });

  let datosBaraja = {};
  let baraja = [];
});
