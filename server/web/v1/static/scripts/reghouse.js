#!/usr/bin/node
let count = 0;
let tempIds = [];
let newImgs = [];
let house_id = "None";
let intRegex = /^\d+$/;
let floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;
$(document).ready(function () {
  //$("#image_upload").hide();
  $("body").css("background-color", "grey");

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
        div.hide();
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
          console.log(document.getElementById("multiFiles").files)
        }
      });
  $("#upload").on("click", function () {
    if (house_id === "None") {
      $("#msg").html('<span style="color:red">Error registering</span>');
    }
    let form_data = new FormData();
    let ins = document.getElementById("multiFiles").files.length;
    if (ins == 0) {
      $("#msg").html('<span style="color:red">Select at least one file</span>');
      return;
    }
    for (let i = 0; i < ins; i++) {
      form_data.append(
        "files[]",
        document.getElementById("multiFiles").files[i]
      );
    }
    form_data.append("house", house_id);
    $("#image_upload h2").text(
      "Uploading ... \n Can take a few minutes depending on image size"
    );
    $("#upload").hide()
    $.ajax({
      url: "upload",
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
    url: "/web/v1/reghouse",
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
    $("#image_upload").show();
    $("#reghouse").hide();
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
