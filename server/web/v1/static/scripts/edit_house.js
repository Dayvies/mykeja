#!/usr/bin/node
let house_id = "None";
let newImgs = [];
let deleteids = [];
let tempIds = [];
let deleteItems = [];
let count = 0;
let intRegex = /^\d+$/;
let floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;

$(document).ready(function () {
  $("body").css("background-color", "grey");
  document.getElementById("multiFiles").value = null;
  house_id = $("#identifier").attr("data-id");
  console.log("house_id",house_id);
  $("body").on("click", ".del", function () {
    let div = $(this).parent();
    let divId = div.attr("id");
    if (!isNaN(divId)) {
      divId = parseInt(divId);
      tempIds.push(divId);
      console.log(tempIds);
    } else {
      deleteids.push(divId);
      console.log(deleteids);
    }
    deleteItems.push(div);
    div.hide();
  });
  $("#reset").click(function () {
    deleteItems.forEach((element) => {
      if (element.attr("id").length >= 4) element.show();
    });
    newImgs.forEach((element) => {
      element.hide();
    });
    deleteids = [];
    deleteItems = [];
    tempIds = [];
    newImgs = [];
    document.getElementById("multiFiles").value = null;
    count = 0;
  });

  $("#name").on("input", function () {
    validateName();
  });
  $("#description").on("input", function () {
    validateDescription();
  });
  $("#price").on("input", function () {
    validatePrice();
  });
  $("#number_rooms").on("input", function () {
    validaterooms($("#number_rooms"));
  });
  $("#number_bathrooms").on("input", function () {
    validaterooms($("#number_bathrooms"));
  });
  $("#submitbtn").click(function (e) {
    e.preventDefault();
    let nameError = validateName();
    let priceError = validatePrice();
    let descriptionError = validateDescription();
    let roomError = validaterooms($("#number_rooms"));
    let broomError = validaterooms($("#number_bathrooms"));
    if (
      nameError == true &&
      priceError == true &&
      descriptionError == true &&
      roomError == true &&
      broomError == true
    ) {
      let $form = $("#houseform");
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
  $("#multiFiles").change(function (e) {
    for (let i = count; i < e.originalEvent.srcElement.files.length; i++) {
      console.log("starting");
      let file = e.originalEvent.srcElement.files[i];
      let divimg = document.createElement("div");
      $(divimg).attr("id", count);
      let reader = new FileReader();
      reader.onloadend = function () {
        $(divimg).addClass("column")
          .html(`<img  alt="house image" src=${reader.result} class="image">   
            <img src="/static/images/x-mark.png" id="why" alt="delete"  class="del">`);
        $(".row").append(divimg);
        newImgs.push($(divimg));
      };
      reader.readAsDataURL(file);
      count++;
    }
  });
  $("#upload").on("click", function () {
    let message = "Do you want to save? This cannot be undone";
    if (confirm(message)) {
      if (house_id === "None") {
        $("#msg").html('<span style="color:red">Error registering</span>');
      }
      let form_data = new FormData();
      let ins = document.getElementById("multiFiles").files.length;
      if (ins == 0 && deleteids.length < 1) {
        $("#msg").html(
          '<span style="color:red">Select at least one file</span>'
        );
        return;
      }
      for (let i = 0; i < ins; i++) {
        if (!tempIds.includes(i)) {
          form_data.append(
            "files[]",
            document.getElementById("multiFiles").files[i]
          );
        }
      }
      form_data.append("house", house_id);
      form_data.append("deleteids", deleteids);
      $("#image_upload h2").text(
        "Uploading ... \n Can take a few minutes depending on image size"
      );
      $("#upload").hide();
      $.ajax({
        url: "/web/v1/upload/",
        data: form_data,
        processData: false,
        contentType: false,
        type: "post",
        success: function (response) {
          $("#image_upload h2").text("Done :)");
          $("#upload").show();
          responseFunc2(response);
        },
      });
    } else {
      $("#msg").text("Not Saved");
    }
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
function validateDescription() {
  let nameVal = $("#description").val();
  if ((nameVal.length = "" || nameVal.length < 20)) {
    nameError = false;
    $("#description").css("color", "red");
    $("#description").css("border-color", "red");
    return false;
  } else {
    $("#description").css("color", "green");
    $("#description").css("border-color", "teal");
    return true;
  }
}
function validatePrice() {
  let price = $("#price").val();
  if (intRegex.test(price)) {
    $("#price").css("color", "green");
    $("#price").css("border-color", "teal");
    return true;
  } else {
    $("#price").css("color", "red");
    $("#price").css("border-color", "red");
    return;
  }
}
function validaterooms(room) {
  let price = room.val();
  if (intRegex.test(price)) {
    room.css("color", "green");
    room.css("border-color", "teal");
    return true;
  } else {
    room.css("color", "red");
    room.css("border-color", "red");
    return;
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
  $.ajax({
    type: "POST",
    url: "/web/v1/edit/"+house_id,
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
    house_id = response.house_id;
  } else if (response.status === "fail") {
    $("#message").text(response.message);
    $("#message").css("color", "orange");
  }
}
function responseFunc2(response) {
  if (response.status === "OK") {
    $("#msg").text(response.message);
    $("#msg").css("color", "green");
    document.getElementById("multiFiles").value = null;
  } else if (response.status === "fail") {
    $("#msg").text(response.message);
    $("#msg").css("color", "orange");
  }
}
