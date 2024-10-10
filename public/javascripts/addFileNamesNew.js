document.addEventListener("DOMContentLoaded", function() {
    var images= document.getElementById("image");
    
    images.addEventListener("change", function(event) {
        previewMultiple(event); 
    });
});


function previewMultiple(event) {
    var images = document.getElementById("image");
    var number = images.files.length;
    var container = document.getElementById("formFile");
    container.innerHTML = '';
    for (i = 0; i < number; i++) {
        var file = event.target.files[i];
        var urls = URL.createObjectURL(file);
        var filename = file.name;

        if (filename.length > 20) {

            var filenameShort = filename.substring(0, 12);

            document.getElementById("formFile").innerHTML += '<div style="margin:10px;"><img src="' + urls + '"><p>' + filenameShort + '...</p></div>';
        }
        else {
            document.getElementById("formFile").innerHTML += '<div style="margin:10px;"><img src="' + urls + '"><p>' + filename + '</p></div>';
        }

    }
    container.classList.add("text-center");
}