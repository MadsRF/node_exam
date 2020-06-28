$(document).ready( () => {

    $("#addButton").click( () => {
        window.location.href = "/addItemPage";
    });

    // event handler at the top-level inside doc.ready
    function deletedProduct() {
        let btn = $(this);
        let row = btn.closest("tr");
        let productId = row.data("productId");
        let shopId = row.data("shopId");

        $.ajax({
            method: "POST",
            url: "/deletedProduct",
            data: { 
                productId: productId,
                shopId: shopId,
            },
            success: function (status) {
                if (status === true) {
                    alert("Product has been deleted");
                    location.reload();
                } else {
                    alert("Something went wrong");
                }
            }
        });
    }

    // event listener
    $(document).on("click", ".deleteProduct", deletedProduct);

    // Takes the current url 
    const url = window.location.href;
    let urlFormat = url.substr(0, url.lastIndexOf("/")-9);

    // Jquery getting our json product data from API
    $.get(urlFormat+"/products", (data) => {

        let shopId = data[0].id
            //console.log(shopId);
        
        let rows = data[0].products.map(item => {

            let $clone = $('#itemTable tfoot tr').clone();
            $clone.data("productId", item.id);
            $clone.data("shopId", shopId);
            
            $clone.find('.name').html(item.name);
            $clone.find('.price').html(item.price + " kr.");
            $clone.find('.size').html(item.size);
            $clone.find('.quantity').html(item.quantity);

            $clone.find('.buttons').html(`<button class="deleteProduct" type="button">Delete</button><br>`);

            return $clone;
        });
        
        //console.log(rows)

        // appends to our frontpage html 
        $("#itemTable tbody").append(rows);

    });

});