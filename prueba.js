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

  //parte trasera carta
  //"https://deckofcardsapi.com/static/img/back.png"

  $("#btn-crear").click(async function () {
    let cartas = await getJSON(
      "https://deckofcardsapi.com/api/deck/new/draw/?count=52",
    );
    baraja = cartas.cards;
    for (let carta of baraja) {
      carta.view = false;
      let marcoCarta = $("<div>")
        .addClass("carta-baraja")
        .attr("id", carta.code);
      marcoCarta.append(
        $("<img>")
          .addClass("imagen-carta")
          .attr("src", "https://deckofcardsapi.com/static/img/back.png"),
      );
      $("#zona-baraja").append(marcoCarta);
    }

    $("#btn-sacar").show();

    if (baraja[0] != undefined) {
      $(this).css("background-color", "green");
    }
  });

  let posicionBaraja = 51;

  $("#btn-sacar").click(function () {
    let idCarta = "#" + baraja[posicionBaraja--].code;
    $(idCarta)
      .removeClass("carta-baraja")
      .addClass("carta")
      .appendTo("#tapete");

    $("#draggable").remove();

    $("head").append(
      $("<script>")
        .attr("id", "draggable")
        .html(
          $(function () {
            $(".carta").draggable();
          }),
        ),
    );
  });

  $("#zona-baraja").mouseup(function () {
    let idCarta = "#" + baraja[posicionBaraja--].code;
    $(idCarta)
      .removeClass("carta-baraja")
      .addClass("carta")
      .appendTo("#tapete");

    $("#draggable").remove();

    $("head").append(
      $("<script>")
        .attr("id", "draggable")
        .html(
          $(function () {
            $(".carta").draggable();
          }),
        ),
    );
  });

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
        },
      );

    $(this).find(".imagen-carta").animate(
      {
        height: "100%",
        width: "100%",
        left: 0,
        bottom: 0,
      },
      80,
    );
  });

  let baraja = [];

  function getCarta(id) {
    for (let carta of baraja) {
      if (id == carta.code) {
        return carta;
      }
    }
  }
});
