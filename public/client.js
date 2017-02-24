//step one: define functions and objects
function editButton() {
    $(".edit").on("click", "span", function() {
        $(".cross").toggle();
    });
}


function getInput() {
    var custInput = $(".custinput");
    var input = custInput.val();

    if ((input !== "") && ($.trim(input) !== "")) {
        addItem(input);
        custInput.val("");
    }
}

function displayResults(inputData) {
    console.log(inputData.matches);
    //create an empty variable to store one LI for each one the results
    var buildTheHtmlOutput = "";
    for (var i = 0; i < inputData.matches.length; i++) {
        buildTheHtmlOutput += "<li>";
        buildTheHtmlOutput += "<div class='image-wrapper'><img src=" + inputData.matches[i].smallImageUrls + "></div>";
        buildTheHtmlOutput += "<div class='text-wrapper'><h2>" + inputData.matches[i].recipeName + "</h2>";
        buildTheHtmlOutput += "<p><span class='recipe-score'>" + inputData.matches[i].ingredients + "</span>";
        buildTheHtmlOutput += "<span class='recipe-publisher'>" + inputData.matches[i].cuisine + "</span></p>";
        // buildTheHtmlOutput += "<p class='recipe-description'>" + inputData.matches[i].short_description + "</p></div>";

        buildTheHtmlOutput += "</li>";
    }
    $(".rate form ul").html(buildTheHtmlOutput);
}

function displayRecipeResults(result) {

    console.log(result);

    //create an empty variable to store one LI for each one the results
    var buildTheHtmlOutput = "";
    for (var i = 0; i < result.length; i++) {
        buildTheHtmlOutput += "<li>";
        buildTheHtmlOutput += "<h3>";
        buildTheHtmlOutput += result[i].name;
        buildTheHtmlOutput += "<input type='hidden' class='delete-recipe-id' value='" + result[i]._id + "'/>";
        buildTheHtmlOutput += "<button class='delete-recipe-name'> x </button>";
        buildTheHtmlOutput += "</h3>";
        buildTheHtmlOutput += "</li>";
    }
    $(".recipe-output ul").html(buildTheHtmlOutput);
}


function addItem(message) {

    $(".cross").hide();

    var checkbox = "<td class=\"check\">" + "<input type=\"checkbox\" id=\"item" + id + "\" class=\"box\">" + "<label for=\"item" + id + "\" class=\"check-label\"></label></td>";

    var content = "<td class=\"content\"><span>" + message + "</span></td>";

    var delIcon = "<td><img src=\"img/cross.png\" alt=\"cross\" class=\"cross\"></td>";

    $("tbody").append("<tr>" + checkbox + content + delIcon + "</tr>");

    id++;
}
//step two: use functions 
$(document).ready(function(e) {

    //port new recipe item to the DB
    $("#add-recipe").submit(function(e) {
        e.preventDefault();
        var userInput = $("#recipe-input").val();

        var q_string = {
            'name': userInput
        };

        //send new item
        $.ajax({
                type: "POST",
                url: "/recipe/" + userInput,
                // data: q_string,
                dataType: 'json'
            })
            .done(function(result) {
                //console.log(result);
                //   displayResults(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });

        //get all items
        $.ajax({
                type: "GET",
                url: "/recipe",
                dataType: 'json'
            })
            .done(function(result) {
                // console.log(result);
                displayRecipeResults(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });

    });

    $("#s-f").submit(function(e) {
        e.preventDefault();
        var userInput = $("#recipe-search").val();
        //console.log(userInput);
        $.ajax({
                type: "GET",
                url: "/search/" + userInput,
                dataType: 'json'
            })
            .done(function(result) {
                console.log(result);
                displayResults(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
        console.log(userInput);

    });


    //delete item  
    $('.recipe-output').on('click', '.delete-recipe-name', function(event) {

        var userInput = $(this).closest('li').find('.delete-recipe-id').val();
        console.log(userInput);
        $.ajax({
                type: "DELETE",
                url: "/recipe/" + userInput,
                dataType: 'json'
            })
            .done(function(result) {
                console.log(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });

        //get all items
        $.ajax({
                type: "GET",
                url: "/recipe",
                dataType: 'json'
            })
            .done(function(result) { //this waits for the ajax to return with a succesful promise object
                displayRecipeResults(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    });


    var id = 1;
    editButton();

    $("tbody").on("click", ".cross", function() {
        $(this).closest("tr").remove();
    });

    $("button").on("click", getInput);

    $("tbody").on("click", ".box", function() {
        $(this).closest("tr").find("span").toggleClass("checked");
    });

});


$(document).on("keydown", function(e) {
    if (e.keyCode === 13) {
        getInput();
    }
});
