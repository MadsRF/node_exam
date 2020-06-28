$(document).ready( () => {

    $("#productButton").click( () => {

        let itemInfo = {
            itemName: $("#name").val(),
            itemPrice: $("#price").val(),
            itemSize: $("#size").val(),
            itemQuantity: $("#quantity").val()
        }

        //console.log(itemInfo);

        $.ajax({
            method: "POST",
            url: "/newProduct",
            data: itemInfo,
            success: function (status) {
                if (status === true) {
                    alert("product has been added");
                    location.replace("/itemPage");
                } else {
                    alert("something went wrong");
                }
            }
        });
    });


});