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
      $("#zona-baraja").append(marcoCarta);
    }

    $("#btn-sacar").show();

    if (baraja[0] != undefined) {
      $(this).css("background-color", "green");
    }
  });

  //función para sacar la primera carta de la baraja y contador
  //para sacar las siguientes
  let posicionBaraja = 51;

  function sacarCarta() {
    let carta = baraja[posicionBaraja--];
    let idCarta = "#" + carta.code;
    $(idCarta)
      .removeClass("carta-baraja")
      .addClass("carta")
      .css("z-index", carta.zindex)
      .appendTo("#tapete");

    $("#draggable").remove();

    $("head").append(
      $("<script>")
        .attr("id", "draggable")
        .html(
          $(function () {
            $(".carta").draggable({
              start: function () {
                for (let carta of baraja) {
                  let idCarta = "#" + carta.code;
                  carta.zindex--;
                  if (carta.zindex < 0) {
                    carta.zindex = 0;
                  }
                  $(idCarta).css("z-index", carta.zindex);
                }
                let carta = getCarta($(this).attr("id"));
                carta.zindex = 251;
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

  $("#zona-baraja").mouseup(function () {
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
