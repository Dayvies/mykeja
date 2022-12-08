#!/usr/bin/node
let nameError = true;
let emailError = true;
let passError = true;
let cpassError = true;
$(document).ready(function () {
  $("body").css("background-color", "grey");
  $("h1").text("My Keja not on Fire!!");
  $("#name").keyup(function () {
    validateName();
  });
  $("#email").keyup(function () {
    validateEmail();
  });
  $("#password").keyup(function () {
    validatePass();
  });
  $("#cpassword").keyup(function () {
    validatecPass();
  });
  $("#submitbtn").click(function (e) {
    e.preventDefault();
    nameError = validateName();
    passError = validatePass();
    cpassError = validatecPass();
    emailError = validateEmail();
    if (
      nameError == true &&
      passError == true &&
      cpassError == true &&
      emailError == true
    ) {
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
  $("body").on("click","#loginbtn",function () {
        window.location.href = '/web/v1/login'
      });
});


function validateName() {
  let nameVal = $("#name").val();
  if ((nameVal.length = "" || nameVal.length < 4)) {
    nameError = false;
    $("#name").css("color", "red");
    $("#name").css("border-color", "red");
    return false;
  } else {
    $("#name").css("color", "green");
    $("#name").css("border-color", "teal");
    return true;
  }
}
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
function validatePass() {
  let passVal = $("#password").val();
  if (passVal.length == "" || passVal.length < 5 || passVal.length > 40) {
    $("#password").css("color", "red");
    $("#password").css("border-color", "red");
    return false;
  } else {
    $("#password").css("color", "green");
    $("#password").css("border-color", "teal");
    return true;
  }
}
function validatecPass() {
  let passVal = $("#password").val();
  let cpassVal = $("#cpassword").val();
  if (cpassVal.length == "" || cpassVal != passVal) {
    $("#cpassword").css("color", "red");
    $("#cpassword").css("border-color", "red");
    return false;
  } else {
    $("#cpassword").css("color", "green");
    $("#cpassword").css("border-color", "teal");
    return true;
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
    url: "/web/v1/signup",
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
    $("#signupform")[0].reset();
    const body = $("body");
    const loginbtn = $("<button>", { id: "loginbtn", type: "button" });
    loginbtn.text("Login");
    body.append(loginbtn);
  } else if (response.status === "fail") {
    $("#message").text(response.message);
    $("#message").css("color", "orange");
    $("#signupform")[0].reset();
  }
}
