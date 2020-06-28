$(document).ready( () => {

    // Takes the current url 
    const url = window.location.href;
    let urlFormat = url.substr(0, url.lastIndexOf("/")-12);

    //console.log(urlFormat)

    // Jquery getting our json order data from API
    $.get(urlFormat+"/archive", (data) => {

        // sorts the json data from our get request by the time value
        let sorted = data.sort(function (a, b) {
            return parseFloat(a.time) - parseFloat(b.time);
        });

        // Loops through our orderlist api and sets up how the table should look like
        let rows = sorted.map(item => {

            let $clone = $('#archiveTable tfoot tr').clone();

            //this is data we don't display but use to be able to check diffrent things 
            $clone.data("id", item.id);
            $clone.data("coffeshop_id", item.coffeeshop_id);
            $clone.data("customer_email", item.customer_email);
            $clone.data("order_status", item.order_status);

            // this checks if the order has been accepted
            if (item.order_status === true) {
                $clone.find('.order_status').html("<h4>Collected</h4>");
            } else {

                $clone.find('.order_status').html("<h4>Canceled</h4>");
            }

            // this is data we display
            $clone.find('.customer_name').text(item.customer_name);
            $clone.find('.date').text(item.date);
            $clone.find('.comments').text(item.comments);
            $clone.find('.total').text(item.total + " kr.");

            // this is our time typecast because our time format is ex. number 103040. after cast its "10:30:40" = "hour:minute:second"
            let timeToString = item.time.toString();
            let timeToStringHour = timeToString.slice(0, 2);
            let timeToStringMinute = timeToString.slice(2, 4);
            let timeToStringSecond = timeToString.slice(4, 6);
            let timeToStringFullTime = timeToStringHour + ":" + timeToStringMinute + ":" + timeToStringSecond;
            $clone.find('.time').html(timeToStringFullTime + '<br><br>' + item.date);

            // Loops through orders product name
            let productsName = item.products.map(prod => `${prod.name}`);
            $clone.find('.products').html(productsName.join('<br />'));

            // Loops through orders product price
            let productsPrice = item.products.map(prod => `${prod.price} Kr.`);
            $clone.find('.price').html(productsPrice.join('<br />'));

            return $clone;
        });

        // appends to our frontpage html 
        $("#archiveTable tbody").append(rows);

    });

});