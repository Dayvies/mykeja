#!/usr/bin/node
$(document).ready(function () {
  $(".signin").on("click", function () {
    window.location.href = "/web/v1/login";
  });
  $(".information").on("click", function () {
        let id = $(this).parent().attr('id');
        console.log("tried");
        window.location.href = `/web/v1/home/${id}`;
      });
  $(".icons").on("click", function () {
    console.log("hey");
    $(".nav").toggle();
  });

  $(document).mouseup(function (e) {
    var container = $(".nav");
    var container2 = $(".icons");

    // if the target of the click isn't the container nor a descendant of the container
    if (
      !container.is(e.target) &&
      container.has(e.target).length === 0 &&
      !container2.is(e.target) &&
      container2.has(e.target).length === 0
    ) {
      container.hide();
      console.log(container2);
      console.log(e.target);
    }
  });
  $(".price").each(function () {
    let price = $(this).text();
    $(this).text(formatter.format(price));
  });
  $(".next").each(function () {
    let currentImg = $(this).siblings("div").find("img").first();
    currentImg.addClass("active").css("z-index", 10);
    console.log("active added");
  });
  $(".next").on("click", function () {
    console.log("clicked");
    let currentImg = $(this).siblings("div").find(".active");
    let nextImg = currentImg.next();
    if (nextImg.length) {
      currentImg.removeClass("active").css("z-index", -10);
      nextImg.addClass("active").css("z-index", 10);
    } else {
      currentImg.removeClass("active").css("z-index", -10);
      currentImg.siblings("img").first().addClass("active").css("z-index", 10);
    }
  });

  $(".prev").on("click", function () {
    let currentImg = $(this).siblings("div").find(".active");
    let prevImg = currentImg.prev();
    if (prevImg.length) {
      currentImg.removeClass("active").css("z-index", -10);
      prevImg.addClass("active").css("z-index", 10);
    } else {
      currentImg.removeClass("active").css("z-index", -10);
      currentImg.siblings("img").last().addClass("active").css("z-index", 10);
    }
  });
});
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "KES",
});
