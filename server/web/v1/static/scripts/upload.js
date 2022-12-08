#!/usr/bin/node


$(document).ready(function () {
  $("body").css("background-color", "grey");

  $('#upload').on('click', function () {
        
        let form_data = new FormData();
        let ins = document.getElementById('multiFiles').files.length;
        if (ins == 0)
        {
                $('#msg').html('<span style="color:red">Select at least one file</span>');
                return;
        }
        for (let i = 0; i < ins; i++)
        {
                form_data.append("files[]",document.getElementById('multiFiles').files[i]);
                
        }
        form_data.append("house","hello")
        $.ajax({
                url: 'upload',
                data: form_data,
                processData: false,
                contentType: false,
                type:'post',
                success: function (response) {
                        responseFunc(response);
                      },

        });

  });
  $("body").on("click", "#loginbtn", function () {
    console.log("clicked");
    window.location.href = "/web/v1/login";
  });
});



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
    $("#msg").text(response.message);
    $("#msg").css("color", "green");
  } else if (response.status === "fail") {
    $("#msg").text(response.message);
    $("#msg").css("color", "orange");
  }
}
