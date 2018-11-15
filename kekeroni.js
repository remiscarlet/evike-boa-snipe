var ENABLED = false;

var CC_NAME = "Joe Schmoe"
var CC_NUM = "4111111111111111"
var CC_EXP = "12/34"
var CC_CVV = "666"

var EPIC_DEAL_ITEM_NAME = "THE BOX OF AWESOMENESS - \"Flash Edition\"";
var BUY_ENABLED = false;
var COUPON = "freeship";

/*==================================*/
if (ENABLED) { run(); }
function run() {
    var curr_url  = window.location.href;
    console.log(curr_url)
    
    if ( ! ensureLoggedIn(curr_url)) { return; };
    
    if (curr_url === "https://www.evike.com/epic-deals/") {
        openBoALinkIfAvailable();
        var ms_to_wait = (getRandomInt(15) + 15) * 1000;
        setTimeout(function() {
            location.reload();
        }, ms_to_wait);
    } else if (curr_url === "https://www.evike.com/account.php") {
        // Account page. We get here if we just logged in. Redirect to epic deals page.
        setUrl("https://www.evike.com/epic-deals/");
    } else if (curr_url === "https://www.evike.com/shopping_cart.php") {
        //if (ensureOnlyOneItemInCart()) {
            setUrl("https://www.evike.com/checkout_shipping.php");
        //}
    } else if (curr_url === "https://www.evike.com/ec_shipping.php") {
        // Select Ground Shipping
        $('input[value="ups_GND"]').click();

        // Click "Next"
        $('form[name="checkout_address"]').children('button.blue').click();
    } else if (curr_url === "https://www.evike.com/checkout_payment.php") {
        enterCCInfo();

        // Enter free 3 day
        //$('input[name="coupon"]').val("Free3Day");

        // Review order page
        $('form[name="checkout_payment"]').children('button.blue').click();
    } else if (curr_url === "https://www.evike.com/checkout_confirmation.php") {
        if (isTargetInCart()) {
            console.log("PLACING ORDER");
            // PLACE ORDER
            if (BUY_ENABLED) {
                //$('button[name="placeorderbuttont"]').click();
            }
        }
    } else if (curr_url.indexOf("https://www.evike.com/products/") !== -1) {
        var title_text = $('h1.header-product').text().toLowerCase();
        
        if(title_text.indexOf(EPIC_DEAL_ITEM_NAME.toLowerCase()) !== -1) {
            $('.addtocart').click();
        } else {
            console.log("On unknown item page!")
        }
    } else if (curr_url === "https://www.evike.com/logoff/") {
        console.log("phew");
    } else if (curr_url === "https://www.evike.com/checkout_success.php") { 
        setUrl("https://www.evike.com/logoff/");
    } else {
        setUrl("https://www.evike.com/logoff/")
    }
}

function isTargetInCart() {
    var text = $('#disclaimerbox ~ div.linebox').text();
    return text.toLowerCase().indexOf(EPIC_DEAL_ITEM_NAME.toLowerCase()) !== -1;
}

function enterCCInfo() {
    var exp_month = CC_EXP.split("/")[0];
    var exp_year = CC_EXP.split("/")[1];

    $('input[name="authorizenet_aim_cc_owner"]').val(CC_NAME);
    $('input[name="authorizenet_aim_cc_number"]').val(CC_NUM);
    $('select[name="authorizenet_aim_cc_expires_month"] option[value="'+exp_month+'"]').prop('selected', 'selected').change();
    $('select[name="authorizenet_aim_cc_expires_year"] option[value="'+exp_year+'"]').prop('selected', 'selected').change();
    $('input[name="authorizenet_aim_cc_cvv"]').val(CC_CVV);
}

/** 
 * Doesn't technically ensure "only one item" but sets off the chain of events to get back to cart page with just BoA
 * 
 * If more than one item, clear cart.
 * Once cleared, go back to epic deals page.
 * Once there, rest of logic will handle adding the BoA item into cart if it's available.
 *
 * The returns are icky.
 */
function ensureOnlyOneItemInCart() {
    var cart_len = $('.cartlistproduct').length;
    if (cart_len > 1) {
        // Select all products in cart
        $('table.cartlist tr[class^="productListing"]').each(function() {
            $(this).find('td.cartlistselect input').click();
        });

        // Update cart
        $('form[name="cart_quantity"] > button.gray').click();

        return false;
    } else if (cart_len === 0) {
        // Nothing in cart. back to epic deals page.
        setUrl("https://www.evike.com/epic-deals/");
        return false;
    }
    return true;
}

function openBoALinkIfAvailable() {
    $('.dealcontainer').find('.dealitem').each(function() {
        var url = $(this).children('a').attr('href');
        var text = $(this).text().toLowerCase();
        if ((text.indexOf(EPIC_DEAL_ITEM_NAME.toLowerCase()) !== -1) &&
            (text.indexOf("add to cart") !== -1)){
            setUrl(url);
        }
    });
}

function ensureLoggedIn(curr_url) {
    var acct_container_text = $('.account-container').text();
    
    if (curr_url === "https://www.evike.com/login.php") {
        console.log("Logging in after delay");
        setTimeout(function() {
            $('form[name="login"]').children('button').click();
            return false;
        }, 5000);
    } else if (acct_container_text.indexOf("Sign In") !== -1) {
        setUrl('https://www.evike.com/login.php');
        return false;
    }    

    return true;
}

function setUrl(url) {
    console.log("Redirecting to: "+url);
    setTimeout(function() {location.replace(url);}, 2000)
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
