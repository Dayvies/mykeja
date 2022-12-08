#!/usr/bin/node

let emailError = true;

$(document).ready(function () {
  $("body").css("background-color", "grey");
  $("h1").text("My Keja not on Fire!!");

  $("#email").keyup(function () {
    validateEmail();
  });
  $("#submitbtn").click(function (e) {
    e.preventDefault();
    emailError = validateEmail();
    if (emailError == true) {
      let $form = $("form");
      let data = getFormData($form);
      console.log("prepare for data");
      console.log(data);
      register(data);
    } else {
      let response = { status: "fail", message: "check red fields" };
      responseFunc(response);
      console.log("false");
      return false;
    }
  });
  $("body").on("click", "#loginbtn", function () {
    console.log("clicked");
    window.location.href = "/web/v1/login";
  });
});

function validateEmail() {
  const email = document.getElementById("email");

  let regex = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
  let s = email.value;
  if (regex.test(s)) {
    $("#email").css("color", "green");
    $("#email").css("border-color", "teal");
    return true;
  } else {
    $("#email").css("color", "red");
    $("#email").css("border-color", "red");
    return false;
  }
}

function getFormData($form) {
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function (n, i) {
    indexed_array[n["name"]] = n["value"];
  });

  return indexed_array;
}
function register(data) {
  const data2 = JSON.stringify(data);
  console.log(data2);
  $.ajax({
    type: "POST",
    url: "/web/v1/login",
    contentType: "application/json",
    data: data2,
    success: function (response) {
      responseFunc(response);
    },
  });
}
function responseFunc(response) {
  if (response.status === "OK") {
    $("#message").text(response.message);
    $("#message").css("color", "green");
    $("#loginform")[0].reset();
    window.location.href = "/web/v1/home";
  } else if (response.status === "fail") {
    $("#message").text(response.message);
    $("#message").css("color", "orange");
    $("#loginform")[0].reset();
  }
}
