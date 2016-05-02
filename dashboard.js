$(document).ready(function() {  
    // var header = document.getElementById("dancer_header");
    // header.style.visibility='hidden';

    document.getElementById("waveform_button").onclick = function () {
        location.href = document.location.href.replace("dashboard", "index");
    };

    $("#form_part1").submit(function(e){
        var projectTitle = document.forms["form_part1"]["projectTitle"].value;
        var numDancers = document.forms["form_part1"]["numDancers"].value;
        var file = document.forms["form_part1"]["music"].value;
        var filename = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '');

        var div = document.createElement('div');
        div.className = "pin ui-state-default"
        var button = document.createElement("button");
        button.classname = "project_button";
        var p = document.createElement("p");
        p.appendChild(document.createTextNode(projectTitle));
        p.appendChild(document.createElement('br'))
        p.appendChild(document.createTextNode(filename));
        p.appendChild(document.createElement('br'))
        p.appendChild(document.createTextNode(numDancers + " dancers"));
        div.appendChild(button);
        div.appendChild(p);

        var first = document.getElementById("first");
        document.getElementById("columns").insertBefore(div, first);
        $("#new_project_modal").modal('hide');
        return false;
    });


    $("#numDancers").change(function(e){
        var value = $("#numDancers").val();
        $(".new_dancer").remove();
        addDancerInfo(value);
        console.log(value);
    })

    $( ".sortable" ).sortable({
        revert: true
    });
    $( ".sortable" ).disableSelection();

    function addDancerInfo(numDancers){
      for(i = 0; i< numDancers; i++){

        var container = document.createElement('div');
        container.className = "new_dancer"
        var name = document.createElement("fieldset");
        var name_label = document.createElement("label");
        name_label.innerHTML = "Dancer Name (" + (i+1) + ")";
        var name_input = document.createElement("input");
        name_input.type = "text";
        name_input.className = "form-control name input";
        name_input.name = "dancer" + i;
        name_input.placeholder = "First, Last";
        name.appendChild(name_label);
        name.appendChild(name_input);
        container.appendChild(name);

        var info = document.createElement("fieldset");
        var info_label = document.createElement("label");
        info_label.innerHTML = "Dancer Notes";
        var info_text = document.createElement("textarea");
        info_text.className = "form-control input";
        info_text.name = "dancer_info" + i;
        info_text.rows = 3;
        info.appendChild(info_label);
        info.appendChild(info_text);
        container.appendChild(info);


        var submit = document.getElementById("submit_button");
        document.getElementById("form_part1").insertBefore(container, submit);
        console.log("success");
      }
      $("input").prop('required',true);

    };   
});